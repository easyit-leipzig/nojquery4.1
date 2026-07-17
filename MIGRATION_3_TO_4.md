# Migration nojquery 3.1.1 → 4.0.0

## Wichtigste Änderungen

1. Core und Manager sind getrennt.
2. `nj.ajax` und `nj.cookie` werden nicht mehr aus einem älteren Objekt heraus überschrieben.
3. Die Core-Instanzen bleiben unter `nj.core.ajax` und `nj.core.cookie` erreichbar.
4. Die öffentlichen Instanzen bleiben unter `nj.ajax` und `nj.cookie` erhalten.
5. Rückwärtskompatible Kurzaliase bleiben bestehen.
6. Neue Core-Methoden: `find`, `closest`, `prop`, `once`, `serialize`, `scrollIntoView`, `create`.
7. Ajax unterstützt jetzt zusätzlich `PATCH`.
8. Ereignisdelegation wird direkt von `on()` unterstützt.
9. `releaseAlias()` stellt vorherige globale Aliaswerte wieder her.

## Empfohlene Migration

Alter Code muss in den meisten Fällen nicht geändert werden.

Für neuen Code:

```javascript
nj('#box').addClass('active');
nj.ajax.get('/api/data');
nj.storage.local.set('key', 'value');
```

Legacy-Kurzformen sollten nur für bestehende Projekte weiterverwendet werden.
