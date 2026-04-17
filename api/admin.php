<?php
// ─────────────────────────────────────────────
// api/admin.php
// POST { action: 'pending' }        — list pending teachers
// POST { action: 'users' }          — list all users
// POST { action, target_id }        — approve / reject
// ─────────────────────────────────────────────

require_once __DIR__ . '/helpers.php';
api_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$admin  = require_admin();
$pdo    = db();
$data   = body();
$action = $data['action'] ?? '';

// ── List pending teachers ─────────────────────
if ($action === 'pending') {
    $stmt = $pdo->prepare('
        SELECT id, email, full_name, created_at
        FROM   viet_users
        WHERE  role = "teacher" AND status = "pending"
        ORDER  BY created_at ASC
    ');
    $stmt->execute();
    ok(['users' => $stmt->fetchAll()]);
}

// ── List all users ────────────────────────────
if ($action === 'users') {
    $stmt = $pdo->prepare('
        SELECT u.id, u.email, u.full_name, u.role, u.status,
               u.created_at, u.last_login,
               p.lessons, p.q_score, p.q_total
        FROM   viet_users u
        LEFT   JOIN viet_progress p ON p.user_id = u.id
        WHERE  u.role != "admin"
        ORDER  BY u.created_at DESC
    ');
    $stmt->execute();
    ok(['users' => $stmt->fetchAll()]);
}

// ── Approve / reject ──────────────────────────
if ($action === 'approve' || $action === 'reject') {
    $target_id = (int) ($data['target_id'] ?? 0);
    if (!$target_id) fail('target_id is required.');

    $stmt = $pdo->prepare('SELECT * FROM viet_users WHERE id = ? AND role = "teacher"');
    $stmt->execute([$target_id]);
    $target = $stmt->fetch();
    if (!$target) fail('Teacher not found.', 404);

    $new_status = $action === 'approve' ? 'active' : 'rejected';
    $pdo->prepare('UPDATE viet_users SET status = ? WHERE id = ?')
        ->execute([$new_status, $target_id]);

    $pdo->prepare('INSERT INTO viet_admin_log (admin_id, action, target_id) VALUES (?, ?, ?)')
        ->execute([$admin['id'], $action, $target_id]);

    $subject = $action === 'approve'
        ? 'Your Tiếng Việt teacher account has been approved'
        : 'Your Tiếng Việt teacher account registration';

    $body_text = $action === 'approve'
        ? "Hi {$target['full_name']},\n\nYour teacher account has been approved. You can now log in at:\nhttps://waytogrowth.nl/vietnamese/login.html\n\n— Tiếng Việt, by Way to Growth"
        : "Hi {$target['full_name']},\n\nUnfortunately your teacher registration could not be approved at this time.\n\nIf you think this is a mistake, please contact info@waytogrowth.nl.\n\n— Tiếng Việt, by Way to Growth";

    mail($target['email'], $subject, $body_text, 'From: Tiếng Việt <noreply@waytogrowth.nl>');

    ok(['message' => "User {$action}d successfully."]);
}

fail('Unknown action.');

