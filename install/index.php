<?php
declare(strict_types=1);
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-store');
$m=json_decode(file_get_contents(dirname(__DIR__).'/manifest.json'),true,512,JSON_THROW_ON_ERROR);
function e(string $s): string {return htmlspecialchars($s, ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
$checks=['PHP >= 8.1'=>version_compare(PHP_VERSION,'8.1','>='),'Produktmanifest'=>isset($m['product_code'],$m['version'])];
foreach($m['required_files']??[] as $f) {$checks[$f]=is_file(dirname(__DIR__).'/'.$f);}
$ok=!in_array(false,$checks,true);
?><!doctype html><html lang="de"><meta charset="utf-8"><title>easyIT Installation</title><style>body{background:#081c35;color:#eef5ff;font:16px system-ui;max-width:850px;margin:40px auto;padding:20px}main{background:#102d4c;padding:28px;border-radius:12px}a{color:#8ed8ff}li{margin:10px 0}</style><main><h1><?=e($m['name'])?> – Installation</h1><p>Version <?=e($m['version'])?> · Paketstandard 1.2</p><ul><?php foreach($checks as $name=>$pass): ?><li><?=e($name)?>: <?=$pass?'OK':'FEHLER'?></li><?php endforeach ?></ul><p><?=$ok?'Dateiprüfung erfolgreich.':'Installation unvollständig.'?></p><?php if($ok): ?><p><?=e($m['installation_note'])?></p><p><a href="../index.html">Projekt öffnen</a></p><?php endif ?><p>Diese Seite führt keine SQL-Befehle aus und vergibt keine Lizenz. Nach Abschluss den Installationsordner sperren oder entfernen.</p></main></html>
