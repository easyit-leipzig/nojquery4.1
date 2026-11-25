# easyIT Projektstandard 1.2 – ergänzende Projektvorlage

Verbindlich gemäß INSTALL_STANDARD_0120.md und wiz_package_analyze() des gelieferten Servers: genau ein manifest.json und install/index.php auf derselben Wurzelebene. ZIP maximal 25 MiB, entpackt 250 MiB, 2500 Einträge. Keine unsicheren Pfade, Symlinks oder Kompressionsrate über 1000. Manifest kleiner als 32768 Byte für Formularübernahme. Typ: programm, modul, bibliothek, paket, sonstiges. Produktcode für API: alphanumerisch beginnend, insgesamt 3–100 Zeichen, danach auch Punkt, Minus, Unterstrich. Version: 1–64 Zeichen, alphanumerisch beginnend, danach auch . _ + -.

Zusätzliche Manifestfelder dieser Vorlage sind lokale Konventionen, keine serverseitig erzwungenen Felder. Der Server archiviert das Original, synchronisiert den Produktkatalog und führt den Installer nicht aus. Bei vorhandenen Produktcodes bleibt die Downloadfreigabe bestehen. Keine automatische Lizenzvergabe.

Installation: ZIP nach Prüfung lokal in einen separaten Projektordner entpacken, nicht über den Lizenzserver kopieren. install/index.php auf dem Zielserver aufrufen. Bei Datenbankprojekten eigenes Schema und Migrationen ergänzen; SQL manuell durch einen autorisierten Administrator importieren. Keine Beispielzugänge produktiv verwenden. Installer nach Abschluss sperren. Für lizenzpflichtige PHP-Funktionen Client serverseitig vor jeder geschützten Aktion aufrufen; Fehler müssen Zugriff verweigern. Rein clientseitiges JavaScript kann nach Auslieferung nicht zuverlässig gesperrt werden.

Lizenz-API: Tatsächlicher Servercode verwendet JSON license_key bei activate, activation_token bei verify/deactivate, nicht Bearer wie im älteren README. installation_id stabil und zufällig (z.B. bin2hex(random_bytes(16))). Aktivierungstoken außerhalb des Webroots speichern, niemals im Browser ausgeben. HTTPS zwingend. Beispielclient unter integration/.

nojQuery: build/nojquery.min.js oder build/nojquery.full.js einbinden. Paketmanager: package-manager/index.html. Empfehlung: lizenzfreier Download (package.json nennt MIT).
