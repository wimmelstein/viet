<?php
// ─────────────────────────────────────────────
// api/classes.php
// All actions via POST { action, ... }
//
// Actions:
//   list              — classes this teacher belongs to
//   all_classes       — all classes (for adding co-teachers)
//   create            — create a new class { name, description }
//   get               — get one class + members { class_id }
//   add_member        — add user to class { class_id, user_id, role }
//   remove_member     — remove user from class { class_id, user_id }
//   delete            — delete a class { class_id } (creator only)
//   available_users   — students/teachers not yet in this class { class_id, role }
// ─────────────────────────────────────────────

require_once __DIR__ . '/helpers.php';
api_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$user = require_auth();
if (!in_array($user['role'], ['teacher', 'admin'], true))
    fail('Only teachers can manage classes.', 403);

$pdo    = db();
$data   = body();
$action = $data['action'] ?? '';

// ── List classes this teacher is in ──────────
if ($action === 'list') {
    $stmt = $pdo->prepare('
        SELECT c.id, c.name, c.description, c.created_by, c.created_at,
               m.role AS my_role,
               (SELECT COUNT(*) FROM viet_class_members
                WHERE class_id = c.id AND role = "student") AS student_count,
               (SELECT COUNT(*) FROM viet_class_members
                WHERE class_id = c.id AND role = "teacher") AS teacher_count
        FROM   viet_classes c
        JOIN   viet_class_members m ON m.class_id = c.id AND m.user_id = ?
        ORDER  BY c.name ASC
    ');
    $stmt->execute([$user['id']]);
    ok(['classes' => $stmt->fetchAll()]);
}

// ── Create a class ────────────────────────────
if ($action === 'create') {
    $name = trim($data['name'] ?? '');
    if (!$name) fail('Class name is required.');

    $pdo->prepare('INSERT INTO viet_classes (name, description, created_by) VALUES (?, ?, ?)')
        ->execute([$name, trim($data['description'] ?? ''), $user['id']]);

    $class_id = (int) $pdo->lastInsertId();

    // Creator is automatically a teacher member
    $pdo->prepare('INSERT INTO viet_class_members (class_id, user_id, role) VALUES (?, ?, "teacher")')
        ->execute([$class_id, $user['id']]);

    ok(['class_id' => $class_id, 'message' => 'Class created.']);
}

// ── Get one class with all members ───────────
if ($action === 'get') {
    $class_id = (int) ($data['class_id'] ?? 0);
    if (!$class_id) fail('class_id is required.');

    // Check teacher has access
    $stmt = $pdo->prepare('SELECT * FROM viet_classes WHERE id = ?');
    $stmt->execute([$class_id]);
    $class = $stmt->fetch();
    if (!$class) fail('Class not found.', 404);

    // Get members with user details and progress
    $stmt = $pdo->prepare('
        SELECT u.id, u.email, u.full_name, u.last_login,
               m.role AS class_role,
               p.lessons, p.q_score, p.q_total, p.streak, p.known_cards
        FROM   viet_class_members m
        JOIN   viet_users u ON u.id = m.user_id
        LEFT   JOIN viet_progress p ON p.user_id = u.id
        WHERE  m.class_id = ?
        ORDER  BY m.role DESC, u.full_name ASC
    ');
    $stmt->execute([$class_id]);
    $members = $stmt->fetchAll();

    foreach ($members as &$row) {
        $row['known']   = json_decode($row['known_cards'] ?? '[]', true);
        $row['q_score'] = (int) $row['q_score'];
        $row['q_total'] = (int) $row['q_total'];
        $row['streak']  = (int) $row['streak'];
        $row['lessons'] = (int) ($row['lessons'] ?? 5);
        unset($row['known_cards']);
    }

    ok(['class' => $class, 'members' => $members]);
}

// ── Add a member ──────────────────────────────
if ($action === 'add_member') {
    $class_id = (int) ($data['class_id'] ?? 0);
    $user_id  = (int) ($data['user_id']  ?? 0);
    $role     = $data['role'] ?? '';

    if (!$class_id || !$user_id) fail('class_id and user_id are required.');
    if (!in_array($role, ['teacher', 'student'], true)) fail('role must be teacher or student.');

    // Verify class exists
    $stmt = $pdo->prepare('SELECT id FROM viet_classes WHERE id = ?');
    $stmt->execute([$class_id]);
    if (!$stmt->fetch()) fail('Class not found.', 404);

    // Verify user exists and has the right role
    $stmt = $pdo->prepare('SELECT id, role FROM viet_users WHERE id = ? AND status = "active"');
    $stmt->execute([$user_id]);
    $target = $stmt->fetch();
    if (!$target) fail('User not found.', 404);

    try {
        $pdo->prepare('INSERT INTO viet_class_members (class_id, user_id, role) VALUES (?, ?, ?)')
            ->execute([$class_id, $user_id, $role]);
    } catch (\PDOException $e) {
        fail('User is already in this class.');
    }

    ok(['message' => 'Member added.']);
}

// ── Remove a member ───────────────────────────
if ($action === 'remove_member') {
    $class_id = (int) ($data['class_id'] ?? 0);
    $user_id  = (int) ($data['user_id']  ?? 0);

    if (!$class_id || !$user_id) fail('class_id and user_id are required.');

    // Prevent removing the last teacher
    $stmt = $pdo->prepare('
        SELECT COUNT(*) FROM viet_class_members
        WHERE class_id = ? AND role = "teacher"
    ');
    $stmt->execute([$class_id]);
    $teacherCount = (int) $stmt->fetchColumn();

    // Check if this user is a teacher in the class
    $stmt = $pdo->prepare('SELECT role FROM viet_class_members WHERE class_id = ? AND user_id = ?');
    $stmt->execute([$class_id, $user_id]);
    $member = $stmt->fetch();

    if ($member && $member['role'] === 'teacher' && $teacherCount <= 1) {
        fail('Cannot remove the last teacher from a class.');
    }

    $pdo->prepare('DELETE FROM viet_class_members WHERE class_id = ? AND user_id = ?')
        ->execute([$class_id, $user_id]);

    ok(['message' => 'Member removed.']);
}

// ── Delete a class ────────────────────────────
if ($action === 'delete') {
    $class_id = (int) ($data['class_id'] ?? 0);
    if (!$class_id) fail('class_id is required.');

    $stmt = $pdo->prepare('SELECT created_by FROM viet_classes WHERE id = ?');
    $stmt->execute([$class_id]);
    $class = $stmt->fetch();

    if (!$class) fail('Class not found.', 404);
    if ($class['created_by'] != $user['id'] && $user['role'] !== 'admin')
        fail('Only the class creator can delete it.', 403);

    $pdo->prepare('DELETE FROM viet_classes WHERE id = ?')->execute([$class_id]);
    ok(['message' => 'Class deleted.']);
}

// ── Available users to add ────────────────────
if ($action === 'available_users') {
    $class_id = (int) ($data['class_id'] ?? 0);
    $role     = $data['role'] ?? 'student';
    if (!$class_id) fail('class_id is required.');

    $stmt = $pdo->prepare('
        SELECT u.id, u.email, u.full_name
        FROM   viet_users u
        WHERE  u.role   = ?
          AND  u.status = "active"
          AND  u.id NOT IN (
              SELECT user_id FROM viet_class_members WHERE class_id = ?
          )
        ORDER  BY u.full_name ASC
    ');
    $stmt->execute([$role, $class_id]);
    ok(['users' => $stmt->fetchAll()]);
}

fail('Unknown action.');
