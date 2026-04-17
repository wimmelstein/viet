<?php
// ─────────────────────────────────────────────
// api/viewas.php
// POST { action: 'start',  target_id }  — admin starts view-as session
// POST { action: 'end',    va_token  }  — end view-as session
// POST { action: 'verify', va_token  }  — verify view-as token, return target user
// ─────────────────────────────────────────────

require_once __DIR__ . '/helpers.php';
api_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$pdo    = db();
$data   = body();
$action = $data['action'] ?? '';

// ── Audit log helper ──────────────────────────
function audit_log(string $event, array $context = []): void {
    $log_dir  = __DIR__ . '/../../log';
    $log_file = $log_dir . '/audit.log';

    $ts      = date('Y-m-d H:i:s');
    $parts   = [$ts, 'VIEWAS', $event];
    foreach ($context as $k => $v) {
        $parts[] = "{$k}={$v}";
    }
    $line = implode('  ', $parts) . "\n";

    // Append — fail silently if dir not writable
    @file_put_contents($log_file, $line, FILE_APPEND | LOCK_EX);
}

// ── Start view-as ─────────────────────────────
if ($action === 'start') {
    $admin     = require_admin();
    $target_id = (int) ($data['target_id'] ?? 0);
    if (!$target_id) fail('target_id is required.');

    // Fetch target user
    $stmt = $pdo->prepare('SELECT id, email, full_name, role, status FROM viet_users WHERE id = ?');
    $stmt->execute([$target_id]);
    $target = $stmt->fetch();
    if (!$target) fail('User not found.', 404);
    if ($target['status'] !== 'active') fail('User is not active.');
    if ($target['role'] === 'admin') fail('Cannot view-as another admin.');

    // Create a short-lived view-as token (2 hours)
    $va_token = 'va_' . bin2hex(random_bytes(24));
    $pdo->prepare('
        INSERT INTO viet_viewas (token, admin_id, target_id, created_at, expires_at)
        VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR))
    ')->execute([$va_token, $admin['id'], $target_id]);

    audit_log('start', [
        'admin'  => $admin['email'],
        'target' => $target['email'],
        'role'   => $target['role'],
        'id'     => $target_id,
    ]);

    ok([
        'va_token'   => $va_token,
        'target_id'  => (int) $target['id'],
        'email'      => $target['email'],
        'full_name'  => $target['full_name'],
        'role'       => $target['role'],
    ]);
}

// ── Verify view-as token ──────────────────────
if ($action === 'verify') {
    $va_token = trim($data['va_token'] ?? '');
    if (!$va_token) fail('va_token is required.');

    $stmt = $pdo->prepare('
        SELECT va.admin_id, va.target_id, va.created_at,
               u.email, u.full_name, u.role, u.status,
               a.email AS admin_email,
               p.lessons, p.q_score, p.q_total, p.streak, p.known_cards
        FROM   viet_viewas va
        JOIN   viet_users  u ON u.id = va.target_id
        JOIN   viet_users  a ON a.id = va.admin_id
        LEFT   JOIN viet_progress p ON p.user_id = va.target_id
        WHERE  va.token = ?
          AND  va.expires_at > NOW()
    ');
    $stmt->execute([$va_token]);
    $row = $stmt->fetch();

    if (!$row) fail('View-as session invalid or expired.', 401);
    if ($row['status'] !== 'active') fail('Target user is not active.');

    ok([
        'user_id'    => (int) $row['target_id'],
        'email'      => $row['email'],
        'full_name'  => $row['full_name'],
        'role'       => $row['role'],
        'admin_email'=> $row['admin_email'],
        'lessons'    => (int) ($row['lessons']  ?? 5),
        'known'      => json_decode($row['known_cards'] ?? '[]', true),
        'q_score'    => (int) ($row['q_score']  ?? 0),
        'q_total'    => (int) ($row['q_total']  ?? 0),
        'streak'     => (int) ($row['streak']   ?? 0),
    ]);
}

// ── End view-as ───────────────────────────────
if ($action === 'end') {
    $va_token = trim($data['va_token'] ?? '');
    if (!$va_token) fail('va_token is required.');

    $stmt = $pdo->prepare('
        SELECT va.admin_id, va.target_id, va.created_at,
               u.email AS target_email,
               a.email AS admin_email
        FROM   viet_viewas va
        JOIN   viet_users  u ON u.id = va.target_id
        JOIN   viet_users  a ON a.id = va.admin_id
        WHERE  va.token = ?
    ');
    $stmt->execute([$va_token]);
    $row = $stmt->fetch();

    if ($row) {
        $duration = time() - strtotime($row['created_at']);
        audit_log('end', [
            'admin'    => $row['admin_email'],
            'target'   => $row['target_email'],
            'duration' => $duration . 's',
        ]);

        $pdo->prepare('DELETE FROM viet_viewas WHERE token = ?')->execute([$va_token]);
    }

    ok(['message' => 'View-as session ended.']);
}

fail('Unknown action.');
