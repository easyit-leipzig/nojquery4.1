# nojquery 4.1.0 – Phase 2: Dokumentations-Audit

## Ergebnisübersicht

- Geprüfte Dokumentationsseiten: **17**
- Vollständig erkannte Seiten: **13**
- Teilweise dokumentierte Seiten: **1**
- Fehlende Seiten: **0**
- Ungültige strukturelle Zuordnungen: **3**
- Doppelte API-Zuordnungen: **0**
- Ungültige `nj.*`-Referenzen: **0**
- Defekte lokale Links: **11**

## Entscheidung

Ein Neustart ist **nicht erforderlich**.

Belastbare Basis bleibt **4.1.0_17_device**.

- `4.1.0_18_config` wird in Phase 3 anhand der echten `nj.config`-API geprüft und sauber neu erzeugt.
- `4.1.0_19_cookie` wird nicht fortgeführt, weil `nj.cookie` bereits durch `cookies/index.html` abgedeckt ist.

## Seitenstatus

- `core/dom.html`: **complete**
- `core/events.html`: **invalid_mapping**
- `core/animation.html`: **invalid_mapping** – fehlend: NJ.fadeToggle, NJ.stop
- `ajax/index.html`: **invalid_mapping**
- `storage/index.html`: **complete**
- `cache/index.html`: **complete**
- `templates/index.html`: **complete**
- `router/index.html`: **complete**
- `url/index.html`: **complete**
- `cookies/index.html`: **complete**
- `validation/index.html`: **complete**
- `formatter/index.html`: **complete**
- `observer/index.html`: **complete**
- `clipboard/index.html`: **complete**
- `keyboard/index.html`: **complete**
- `device/index.html`: **complete**
- `config/index.html`: **partial** – fehlend: nj.config.ajaxTimeout, nj.config.animation, nj.config.debug, nj.config.exposeDollar, nj.config.exposeUnderscore, nj.config.forceAliasOverwrite, nj.config.warn

## Doppelte Zuordnungen

- Keine

## Noch nicht dokumentierte Namespaces

- `nj.bus`
- `nj.color`
- `nj.core`
- `nj.date`
- `nj.random`

## Noch nicht dokumentierte direkte APIs

- `nj.NJ`
- `nj.arrayRemove`
- `nj.create`
- `nj.cssVar`
- `nj.ddG`
- `nj.ddS`
- `nj.deepEqual`
- `nj.detectBrowser`
- `nj.drag`
- `nj.drop`
- `nj.exposeAliases`
- `nj.extend`
- `nj.fEa`
- `nj.filterObjectArray`
- `nj.forEach`
- `nj.hasAlias`
- `nj.isJSON`
- `nj.log`
- `nj.logger`
- `nj.ready`
- `nj.releaseAlias`
- `nj.sortable`
- `nj.uuid`
- `nj.version`

## Noch nicht dokumentierte Wrapper-Mitglieder

- `NJ.[Symbol.iterator]`
- `NJ.checked`
- `NJ.e`
- `NJ.each`
- `NJ.eq`
- `NJ.exists`
- `NJ.first`
- `NJ.get`
- `NJ.is`
- `NJ.last`
- `NJ.length`
- `NJ.map`
- `NJ.once`
- `NJ.rect`
- `NJ.scrollIntoView`
- `NJ.serialize`

## Defekte lokale Links

- `index.html` → `ajax/request.html`
- `index.html` → `utilities/index.html`
- `index.html` → `reference/configuration.html`
- `index.html` → `reference/aliases.html`
- `index.html` → `getting-started/migration-from-jquery.html`
- `index.html` → `getting-started/installation.html`
- `index.html` → `core/selectors.html`
- `index.html` → `api/index.html`
- `index.html` → `cookbook/index.html`
- `core/animation.html` → `../cookbook/index.html`
- `core/dom.html` → `../api/index.html`

## Nächster Schritt

Phase 3 korrigiert ausschließlich die erkannten Problemstellen und erzeugt einen bereinigten kumulativen Gesamtstand. Bereits korrekte Seiten bleiben erhalten.
