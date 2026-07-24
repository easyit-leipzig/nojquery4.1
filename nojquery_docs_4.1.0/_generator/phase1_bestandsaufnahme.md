# nojquery 4.1.0 – Phase 1: Bestandsaufnahme

## 1. Verwendete Quelle

- Archiv: `nojquery_docs_4.1.0(4).zip`
- Archivgröße: 19,954,185 Byte
- SHA-256: `931d5604ae5431e504252f81008792272f7b88370de3a5f257f747a3c9ef859a`
- Einträge im Archiv: 48
- Core: `assets/js/nojquery.core.js`
- Core-Größe: 36,698 Byte
- Core-SHA-256: `8380408d31102e4d3a37f59ecaa4566f72a9d6501d94a20420920fdc47933754`
- Im Quelltext deklarierte Version: **4.1.0**

## 2. Dokumentationsbestand

- HTML-Seiten: **18**
- Top-Level-Dokumentationsbereiche: **16**
- Eingebettete ZIP-Dateien: **10**
- Größe aller eingebetteten ZIP-Dateien: **19,891,242 Byte**

Vorhandene Bereiche:

- `ajax`
- `cache`
- `clipboard`
- `config`
- `cookies`
- `core`
- `device`
- `formatter`
- `keyboard`
- `observer`
- `router`
- `storage`
- `templates`
- `url`
- `validation`
- `zip_content`

## 3. Wrapper-API (`NJ`)

Erkannte öffentliche Wrapper-Mitglieder: **53**

`length`, `e`, `[Symbol.iterator]`, `each`, `map`, `get`, `first`, `last`, `eq`, `find`, `closest`, `parent`, `children`, `next`, `prev`, `html`, `text`, `val`, `append`, `prepend`, `before`, `after`, `appendTo`, `empty`, `remove`, `attr`, `removeAttr`, `hasAttr`, `prop`, `data`, `removeData`, `addClass`, `removeClass`, `toggleClass`, `hasClass`, `css`, `removeCss`, `show`, `hide`, `toggle`, `on`, `off`, `once`, `trigger`, `checked`, `serialize`, `rect`, `scrollIntoView`, `animate`, `fadeIn`, `fadeOut`, `is`, `exists`

## 4. Statische Namespaces

Erkannte Namespaces: **15**

- `nj.config`: `debug`, `warn`, `exposeUnderscore`, `exposeDollar`, `forceAliasOverwrite`, `ajaxTimeout`, `animation` (Zeile 381)
- `nj.storage`: `local`, `session`, `create`, `available` (Zeile 518)
- `nj.router`: `start`, `navigate`, `replace`, `params` (Zeile 653)
- `nj.url`: `parse`, `get`, `set`, `remove`, `query`, `hash` (Zeile 660)
- `nj.cookie`: `set`, `get`, `has`, `remove` (Zeile 670)
- `nj.validate`: `required`, `email`, `url`, `number`, `integer`, `date`, `phone`, `iban`, `bic`, `min`, `max`, `minLength`, `maxLength`, `test` (Zeile 678)
- `nj.format`: `number`, `money`, `percent`, `date`, `bytes` (Zeile 685)
- `nj.clipboard`: `copy`, `read` (Zeile 707)
- `nj.key`: `on`, `enter`, `escape` (Zeile 708)
- `nj.device`: `touch`, `mobile`, `tablet`, `desktop`, `online` (Zeile 709)
- `nj.color`: `hexToRgb`, `rgbToHex`, `lighten`, `darken` (Zeile 712)
- `nj.date`: `today`, `addDays`, `diff`, `format` (Zeile 717)
- `nj.random`: `int`, `float`, `string`, `color`, `uuid` (Zeile 719)
- `nj.bus`: `on`, `off`, `once`, `emit` (Zeile 723)
- `nj.core`: `utilities` (Zeile 727)

## 5. Direkte statische APIs

Erkannte direkte Eigenschaften, Funktionen, Instanzen und dynamisch erzeugte Methoden: **42**

- `nj.version` — property
- `nj.NJ` — property
- `nj.ready` — function
- `nj.create` — function
- `nj.extend` — function
- `nj.deepEqual` — function
- `nj.isJSON` — function
- `nj.arrayRemove` — function
- `nj.filterObjectArray` — function
- `nj.forEach` — function
- `nj.cssVar` — function
- `nj.detectBrowser` — function
- `nj.request` — function
- `nj.upload` — function
- `nj.cache` — instance
- `nj.CacheManager` — property
- `nj.observe` — function
- `nj.visible` — function
- `nj.resize` — function
- `nj.escapeHTML` — function
- `nj.template` — function
- `nj.render` — function
- `nj.route` — function
- `nj.navigate` — function
- `nj.drag` — function
- `nj.drop` — function
- `nj.sortable` — function
- `nj.uuid` — function
- `nj.logger` — function
- `nj.log` — function
- `nj.exposeAliases` — function
- `nj.releaseAlias` — function
- `nj.hasAlias` — function
- `nj.fEa` — function
- `nj.ddS` — function
- `nj.ddG` — function
- `nj.delete` — dynamic_function
- `nj.get` — dynamic_function
- `nj.head` — dynamic_function
- `nj.patch` — dynamic_function
- `nj.post` — dynamic_function
- `nj.put` — dynamic_function

## 6. Aliase

Erkannte Aliase: **7**

- `nj.ajax` → `nj.request;`
- `nj.oEx` → `nj.extend;`
- `nj.cEq` → `nj.deepEqual;`
- `nj.isJ` → `nj.isJSON;`
- `nj.rAE` → `nj.arrayRemove;`
- `nj.fOA` → `nj.filterObjectArray;`
- `nj.gBr` → `nj.detectBrowser;`

## 7. Wichtige Feststellungen aus Phase 1

1. **`nj.config` existiert tatsächlich im Core.** Der Modulname selbst war daher nicht erfunden; die bisherige Seite muss in Phase 2 jedoch inhaltlich geprüft werden.
2. **Die echte Cookie-API heißt `nj.cookie` (Singular).** Der vorhandene Dokumentationsordner `cookies/` kann als sprechender Seitenname bestehen bleiben, muss aber eindeutig `nj.cookie` dokumentieren.
3. **`4.1.0_19_cookie` war eine Dublette.** Die Cookie-API war bereits durch `cookies/index.html` abgedeckt.
4. **Der Gesamtstand enthält `zip_content/` mit 10 eingebetteten Altarchiven.** Diese sind keine Dokumentationsmodule und erklären die Vergrößerung von etwa 90 KB auf rund 20 MB.
5. Neben den bisher dokumentierten Modulen existieren im Core weitere Bereiche, unter anderem `color`, `date`, `random`, `bus`, `logger` und `core` sowie direkte Hilfsfunktionen.
6. Diese Phase bewertet noch nicht, ob jede HTML-Seite sämtliche Methoden korrekt und vollständig beschreibt. Das ist Gegenstand von Phase 2.

## 8. Ergebnis

Phase 1 ist abgeschlossen. Der technische Ist-Zustand wurde reproduzierbar in `api_inventory.json` erfasst. Diese Datei kann künftig als Grundlage für den Dokumentationsvergleich dienen.
