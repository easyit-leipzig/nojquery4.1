# Paketmanager nojquery 4.1 (PHP)

Der Paketmanager läuft direkt unter **Apache + PHP 8.1 oder neuer**, z. B. mit XAMPP unter Windows.
**Python wird nicht benötigt**, und auch die PHP-Erweiterung `zip`/`ZipArchive` ist **nicht nötig**. Sofern verfügbar, nutzt der Generator die PHP-zlib-Kompression; ansonsten erzeugt er ein unkomprimiertes, standardkonformes ZIP.

## Installation in XAMPP

1. ZIP-Projektarchiv entpacken und den Ordner `nojquery4.1` unter `C:\xampp\htdocs\` ablegen.
2. Apache im XAMPP Control Panel starten.
3. `http://localhost/nojquery4.1/package-manager/` im Browser öffnen.
4. Core bleibt immer aktiviert. Optionale Module auswählen und **ZIP-Paket herunterladen** anklicken.

Der Browser sendet die Modul-IDs als JSON mit `POST` an `package-manager/download.php`. Der Server überprüft die IDs, ergänzt `core` und alle benötigten Abhängigkeiten und erzeugt die ZIP-Datei direkt in PHP. Es werden **keine temporären Dateien geschrieben**.

## Test des PHP-Endpunkts

```bash
curl -X POST http://localhost/nojquery4.1/package-manager/download.php \
  -H 'Content-Type: application/json' \
  -d '{"modules":["form"]}' -o nojquery-4.1-custom.zip
```

Bei der Auswahl von `form` werden automatisch `ajax` und `core` mit aufgenommen. Ein ZIP nur mit Core ist über `{"modules":[]}` möglich.

## Paketinhalt

- `nojquery.custom.js` – zusammengefasste JavaScript-Datei (Core, BaseManager bei optionalen Modulen, ausgewählte Module)
- `modules/` – Einzeldateien; Ladefolge in `package.json` angegeben
- `package.json` – Versionsnummer, enthaltene Module und Dateien
- `docs/API_BEISPIELE.html` – API mit Befehlsbeispielen
- `docs/core/SHORTCUTS.md` – Kurzbefehle

Bei einem Fehler zeigt der Paketmanager den PHP-Fehler oder die HTTP-Fehlernummer im Browser an. Serverfehler stehen außerdem im Apache/PHP-Fehlerprotokoll.
