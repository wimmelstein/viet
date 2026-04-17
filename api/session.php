<?php
// ─────────────────────────────────────────────
// api/session.php
// POST { action: 'get' }    — validate token, return user + progress
// POST { action: 'save', ...progress } — save progress
// ─────────────────────────────────────────────

require_once __DIR__ . '/helpers.php';
api_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$user   = require_auth();
$pdo    = db();
$data   = body();
$action = $data['action'] ?? 'get';

// ── GET session + progress ────────────────────
if ($action === 'get') {
    $stmt = $pdo->prepare('SELECT * FROM viet_progress WHERE user_id = ?');
    $stmt->execute([$user['id']]);
    $progress = $stmt->fetch() ?: [];

    ok([
        'user_id'   => (int) $user['id'],
        'email'     => $user['email'],
        'role'      => $user['role'],
        'full_name' => $user['full_name'],
        'lessons'   => (int) ($progress['lessons']  ?? 5),
        'known'     => json_decode($progress['known_cards'] ?? '[]', true),
        'q_score'   => (int) ($progress['q_score']  ?? 0),
        'q_total'   => (int) ($progress['q_total']  ?? 0),
        'streak'    => (int) ($progress['streak']   ?? 0),
    ]);
}

// ── Save progress ─────────────────────────────
if ($action === 'save') {
    $known   = json_encode($data['known']   ?? []);
    $q_score = (int) ($data['q_score'] ?? 0);
    $q_total = (int) ($data['q_total'] ?? 0);
    $streak  = (int) ($data['streak']  ?? 0);
    $lessons = max(1, min(32, (int) ($data['lessons'] ?? 5)));

    $pdo->prepare('
        INSERT INTO viet_progress (user_id, known_cards, q_score, q_total, streak, lessons)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            known_cards = VALUES(known_cards),
            q_score     = VALUES(q_score),
            q_total     = VALUES(q_total),
            streak      = VALUES(streak),
            lessons     = VALUES(lessons)
    ')->execute([$user['id'], $known, $q_score, $q_total, $streak, $lessons]);

    ok(['message' => 'Progress saved.']);
}

fail('Unknown action.');
