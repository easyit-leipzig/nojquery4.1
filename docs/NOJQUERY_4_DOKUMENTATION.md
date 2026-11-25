# nojquery 4.1.0

## Überblick

nojquery 4 ist eine kleine, moderne JavaScript-Bibliothek für DOM-Arbeit, Ereignisse, Ajax, Formulare, Speicherung, Navigation, Themes, Akkordeons, Sidebars und Modalfenster.

Die Version 4 trennt konsequent zwischen:

- **Core:** Selektoren, DOM, CSS, Ereignisse, Animationen und Hilfsfunktionen
- **Manager:** Storage, Ajax, Cookies, Navigation, Sidebar, Accordion, Theme, Form und Modal
- **Builds:** getrennte Quelldateien, vollständiger Build und komprimierter Build

Die wichtigste Architekturänderung gegenüber 3.1.1 ist:

```javascript
nj.core.ajax
nj.core.cookie
```

enthalten die grundlegenden Manager-Instanzen. Die öffentliche API bleibt gleichzeitig komfortabel:

```javascript
nj.ajax
nj.cookie
```

Dadurch wird keine frühere Implementierung mehr unkontrolliert überschrieben.

---

## Dateien

```text
nojquery4/
├── src/
│   ├── core/
│   │   └── nojquery.core.js
│   └── managers/
│       └── nojquery.managers.js
├── build/
│   ├── nojquery.full.js
│   └── nojquery.min.js
├── docs/
│   └── NOJQUERY_4_DOKUMENTATION.md
├── CHANGELOG.md
├── MIGRATION_3_TO_4.md
└── package.json
```

---

## Einbindung

### Vollständiger Build

```html
<script src="nojquery.full.js"></script>
```

### Minified Build

```html
<script src="nojquery.min.js"></script>
```

### Getrennte Dateien

```html
<script src="nojquery.core.js"></script>
<script src="nojquery.managers.js"></script>
```

Die Reihenfolge ist wichtig: Der Core muss vor den Managern geladen werden.

---

## Globale Namen

Standardmäßig werden zwei Namen bereitgestellt:

```javascript
window.nj
window._
```

Beide verweisen auf dieselbe Funktion.

```javascript
nj('#content').text('Hallo');
_('#content').text('Hallo');
```

Das Dollarzeichen wird nicht automatisch belegt:

```javascript
nj.config.exposeDollar = true;
nj.exposeAliases();
```

Alias-Konflikte werden standardmäßig nicht überschrieben.

```javascript
nj.exposeAliases({
  underscore: true,
  dollar: true,
  force: false
});
```

Alias wieder freigeben:

```javascript
nj.releaseAlias('_');
nj.releaseAlias('$');
```

---

# 1. Core-API

## 1.1 Auswahl

```javascript
nj('#id');
nj('.klasse');
nj('section');
nj('main article');
nj(document);
nj(window);
nj(domElement);
```

Mit Kontext:

```javascript
nj('.item', '#container');
```

Eigenschaften:

```javascript
const items = nj('.item');

items.length;
items.e;
items.get(0);
items.get(-1);
```

## 1.2 Iteration

```javascript
nj('.item').each(function (index, element) {
  console.log(index, element);
});
```

```javascript
const texts = nj('.item').map(function () {
  return this.textContent;
});
```

## 1.3 Traversierung

```javascript
nj('.item').first();
nj('.item').last();
nj('.item').eq(2);
nj('.item').parent();
nj('.item').children();
nj('.item').children('.active');
nj('.item').next();
nj('.item').prev();
nj('.item').find('.child');
nj('.item').closest('section');
```

## 1.4 Inhalt

```javascript
nj('#box').html('<strong>Text</strong>');
nj('#box').text('Nur Text');
nj('#input').val('Wert');
```

Lesen:

```javascript
const html = nj('#box').html();
const text = nj('#box').text();
const value = nj('#input').val();
```

## 1.5 Einfügen und Entfernen

```javascript
nj('#box').append('<p>Ende</p>');
nj('#box').prepend('<p>Anfang</p>');
nj('#box').before('<hr>');
nj('#box').after('<hr>');
nj('.item').appendTo('#target');
nj('#box').empty();
nj('#box').remove();
```

## 1.6 Attribute und Properties

```javascript
nj('#image').attr('alt', 'Beschreibung');
nj('#image').attr({
  alt: 'Beschreibung',
  loading: 'lazy'
});
```

```javascript
nj('#image').removeAttr('title');
nj('#image').hasAttr('alt');
```

DOM-Property:

```javascript
nj('#checkbox').prop('checked', true);
```

## 1.7 Dataset

```html
<div id="card" data-user-id="42"></div>
```

```javascript
nj('#card').data('userId');
nj('#card').data('userId', 99);
nj('#card').removeData('userId');
```

## 1.8 Klassen

```javascript
nj('#box').addClass('active visible');
nj('#box').removeClass('visible');
nj('#box').toggleClass('active');
nj('#box').toggleClass('active', true);
nj('#box').hasClass('active');
```

## 1.9 CSS

```javascript
nj('#box').css('display', 'grid');
```

```javascript
nj('#box').css({
  display: 'grid',
  gap: '1rem',
  '--accent': '#0050a4'
});
```

Lesen:

```javascript
const display = nj('#box').css('display');
```

CSS-Eigenschaft entfernen:

```javascript
nj('#box').removeCss('display');
```

CSS-Variablen:

```javascript
nj.cssVar('--accent', '#0050a4');
const accent = nj.cssVar('--accent');
```

## 1.10 Sichtbarkeit

```javascript
nj('#box').show();
nj('#box').show('flex');
nj('#box').hide();
nj('#box').toggle();
```

## 1.11 Ereignisse

```javascript
nj('#button').on('click', event => {
  console.log(event);
});
```

Mehrere Ereignisse:

```javascript
nj('#input').on('focus blur', handler);
```

Delegation:

```javascript
nj('#list').on('click', '.delete-button', function (event) {
  this.closest('li').remove();
});
```

Entfernen:

```javascript
nj('#button').off('click', handler);
```

Einmaliges Ereignis:

```javascript
nj('#button').once('click', handler);
```

Eigenes Ereignis:

```javascript
nj('#box').trigger('data:changed', {
  id: 42
});
```

## 1.12 Formulare

```javascript
nj('#accept').checked();
nj('#accept').checked(true);
```

Formular serialisieren:

```javascript
const data = nj('#contact-form').serialize();
```

## 1.13 Geometrie

```javascript
const rect = nj('#box').rect();

console.log(rect.top);
console.log(rect.width);
```

## 1.14 Scrollen

```javascript
nj('#target').scrollIntoView();

nj('#target').scrollIntoView({
  behavior: 'smooth',
  block: 'center'
});
```

## 1.15 Animationen

```javascript
nj('#box').animate(
  [
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ],
  {
    duration: 400
  }
);
```

```javascript
nj('#box').fadeIn();
nj('#box').fadeOut();
```

## 1.16 Statusprüfungen

```javascript
nj('#box').exists();
nj('#box').is('.active');
```

---

# 2. Statische Hilfsfunktionen

## DOM bereit

```javascript
nj.ready(() => {
  console.log('DOM bereit');
});
```

## Element erzeugen

```javascript
const button = nj.create('button', {
  class: 'button',
  text: 'Speichern',
  type: 'button',
  dataset: {
    action: 'save'
  },
  onclick: () => console.log('gespeichert')
});
```

## Objekte zusammenführen

```javascript
const result = nj.extend({}, defaults, options);
```

## JSON prüfen

```javascript
nj.isJSON('{"ok":true}');
```

## Tiefenvergleich

```javascript
nj.deepEqual(
  { id: 1 },
  { id: 1 }
);
```

## Array-Element entfernen

```javascript
nj.arrayRemove(list, value);
```

## Objektarray filtern

```javascript
nj.filterObjectArray(users, 'role', 'admin');
```

## Browser erkennen

```javascript
nj.detectBrowser();
```

---

# 3. StorageManager

## Grundprinzip

```javascript
nj.storage
nj.storage.local
nj.storage.session
```

## Local Storage

```javascript
nj.storage.local.set('user', {
  id: 42,
  name: 'Anna'
});

const user = nj.storage.local.get('user');
```

## Session Storage

```javascript
nj.storage.session.set('step', 3);
const step = nj.storage.session.get('step', 1);
```

## TTL

TTL wird in Millisekunden angegeben:

```javascript
nj.storage.local.set(
  'temporary',
  { value: 123 },
  { ttl: 60000 }
);
```

## Weitere Methoden

```javascript
nj.storage.local.has('user');
nj.storage.local.remove('user');
nj.storage.local.keys();
nj.storage.local.size();
nj.storage.local.clear();
```

Atomisches Update:

```javascript
nj.storage.local.update('counter', value => {
  return Number(value || 0) + 1;
});
```

## Namespace ändern

```javascript
nj.storage.configure({
  namespace: 'easyit'
});
```

Gespeicherter Schlüssel:

```text
easyit.user
```

---

# 4. AjaxManager

## GET

```javascript
nj.ajax.get('/api/users')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## POST

```javascript
nj.ajax.post('/api/users', {
  name: 'Anna'
});
```

## PUT

```javascript
nj.ajax.put('/api/users/42', {
  name: 'Anna Müller'
});
```

## PATCH

```javascript
nj.ajax.patch('/api/users/42', {
  active: true
});
```

## DELETE

```javascript
nj.ajax.delete('/api/users/42');
```

## FormData

```javascript
nj.ajax.postForm('/upload', {
  title: 'Datei',
  file: fileInput.files[0]
});
```

## Antworttyp

```javascript
nj.ajax.get('/api/report', {
  responseType: 'blob'
});
```

Erlaubte Werte:

```text
auto
json
text
blob
arrayBuffer
```

## Timeout

```javascript
nj.ajax.get('/api/slow', {
  timeout: 5000
});
```

Globale Vorgabe:

```javascript
nj.ajax.configure({
  timeout: 10000
});
```

## Kerninstanz

Zusätzlich zur öffentlichen Instanz steht eine Core-Instanz zur Verfügung:

```javascript
nj.core.ajax
```

Dadurch kann ein eigener Manager eingesetzt werden, ohne die Core-Ebene zu verlieren.

---

# 5. CookieManager

## Setzen

```javascript
nj.cookie.set('theme', 'dark', 30);
```

Mit Optionen:

```javascript
nj.cookie.set('session', 'abc', 7, {
  path: '/',
  secure: true,
  sameSite: 'Lax'
});
```

## Lesen

```javascript
const theme = nj.cookie.get('theme', 'leipzig-blau');
```

## Prüfen

```javascript
nj.cookie.has('theme');
```

## Entfernen

```javascript
nj.cookie.remove('theme');
```

Core-Instanz:

```javascript
nj.core.cookie
```

---

# 6. NavigationManager

## HTML

```html
<a data-nav-section="start">Start</a>
<a data-nav-section="faq">FAQ</a>
```

## Aktiv setzen

```javascript
nj.navigation.setActive('faq');
```

## Wiederherstellen

```javascript
nj.navigation.restore('start');
```

## ScrollSpy

```javascript
nj.navigation.scrollSpy('main section[id]');
```

Beenden:

```javascript
nj.navigation.stopScrollSpy();
```

## Breadcrumbs

```javascript
nj.navigation.breadcrumbs('#breadcrumbs', [
  { label: 'Start', href: '/' },
  { label: 'Fächer', href: '/faecher' },
  { label: 'Mathematik', current: true }
]);
```

---

# 7. SidebarManager

## Erwartete Selektoren

```text
.sidebar
.sidebar-scroll-window
.menu-toggle
.sidebar-scroll-button--up
.sidebar-scroll-button--down
```

## Initialisierung

```javascript
nj.sidebar.init();
```

Eigene Selektoren:

```javascript
nj.sidebar.init({
  sidebar: '#navigation',
  scrollWindow: '#navigation-scroll',
  toggle: '#navigation-toggle'
});
```

## Methoden

```javascript
nj.sidebar.open();
nj.sidebar.close();
nj.sidebar.toggle();
nj.sidebar.scroll(300);
nj.sidebar.savePosition();
nj.sidebar.restorePosition();
nj.sidebar.updateButtons();
```

---

# 8. AccordionManager

## Standard mit details

```html
<details>
  <summary>Regel</summary>
  <p>Begründung</p>
</details>
```

```javascript
nj.accordion.init();
```

Nur ein Element geöffnet:

```javascript
nj.accordion.init({
  single: true
});
```

Methoden:

```javascript
nj.accordion.open('#rule-1');
nj.accordion.close('#rule-1');
nj.accordion.toggle('#rule-1');
nj.accordion.closeAll();
```

---

# 9. ThemeManager

## Standardthemes

```text
neon
dark
leipzig-blau
```

## Theme setzen

```javascript
nj.theme.set('leipzig-blau');
```

## Theme lesen

```javascript
nj.theme.get();
```

## Gespeichertes Theme laden

```javascript
nj.theme.restore();
```

## Wechseln

```javascript
nj.theme.toggle();
```

Eigene Themes:

```javascript
nj.theme.configure({
  themes: ['light', 'dark'],
  defaultTheme: 'light'
});
```

---

# 10. AnimationManager

```javascript
nj.animation.fadeIn('#box');
nj.animation.fadeOut('#box');
nj.animation.slideUp('#box');
nj.animation.slideDown('#box');
nj.animation.pulse('#button');
```

Eigene Animation:

```javascript
nj.animation.animate(
  '#box',
  [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
  ],
  {
    duration: 1000
  }
);
```

---

# 11. FormManager

## Serialisieren

```javascript
const data = nj.form.serialize('#contact-form');
```

## Validieren

```javascript
nj.form.validate('#contact-form');
```

## Zurücksetzen

```javascript
nj.form.reset('#contact-form');
```

## Absenden

```javascript
nj.form.submit('#contact-form')
  .then(response => console.log(response));
```

## Automatisch binden

```javascript
nj.form.bind('#contact-form', {
  onSuccess(response, form) {
    console.log(response);
  },
  onError(error, form) {
    console.error(error);
  }
});
```

Als echtes `FormData` senden:

```javascript
nj.form.bind('#upload-form', {
  formData: true
});
```

---

# 12. ModalManager

## Vorhandenes Modal öffnen

```javascript
nj.modal.open('#contact-modal');
```

Schließen:

```javascript
nj.modal.close();
```

Umschalten:

```javascript
nj.modal.toggle('#contact-modal');
```

## Modal erzeugen

```javascript
const modal = nj.modal.create({
  id: 'info-modal',
  label: 'Information',
  content: '<h2>Hinweis</h2><p>Text</p>'
});

nj.modal.open(modal);
```

---

# 13. Manager selbst erzeugen

Alle Klassen stehen unter `nj.managers` zur Verfügung.

```javascript
const projectStorage = new nj.managers.StorageManager({
  namespace: 'project'
});

projectStorage.local.set('state', {
  ready: true
});
```

Eigener AjaxManager:

```javascript
const api = new nj.managers.AjaxManager({
  timeout: 15000,
  headers: {
    'X-Application': 'easyIT'
  }
});

api.get('/api/status');
```

---

# 14. Rückwärtskompatibilität

Die wichtigsten historischen Kurzformen bleiben erhalten:

| Alt | Neu |
|---|---|
| `htm()` | `html()` |
| `txt()` | `text()` |
| `v()` | `val()` |
| `aCh()` | `append()` |
| `pCh()` | `prepend()` |
| `aCN()` | `addClass()` |
| `rCN()` | `removeClass()` |
| `tCl()` | `toggleClass()` |
| `hCl()` | `hasClass()` |
| `sty()` | `css()` |
| `atr()` | `attr()` |
| `tri()` | `trigger()` |
| `gRe()` | `rect()` |
| `isE()` | `exists()` |

Statische Aliase:

| Alt | Neu |
|---|---|
| `nj.oEx()` | `nj.extend()` |
| `nj.cEq()` | `nj.deepEqual()` |
| `nj.isJ()` | `nj.isJSON()` |
| `nj.rAE()` | `nj.arrayRemove()` |
| `nj.fOA()` | `nj.filterObjectArray()` |
| `nj.ddS()` | `nj.cssVar()` |
| `nj.ddG()` | `nj.cssVar()` |
| `nj.gBr()` | `nj.detectBrowser()` |

Für neuen Code sollten die ausgeschriebenen Methoden verwendet werden.

---

# 15. Migration von 3.1.1

## Ajax

Bisher:

```javascript
nj.ajax.post('/api', data);
```

Weiterhin gültig:

```javascript
nj.ajax.post('/api', data);
```

Neu ist zusätzlich:

```javascript
nj.core.ajax.post('/api', data);
```

## Cookies

Bisher:

```javascript
nj.cookie.get('theme');
```

Weiterhin gültig:

```javascript
nj.cookie.get('theme');
```

Neu:

```javascript
nj.core.cookie.get('theme');
```

## Callback-Ajax

Weiterhin möglich:

```javascript
nj.post('/api', data, function (result, error) {
  if (error) {
    console.error(error);
    return;
  }

  console.log(result);
});
```

Empfohlen:

```javascript
nj.ajax.post('/api', data)
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

# 16. Sicherheitsregeln

- Ungeprüfte Inhalte nicht direkt mit `html()` einfügen.
- Für Benutzereingaben möglichst `text()` verwenden.
- Cookies mit sensiblen Daten sollten serverseitig als `HttpOnly` gesetzt werden.
- `localStorage` und `sessionStorage` sind für JavaScript vollständig lesbar.
- Bei Cross-Site Requests müssen CORS und CSRF serverseitig korrekt konfiguriert sein.
- `SameSite=None` verlangt in modernen Browsern üblicherweise zusätzlich `Secure`.

---

# 17. Browservoraussetzungen

nojquery 4 nutzt moderne Browser-APIs:

- `fetch`
- `Promise`
- `class`
- `CustomEvent`
- `IntersectionObserver`
- `Web Animations API`
- `AbortController`
- `FormData`
- `URLSearchParams`

Für sehr alte Browser sind Polyfills erforderlich.

---

# 18. Empfohlene Initialisierung

```javascript
nj.ready(() => {
  nj.theme.restore();

  nj.sidebar.init();

  nj.accordion.init({
    selector: '.rules details',
    single: false
  });

  nj.navigation.restore('start');
  nj.navigation.scrollSpy('main section[id]');

  nj.form.bind('#contact-form', {
    onSuccess(response) {
      nj.modal.open('#success-modal');
    },
    onError(error) {
      console.error(error);
    }
  });
});
```

---

# 19. Versionsinformation

```javascript
console.log(nj.version);
```

Ausgabe:

```text
4.0.0
```
