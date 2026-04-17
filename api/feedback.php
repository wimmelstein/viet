<?php
// ─────────────────────────────────────────────
// api/feedback.php
// POST { action: 'submit', type, priority, title, body } — submit feedback
// POST { action: 'list' }                                — list all (admin)
// POST { action: 'status', id, status }                  — update status (admin)
// ─────────────────────────────────────────────

require_once __DIR__ . '/helpers.php';
api_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$user   = require_auth();
$pdo    = db();
$data   = body();
$action = $data['action'] ?? '';

// ── Submit feedback ───────────────────────────────────────────────────────────
if ($action === 'submit') {
    $type     = in_array($data['type'] ?? '', ['bug','change']) ? $data['type'] : 'bug';
    $priority = in_array($data['priority'] ?? '', ['low','medium','high']) ? $data['priority'] : 'medium';
    $title    = trim($data['title'] ?? '');
    $fbody    = trim($data['body'] ?? '');

    if (!$title) fail('Title is required.');

    $pdo->prepare("
        INSERT INTO viet_feedback (user_id, type, priority, title, body, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'new', NOW())
    ")->execute([$user['id'], $type, $priority, $title, $fbody]);

    // Email notification
    $to      = 'info@waytogrowth.nl';
    $subject = '[' . strtoupper($priority) . '] ' . ($type === 'bug' ? 'Bug' : 'Change') . ': ' . $title;
    $message = "Submitted by: {$user['full_name']} ({$user['email']})\n"
             . "Type: $type | Priority: $priority\n\n"
             . $fbody;
    @mail($to, $subject, $message, "From: noreply@waytogrowth.nl");

    ok(['message' => 'Feedback submitted. Thank you!']);
}

// ── List feedback (admin only) ────────────────────────────────────────────────
if ($action === 'list') {
    require_admin();
    $rows = $pdo->query("
        SELECT f.*, u.full_name, u.email
        FROM   viet_feedback f
        JOIN   viet_users u ON u.id = f.user_id
        ORDER  BY f.created_at DESC
    ")->fetchAll(PDO::FETCH_ASSOC);
    ok(['items' => $rows]);
}

// ── Update status (admin only) ────────────────────────────────────────────────
if ($action === 'status') {
    require_admin();
    $id     = (int)($data['id'] ?? 0);
    $status = in_array($data['status'] ?? '', ['new','reviewed','done']) ? $data['status'] : 'new';
    if (!$id) fail('Invalid ID.');
    $pdo->prepare("UPDATE viet_feedback SET status = ? WHERE id = ?")->execute([$status, $id]);
    ok(['message' => 'Updated.']);
}

fail('Unknown action.');
