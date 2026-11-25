/*! nojquery 4.1.0 - cookie module */
(function(global){
  "use strict";
  const nj = global.nj;
  if (!nj || !nj.core) throw new Error("nojquery Core zuerst laden");
  const BaseManager = nj.managers.BaseManager;
  class CookieManager extends BaseManager {
    get(name, fallback = '') {
      const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
      if (!match) return fallback;
      const decoded = decodeURIComponent(match.pop());
      try { return JSON.parse(decoded); }
      catch { return decoded; }
    }

    set(name, value, days, options = {}) {
      let expires = '';
      if (typeof days === 'number') {
        expires = `; expires=${new Date(Date.now() + days * 86400000).toUTCString()}`;
      }

      const path = `; path=${options.path || '/'}`;
      const domain = options.domain ? `; Domain=${options.domain}` : '';
      const secure = options.secure ? '; Secure' : '';
      const sameSite = options.sameSite ? `; SameSite=${options.sameSite}` : '';
      const encoded = encodeURIComponent(typeof value === 'string' ? value : JSON.stringify(value));

      document.cookie = `${name}=${encoded}${expires}${path}${domain}${secure}${sameSite}`;
      return value;
    }

    has(name) {
      return document.cookie.split(';').some(cookie => cookie.trim().startsWith(`${name}=`));
    }

    remove(name, options = {}) {
      this.set(name, '', -1, options);
      return true;
    }
  }
  nj.cookie = new CookieManager();
  nj.core.cookie = nj.cookie;
  nj.managers.CookieManager = CookieManager;
})(window);
