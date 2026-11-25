# Core-Kurzbefehle (Legacy-Kompatibilität)

Alle Kürzel sind **case-sensitive** und höchstens drei Zeichen lang. Die Langformen bleiben verfügbar. `a()` bedeutet `append()`; für `after()` gilt `aft()`.

```javascript
nj('#ziel').a('<span>Neu</span>').aCl('aktiv');
nj('#ziel').htm('<b>Inhalt</b>');
nj('#ziel').n();
```

Die verbindliche vollständige Zuordnung ist im Core als `nj.coreShortcuts` auslesbar. Mit `nj.resolveCoreShortcut('aCl')` erhält man `addClass`. Bestehende ältere Synonyme wie `app`, `aCN` oder `nEl` bleiben erhalten, auch wenn diese teilweise länger als drei Zeichen sind. Eine automatische Umwandlung der Schreibweise findet nicht statt.

**Hinweis:** Die Zuordnungen wurden anhand der vorliegenden Core-Version und der explizit genannten historischen Beispiele erstellt. Für eine garantierte 1:1-Rekonstruktion aller historischen Kürzel ist die ursprüngliche Alias-Tabelle erforderlich.
