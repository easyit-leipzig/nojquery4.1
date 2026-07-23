# nojquery 4.1.0 – Complete Core

Eine kompakte moderne JavaScript-Core-Bibliothek ohne jQuery-Abhängigkeit.

## Enthaltene Module

- DOM-Auswahl, Traversierung und Manipulation
- Attribute, Properties, Dataset, CSS und Klassen
- Events, Delegation, einmalige Events und Custom Events
- Formulare und Serialisierung
- Web Animations, Fade, Slide, Zoom und Shake
- LocalStorage und SessionStorage mit Namensräumen
- HTTP/AJAX über Fetch: GET, POST, PUT, PATCH, DELETE, Upload, Timeout und AbortController
- Memory-, Local- und Session-Cache mit TTL
- MutationObserver, IntersectionObserver und ResizeObserver
- HTML-Templates und Rendering
- History-Router und URL-Hilfen
- Cookies
- Validierung: required, email, URL, Zahl, Datum, Telefon, IBAN, BIC und Grenzen
- Formatierung: Zahl, Währung, Prozent, Datum und Bytes
- Drag, Drop und Sortable
- Clipboard
- Tastenkombinationen
- Device- und Online-Erkennung
- Farbkonvertierung
- Datumsfunktionen
- UUID und Zufallswerte
- EventBus
- konfigurierbarer Logger
- rückwärtskompatible Kurzaliasse

## Einbindung

```html
<script src="/nh_hor/assets/js/nojquery.core.js?v=4.1.0" defer></script>
```

## HTTP

```js
const { data } = await nj.get('/nh_hor/api/menu.php');

await nj.post('/nh_hor/api/contact.php', {
  name: 'Olaf',
  message: 'Test'
});
```

## Storage und Cache

```js
nj.storage.local.set('navigation.last', '/kontakt.php');
const page = nj.storage.local.get('navigation.last', '/');

nj.cache.local.set('menu', menuData, 60000);
const menu = nj.cache.local.get('menu');
```

## Template

```js
nj.render('#result', '<strong>{{name}}</strong>', { name: 'Olaf' });
```

Dreifache Klammern geben bewusst unmaskiertes HTML aus:

```js
nj.template('{{{html}}}', { html: '<em>Text</em>' });
```

## Observer

```js
const observer = nj.visible('.lazy', (visible, entry) => {
  if (visible) entry.target.classList.add('visible');
});
```

## Router

```js
nj.route('/person/:id', params => {
  console.log(params.id);
});

nj.router.start();
nj.navigate('/person/12');
```

## Validierung

```js
const result = nj.validate.test('test@example.de', {
  required: true,
  email: true
});
```

## Alias-Konfiguration

Standardmäßig wird `window.nj` und aus Kompatibilitätsgründen `window._` gesetzt. `$` bleibt deaktiviert.

```js
nj.releaseAlias('_');
nj.exposeAliases({ underscore: false, dollar: false });
```

## Sicherheit

`{{variable}}` maskiert HTML. `{{{variable}}}` und `.html()` dürfen nur mit vertrauenswürdigen Inhalten verwendet werden.
