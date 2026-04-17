<?php
// ─────────────────────────────────────────────
// api/verify.php
// POST { user_id, code }
// Returns: { token, role, name, lessons }
// ─────────────────────────────────────────────

require_once __DIR__ . '/helpers.php';
api_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$data    = body();
$user_id = (int) ($data['user_id'] ?? 0);
$code    = trim($data['code'] ?? '');

if (!$user_id || !$code) fail('User ID and code are required.');
if (!preg_match('/^\d{6}$/', $code)) fail('Invalid code format.');

$pdo = db();

// ── Check OTP ─────────────────────────────────
$stmt = $pdo->prepare('
    SELECT id FROM viet_otps
    WHERE  user_id    = ?
      AND  code       = ?
      AND  used       = 0
      AND  expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
');
$stmt->execute([$user_id, $code]);
$otp = $stmt->fetch();

if (!$otp) fail('Invalid or expired code. Request a new one.');

// Mark OTP used
$pdo->prepare('UPDATE viet_otps SET used = 1 WHERE id = ?')
    ->execute([$otp['id']]);

// ── Fetch user ────────────────────────────────
$stmt = $pdo->prepare('SELECT * FROM viet_users WHERE id = ?');
$stmt->execute([$user_id]);
$user = $stmt->fetch();

if (!$user) fail('User not found.', 404);

// ── Activate if still pending (first-time registration) ──
// Students become active immediately.
// Teachers stay pending until admin approves — but OTP is still validated
// (so they know their email works) and we tell them to wait.
if ($user['status'] === 'pending') {
    if ($user['role'] === 'student' || $user['role'] === 'admin') {
        $pdo->prepare('UPDATE viet_users SET status = "active" WHERE id = ?')
            ->execute([$user_id]);
        $user['status'] = 'active';
    } elseif ($user['role'] === 'teacher') {
        // OTP verified but still pending approval
        // Notify admin
        send_admin_notification($user['email'], $user['full_name'] ?? $user['email']);
        ok([
            'pending_approval' => true,
            'message'          => 'Your email has been verified. Your teacher account is awaiting admin approval. You will receive an email when it is approved.',
        ]);
    }
}

if ($user['status'] !== 'active') fail('Account is not active.', 403);

// ── Create 30-day session ─────────────────────
$token = create_session($user_id);

// ── Fetch progress ────────────────────────────
$stmt = $pdo->prepare('SELECT * FROM viet_progress WHERE user_id = ?');
$stmt->execute([$user_id]);
$progress = $stmt->fetch() ?: ['lessons' => 5, 'known_cards' => '[]', 'q_score' => 0, 'q_total' => 0, 'streak' => 0];

ok([
    'token'      => $token,
    'user_id'    => (int) $user['id'],
    'email'      => $user['email'],
    'role'       => $user['role'],
    'full_name'  => $user['full_name'],
    'lessons'    => (int) $progress['lessons'],
    'known'      => json_decode($progress['known_cards'] ?? '[]', true),
    'q_score'    => (int) $progress['q_score'],
    'q_total'    => (int) $progress['q_total'],
    'streak'     => (int) $progress['streak'],
]);
