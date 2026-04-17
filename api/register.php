<?php
// ─────────────────────────────────────────────
// api/register.php
// POST { email, password, role, full_name }
// ─────────────────────────────────────────────

require_once __DIR__ . '/helpers.php';
api_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$data      = body();
$email     = trim(strtolower($data['email']     ?? ''));
$password  = $data['password']  ?? '';
$role      = $data['role']      ?? '';
$full_name = trim($data['full_name'] ?? '');

// ── Validate ──────────────────────────────────
if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    fail('Please enter a valid email address.');

if (strlen($password) < 8)
    fail('Password must be at least 8 characters.');

if (!in_array($role, ['student', 'teacher'], true))
    fail('Role must be student or teacher.');

if ($full_name === '')
    fail('Please enter your name.');

// ── Check duplicate ───────────────────────────
$pdo  = db();
$stmt = $pdo->prepare('SELECT id FROM viet_users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) fail('An account with that email already exists.');

// ── Create user ───────────────────────────────
$hash   = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
$status = 'pending'; // all new users start pending until OTP verified

$pdo->prepare('
    INSERT INTO viet_users (email, password, role, status, full_name)
    VALUES (?, ?, ?, ?, ?)
')->execute([$email, $hash, $role, $status, $full_name]);

$user_id = (int) $pdo->lastInsertId();

// Create blank progress row
$pdo->prepare('INSERT INTO viet_progress (user_id) VALUES (?)')
    ->execute([$user_id]);

// ── Send OTP ──────────────────────────────────
$code = generate_otp($user_id);
send_otp_email($email, $code, 'register');

ok([
    'user_id' => $user_id,
    'email'   => $email,
    'message' => 'Verification code sent. Check your email.',
]);
