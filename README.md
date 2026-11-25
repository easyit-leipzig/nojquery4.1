# nojquery 4.1.0

Siehe [vollständige Dokumentation](docs/NOJQUERY_4_DOKUMENTATION.md).

Schnellstart:

```html
<script src="build/nojquery.min.js"></script>
<script>
nj.ready(() => {
  nj('#app').text('nojquery 4 ist bereit');
});
</script>
```


## API-Beispiele (4.1)
Alle API-Befehle mit Einzelbeispielen: `docs/API_BEISPIELE.html` sowie `docs/API_BEISPIELE.md`.

## Paketmanager

Unter **Apache und PHP 8.1+** die [Modulauswahl](package-manager/index.html) öffnen, z. B. unter `http://localhost/nojquery4.1/package-manager/`. Core bleibt immer aktiviert. Die ZIP-Pakete werden von `package-manager/download.php` erstellt; Python und die PHP-ZIP-Erweiterung werden nicht benötigt.

Details: [Paketmanager-Installationsanleitung](package-manager/README.md).
