<?php
// ─────────────────────────────────────────────
// api/login.php
// POST { email, password }
// Returns: { user_id, email, role } + sends OTP
// ─────────────────────────────────────────────

require_once __DIR__ . '/helpers.php';
api_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$data     = body();
$email    = trim(strtolower($data['email']    ?? ''));
$password = $data['password'] ?? '';

if (!$email || !$password) fail('Email and password are required.');

$pdo  = db();
$stmt = $pdo->prepare('SELECT * FROM viet_users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

// Deliberate generic error — don't reveal whether email exists
if (!$user || !password_verify($password, $user['password']))
    fail('Incorrect email or password.');

// Teachers awaiting admin approval cannot log in yet
if ($user['role'] === 'teacher' && $user['status'] === 'pending')
    fail('Your teacher account is awaiting admin approval. You will receive an email when approved.', 403);

if ($user['status'] === 'rejected')
    fail('Your account has been rejected. Contact info@waytogrowth.nl if you think this is a mistake.', 403);

// ── Send OTP ──────────────────────────────────
$code = generate_otp((int) $user['id']);
send_otp_email($user['email'], $code, 'login');

ok([
    'user_id' => (int) $user['id'],
    'email'   => $user['email'],
    'role'    => $user['role'],
    'message' => 'Verification code sent. Check your email.',
]);
