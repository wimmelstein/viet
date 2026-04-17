<?php
// ─────────────────────────────────────────────
// api/db.php — database connection
// Keep this file outside the web root if possible,
// or protect with .htaccess (deny from all).
// ─────────────────────────────────────────────

define('DB_HOST', 'localhost');
define('DB_NAME', 'qb210430_wp380');   // your database name
define('DB_USER', 'qb210430_wp380');   // your database user
define('DB_PASS', 'SX9T2V1)p@'); // ← put real password here, never commit this file
define('DB_CHARSET', 'utf8mb4');

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}
