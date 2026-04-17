<?php
// ─────────────────────────────────────────────
// api/roster.php
// POST { action: 'list' }                         — list all students + progress
// POST { action: 'set_lessons', student_id, lessons } — set lesson level
// ─────────────────────────────────────────────

require_once __DIR__ . '/helpers.php';
api_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$user = require_auth();
$pdo  = db();

if (!in_array($user['role'], ['teacher', 'admin'], true))
    fail('Only teachers can access the roster.', 403);

$data   = body();
$action = $data['action'] ?? '';

// ── List students ─────────────────────────────
if ($action === 'list') {
    $stmt = $pdo->prepare('
        SELECT u.id, u.email, u.full_name, u.status, u.last_login,
               p.lessons, p.q_score, p.q_total, p.streak, p.known_cards,
               GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ", ") AS class_names
        FROM   viet_users u
        LEFT   JOIN viet_progress p ON p.user_id = u.id
        LEFT   JOIN viet_class_members cm ON cm.user_id = u.id AND cm.role = "student"
        LEFT   JOIN viet_classes c ON c.id = cm.class_id
        WHERE  u.role = "student" AND u.status = "active"
        GROUP  BY u.id
        ORDER  BY u.full_name ASC
    ');
    $stmt->execute();
    $rows = $stmt->fetchAll();

    foreach ($rows as &$row) {
        $row['known']       = json_decode($row['known_cards'] ?? '[]', true);
        $row['q_score']     = (int) $row['q_score'];
        $row['q_total']     = (int) $row['q_total'];
        $row['streak']      = (int) $row['streak'];
        $row['lessons']     = (int) ($row['lessons'] ?? 5);
        $row['class_names'] = $row['class_names'] ?? null;
        unset($row['known_cards']);
    }

    ok(['students' => $rows]);
}

// ── Set lesson level ──────────────────────────
if ($action === 'set_lessons') {
    $student_id = (int) ($data['student_id'] ?? 0);
    $lessons    = max(1, min(32, (int) ($data['lessons'] ?? 5)));
    if (!$student_id) fail('student_id is required.');

    $pdo->prepare('
        INSERT INTO viet_progress (user_id, lessons)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE lessons = VALUES(lessons)
    ')->execute([$student_id, $lessons]);

    ok(['message' => 'Lesson level updated.']);
}

fail('Unknown action.');
