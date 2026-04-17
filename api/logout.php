<?php
// ─────────────────────────────────────────────
// api/logout.php
// POST — delete session token
// ─────────────────────────────────────────────

require_once __DIR__ . '/helpers.php';
api_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$token = trim($_POST['_token'] ?? '');

if ($token) {
    db()->prepare('DELETE FROM viet_sessions WHERE token = ?')
       ->execute([$token]);
}

ok(['message' => 'Logged out.']);
