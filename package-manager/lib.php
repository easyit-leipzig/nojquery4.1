<?php
/**
 * nojquery 4.1 - Paketgenerator (PHP 8.1+, ohne externe Pakete).
 * Die ZIP-Erstellung verwendet nur PHP-Bordmittel; ext-zip ist nicht erforderlich.
 */
declare(strict_types=1);

namespace Nojquery\PackageManager;

use InvalidArgumentException;
use RuntimeException;

function projectRoot(): string
{
    $root = realpath(__DIR__ . '/..');
    if ($root === false) {
        throw new RuntimeException('Projektverzeichnis nicht gefunden.');
    }
    return $root;
}

/** @return array<string,mixed> */
function loadManifest(): array
{
    $text = @file_get_contents(__DIR__ . '/manifest.json');
    if ($text === false) {
        throw new RuntimeException('Modulmanifest nicht lesbar.');
    }
    try {
        $manifest = json_decode($text, true, 64, JSON_THROW_ON_ERROR);
    } catch (\JsonException $exception) {
        throw new RuntimeException('Ungültiges Modulmanifest.', 0, $exception);
    }
    if (!is_array($manifest) || !isset($manifest['modules']) || !is_array($manifest['modules'])) {
        throw new RuntimeException('Modulmanifest ist unvollständig.');
    }
    return $manifest;
}

/** @param array<string,mixed> $manifest
 *  @return array<string,array<string,mixed>> */
function moduleIndex(array $manifest): array
{
    $index = [];
    foreach ($manifest['modules'] as $module) {
        if (!is_array($module) || !isset($module['id'], $module['source'], $module['dependencies']) ||
            !is_string($module['id']) || !preg_match('/\A[a-z][a-z0-9_-]*\z/D', $module['id']) ||
            !is_string($module['source']) || !is_array($module['dependencies']) ||
            isset($index[$module['id']])) {
            throw new RuntimeException('Ungültige Moduldefinition im Manifest.');
        }
        $index[$module['id']] = $module;
    }
    if (!isset($index['core'])) {
        throw new RuntimeException('Core fehlt im Modulmanifest.');
    }
    return $index;
}

/**
 * Core wird auch dann automatisch ergänzt, wenn der Client es nicht sendet.
 * Die Reihenfolge der Manifest-Einträge bleibt erhalten; alle Abhängigkeiten
 * sind im Manifest vor ihren abhängigen Modulen aufgeführt.
 *
 * @param array<mixed> $requested
 * @param array<string,mixed> $manifest
 * @return list<string>
 */
function resolveModules(array $requested, array $manifest): array
{
    if (!array_is_list($requested)) {
        throw new InvalidArgumentException('modules muss eine Modulliste sein.');
    }
    $index = moduleIndex($manifest);
    $selected = [];
    $visiting = [];
    $visit = static function (string $id) use (&$visit, &$selected, &$visiting, $index): void {
        if (!isset($index[$id])) {
            throw new InvalidArgumentException('Unbekanntes Modul: ' . $id);
        }
        if (isset($selected[$id])) {
            return;
        }
        if (isset($visiting[$id])) {
            throw new RuntimeException('Zirkuläre Modulabhängigkeit: ' . $id);
        }
        $visiting[$id] = true;
        foreach ($index[$id]['dependencies'] as $dependency) {
            if (!is_string($dependency)) {
                throw new RuntimeException('Ungültige Modulabhängigkeit.');
            }
            $visit($dependency);
        }
        unset($visiting[$id]);
        $selected[$id] = true;
    };
    $visit('core');
    foreach ($requested as $id) {
        if (!is_string($id)) {
            throw new InvalidArgumentException('Modul-IDs müssen Zeichenketten sein.');
        }
        $visit($id);
    }
    $result = [];
    foreach ($manifest['modules'] as $module) {
        if (isset($selected[$module['id']])) {
            $result[] = $module['id'];
        }
    }
    return $result;
}

function readProjectFile(string $relativePath): string
{
    $root = projectRoot();
    $full = realpath($root . '/' . $relativePath);
    if ($full === false || !str_starts_with($full, $root . DIRECTORY_SEPARATOR) || !is_file($full)) {
        throw new RuntimeException('Projektdatei fehlt oder ist unzulässig: ' . $relativePath);
    }
    $content = @file_get_contents($full);
    if ($content === false) {
        throw new RuntimeException('Projektdatei nicht lesbar: ' . $relativePath);
    }
    return $content;
}

/** @return array{0: int, 1: int} */
function zipDateTime(): array
{
    $date = getdate();
    $year = max(1980, min(2107, (int)$date['year']));
    return [((int)$date['hours'] << 11) | ((int)$date['minutes'] << 5) | intdiv((int)$date['seconds'], 2),
        (($year - 1980) << 9) | ((int)$date['mon'] << 5) | (int)$date['mday']];
}

/**
 * Erstellt ein standardkonformes ZIP im Speicher, mit DEFLATE wenn zlib verfügbar
 * ist, sonst ohne Kompression (ZIP-STORE). Benötigt keine ext-zip/ZipArchive.
 * @param array<string,string> $entries Pfad innerhalb des ZIP => Inhalt
 */
function makeZip(array $entries): string
{
    $body = '';
    $directory = '';
    [$dosTime, $dosDate] = zipDateTime();
    $offset = 0;
    $count = 0;
    foreach ($entries as $path => $data) {
        if (!is_string($path) || !is_string($data) || $path === '' || str_contains($path, '..') ||
            str_contains($path, '\\') || str_starts_with($path, '/') || str_contains($path, "\0")) {
            throw new RuntimeException('Ungültiger ZIP-Dateipfad.');
        }
        $compressed = function_exists('gzdeflate') ? gzdeflate($data, 6) : false;
        $method = $compressed !== false ? 8 : 0;
        $payload = $method === 8 ? $compressed : $data;
        $size = strlen($data);
        $compressedSize = strlen($payload);
        $nameLength = strlen($path);
        if ($size > 0xffffffff || $compressedSize > 0xffffffff || $nameLength > 65535) {
            throw new RuntimeException('ZIP-Datei überschreitet das Formatlimit.');
        }
        $crc = crc32($data);
        $local = pack('VvvvvvVVVvv', 0x04034b50, 20, 0, $method, $dosTime, $dosDate,
            $crc, $compressedSize, $size, $nameLength, 0) . $path . $payload;
        $body .= $local;
        $directory .= pack('VvvvvvvVVVvvvvvVV', 0x02014b50, 20, 20, 0, $method, $dosTime, $dosDate,
            $crc, $compressedSize, $size, $nameLength, 0, 0, 0, 0, 0, $offset) . $path;
        $offset += strlen($local);
        ++$count;
    }
    if ($count > 65535 || strlen($directory) > 0xffffffff || $offset > 0xffffffff) {
        throw new RuntimeException('ZIP-Formatlimit überschritten.');
    }
    $footer = pack('VvvvvVVv', 0x06054b50, 0, 0, $count, $count, strlen($directory), $offset, 0);
    return $body . $directory . $footer;
}

/** @param list<string> $requested
 *  @return array{zip: string, modules: list<string>} */
function buildPackage(array $requested): array
{
    $manifest = loadManifest();
    $index = moduleIndex($manifest);
    $selected = resolveModules($requested, $manifest);
    $files = [];
    $files['nojquery.core.js'] = readProjectFile($index['core']['source']);
    if (count($selected) > 1) {
        $files['nojquery.managers.base.js'] = readProjectFile('src/modules/base.js');
    }
    foreach ($selected as $id) {
        if ($id !== 'core') {
            $files['nojquery.' . $id . '.js'] = readProjectFile($index[$id]['source']);
        }
    }
    $bundle = implode("\n", array_values($files)) . "\n";
    $metadata = [
        'name' => 'nojquery',
        'version' => $manifest['version'],
        'modules' => $selected,
        'files' => array_keys($files),
    ];
    $readme = "nojquery 4.1.0 – individuelles Modulpaket\n\n"
        . "Einzeldatei: <script src=\"nojquery.custom.js\"></script>\n\n"
        . "Alternativ: Dateien in modules/ in der Reihenfolge unter 'files' in package.json laden.\n"
        . "Core und seine case-sensitiven Kurzbefehle sind immer enthalten.\n"
        . "Für optionale Module ist nojquery.managers.base.js automatisch enthalten.\n"
        . "API-Beispiele: docs/API_BEISPIELE.html\n";
    $prefix = 'nojquery-4.1-custom/';
    $entries = [
        $prefix . 'nojquery.custom.js' => $bundle,
    ];
    foreach ($files as $filename => $content) {
        $entries[$prefix . 'modules/' . $filename] = $content;
    }
    $entries[$prefix . 'package.json'] = json_encode($metadata, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . "\n";
    $entries[$prefix . 'README.txt'] = $readme;
    $entries[$prefix . 'docs/API_BEISPIELE.html'] = readProjectFile('docs/API_BEISPIELE.html');
    $entries[$prefix . 'docs/core/SHORTCUTS.md'] = readProjectFile('docs/core/SHORTCUTS.md');
    return ['zip' => makeZip($entries), 'modules' => $selected];
}
