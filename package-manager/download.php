<?php
/** HTTP-Endpunkt für den nojquery-Paketmanager auf Apache + PHP. */
declare(strict_types=1);

require_once __DIR__ . '/lib.php';

use function Nojquery\PackageManager\buildPackage;

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function jsonError(int $status, string $message): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    jsonError(405, 'Nur POST-Anfragen sind erlaubt.');
}

try {
    $length = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($length > 16384) {
        jsonError(413, 'Die Konfiguration ist zu groß.');
    }
    $body = file_get_contents('php://input');
    if ($body === false || strlen($body) > 16384) {
        jsonError(413, 'Die Konfiguration ist zu groß.');
    }
    $input = json_decode($body, true, 32, JSON_THROW_ON_ERROR);
    if (!is_array($input) || !isset($input['modules']) || !is_array($input['modules'])) {
        jsonError(400, 'Bitte eine Liste unter modules angeben.');
    }
    $result = buildPackage($input['modules']);
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="nojquery-4.1-custom.zip"');
    header('Content-Length: ' . strlen($result['zip']));
    echo $result['zip'];
} catch (\InvalidArgumentException | \JsonException $exception) {
    jsonError(400, $exception->getMessage());
} catch (\Throwable $exception) {
    error_log('[nojquery package-manager] ' . $exception->getMessage());
    jsonError(500, 'Das Paket konnte nicht erzeugt werden. Bitte PHP-Fehlerprotokoll prüfen.');
}
