# nojquery-Dokumentationsgenerator – Phase 4

## Zweck

Der Generator analysiert bei jedem Lauf ausschließlich die Datei:

```text
docs/assets/js/nojquery.core.js
```

Sie ist die einzige technische Quelle der Wahrheit.

## Start unter Windows

```text
tools\doc-generator\validate_docs.bat
```

Alternativ:

```text
py -3 tools\doc-generator\generate_docs_inventory.py --project-root .
```

## Start unter Linux/macOS

```text
./tools/doc-generator/validate_docs.sh
```

## Erzeugte Dateien

- `api_inventory.json` – tatsächlich erkannte Core-API
- `documentation_status.json` – Auditstatus aller Dokumentationsseiten
- `next_module.json` – nächster nicht dokumentierter Namespace
- `generator.log` – Laufprotokoll

## Abbruchbedingungen

Der Lauf endet mit Fehlerstatus, wenn:

- eine Seite fehlt,
- ein dokumentiertes Modul im Core nicht existiert,
- dieselbe API mehreren Seiten zugeordnet ist,
- ein lokaler Link defekt ist.

Teilweise fehlende Methodenerwähnungen werden im Statusbericht aufgeführt. Sie werden nicht stillschweigend ergänzt.

## Neue Dokumentationsseite registrieren

Nach dem Erstellen einer Seite wird sie in `manifest.json` aufgenommen. Beispiel:

```json
{
  "page": "color/index.html",
  "namespaces": ["color"]
}
```

Danach muss die Validierung erneut ausgeführt werden.
