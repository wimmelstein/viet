<?php
// ─────────────────────────────────────────────
// api/helpers.php — shared utilities
// ─────────────────────────────────────────────

require_once __DIR__ . '/db.php';

// ── CORS & JSON headers ───────────────────────
function api_headers(): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');          // tighten to your domain in production
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Session-Token');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// ── Responses ─────────────────────────────────
function ok(array $data = []): never {
    echo json_encode(['ok' => true] + $data);
    exit;
}

function fail(string $message, int $code = 400): never {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

// ── Input ─────────────────────────────────────
// Read from $_POST. Arrays that were JSON-stringified on the client
// (e.g. the known_cards array) are decoded automatically.
function body(): array {
    $out = [];
    foreach ($_POST as $k => $v) {
        if ($k === '_token') continue; // consumed by auth, not data
        // Try to decode JSON strings (arrays sent from flattenForForm)
        if (is_string($v) && strlen($v) > 0 && ($v[0] === '[' || $v[0] === '{')) {
            $decoded = json_decode($v, true);
            $out[$k] = ($decoded !== null) ? $decoded : $v;
        } else {
            $out[$k] = $v;
        }
    }
    return $out;
}

// ── Session auth ──────────────────────────────
// Token arrives as _token in POST body or GET query string.
function require_auth(): array {
    $token = '';
    if (!empty($_POST['_token'])) {
        $token = trim($_POST['_token']);
    } elseif (!empty($_GET['_token'])) {
        $token = trim($_GET['_token']);
    }

    if (!$token) fail('Not authenticated', 401);

    $pdo  = db();
    $stmt = $pdo->prepare('
        SELECT u.id, u.email, u.role, u.status, u.full_name
        FROM   viet_sessions s
        JOIN   viet_users    u ON u.id = s.user_id
        WHERE  s.token = ?
          AND  s.expires_at > NOW()
          AND  u.status = "active"
    ');
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) fail('Session invalid or expired', 401);
    return $user;
}

function require_admin(): array {
    $user = require_auth();
    if ($user['role'] !== 'admin') fail('Forbidden', 403);
    return $user;
}

// ── OTP ───────────────────────────────────────
function generate_otp(int $user_id): string {
    $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $pdo  = db();

    // Invalidate any previous unused OTPs for this user
    $pdo->prepare('UPDATE viet_otps SET used = 1 WHERE user_id = ? AND used = 0')
        ->execute([$user_id]);

    $pdo->prepare('
        INSERT INTO viet_otps (user_id, code, expires_at)
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 60 SECOND))
    ')->execute([$user_id, $code]);

    return $code;
}

// ── Session token ─────────────────────────────
function create_session(int $user_id): string {
    $token = bin2hex(random_bytes(32)); // 64-char hex
    $pdo   = db();

    // Clean up only expired sessions for this user, not all of them
    $pdo->prepare('DELETE FROM viet_sessions WHERE user_id = ? AND expires_at < NOW()')
        ->execute([$user_id]);

    $pdo->prepare('
        INSERT INTO viet_sessions (user_id, token, expires_at)
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))
    ')->execute([$user_id, $token]);

    // Update last_login
    $pdo->prepare('UPDATE viet_users SET last_login = NOW() WHERE id = ?')
        ->execute([$user_id]);

    return $token;
}

// ── Email ─────────────────────────────────────
function send_otp_email(string $to, string $code, string $context = 'login'): void {
    $subject = 'Your Tiếng Việt verification code';
    $action  = $context === 'register' ? 'complete your registration' : 'log in';

    $body = "Your verification code for Tiếng Việt\n\n"
          . "Code: {$code}\n\n"
          . "Enter this code to {$action}. It expires in 60 seconds.\n\n"
          . "If you did not request this, ignore this email.\n\n"
          . "— Tiếng Việt, by Way to Growth";

    $headers = implode("\r\n", [
        'From: Tiếng Việt <noreply@waytogrowth.nl>',
        'Reply-To: noreply@waytogrowth.nl',
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8',
    ]);

    mail($to, $subject, $body, $headers);
}

function send_admin_notification(string $applicant_email, string $applicant_name): void {
    $subject = 'New teacher registration awaiting approval';
    $body    = "A new teacher has registered and is awaiting your approval.\n\n"
             . "Name:  {$applicant_name}\n"
             . "Email: {$applicant_email}\n\n"
             . "Log in to the admin panel to approve or reject:\n"
             . "https://waytogrowth.nl/admin.html\n\n"
             . "— Tiếng Việt system";

    $headers = 'From: Tiếng Việt <noreply@waytogrowth.nl>';
    mail('info@waytogrowth.nl', $subject, $body, $headers);
}
