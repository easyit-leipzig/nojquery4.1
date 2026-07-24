# Phase 8 – Namespace `nj.bus`

## Technische Grundlage

`nj.bus` verwendet im Core einen nativen `EventTarget`.

## Dokumentierter Umfang

- `nj.bus.on(name, handler)`
- `nj.bus.off(name, handler)`
- `nj.bus.once(name, handler)`
- `nj.bus.emit(name, detail)`

`emit()` erzeugt ein `CustomEvent`. Die Nutzdaten werden im Handler als `event.detail` gelesen.

## Aktualisierte Komponenten

- `docs/bus/index.html`
- `docs/index.html`
- Navigation der Detailseiten
- `tools/doc-generator/manifest.json`
- automatisch neu erzeugte Inventar- und Statusdateien
- `tools/doc-generator/bus_source_excerpt.js`
