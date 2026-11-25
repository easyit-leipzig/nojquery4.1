/*! nojquery 4.1.0 - storage module */
(function(global){
  "use strict";
  const nj = global.nj;
  if (!nj || !nj.core) throw new Error("nojquery Core zuerst laden");
  const BaseManager = nj.managers.BaseManager;
  class StorageManager extends BaseManager {
    constructor(options = {}) {
      super({ namespace: 'nj', defaultScope: 'local', ...options });
      this.local = this.scope('local');
      this.session = this.scope('session');
    }

    store(scope) { return scope === 'session' ? sessionStorage : localStorage; }
    key(name) { return this.options.namespace ? `${this.options.namespace}.${name}` : String(name); }

    scope(scope) {
      return {
        get: (key, fallback = null) => this.get(key, fallback, { scope }),
        set: (key, value, options = {}) => this.set(key, value, { ...options, scope }),
        save: (key, value, options = {}) => this.set(key, value, { ...options, scope }),
        load: (key, fallback = null) => this.get(key, fallback, { scope }),
        has: key => this.has(key, { scope }),
        remove: key => this.remove(key, { scope }),
        clear: () => this.clear({ scope }),
        keys: () => this.keys({ scope }),
        size: () => this.size({ scope }),
        update: (key, updater, options = {}) => this.update(key, updater, { ...options, scope })
      };
    }

    get(key, fallback = null, options = {}) {
      const scope = options.scope || this.options.defaultScope;
      try {
        const raw = this.store(scope).getItem(this.key(key));
        if (raw === null) return fallback;
        const box = JSON.parse(raw);
        if (box?.expiresAt && Date.now() > box.expiresAt) {
          this.remove(key, { scope });
          return fallback;
        }
        return box && Object.prototype.hasOwnProperty.call(box, 'value') ? box.value : box;
      } catch {
        return fallback;
      }
    }

    set(key, value, options = {}) {
      const scope = options.scope || this.options.defaultScope;
      const ttl = Number(options.ttl || 0);
      try {
        this.store(scope).setItem(this.key(key), JSON.stringify({
          value,
          createdAt: Date.now(),
          expiresAt: ttl > 0 ? Date.now() + ttl : null
        }));
        return value;
      } catch {
        return false;
      }
    }

    has(key, options = {}) {
      const sentinel = {};
      return this.get(key, sentinel, options) !== sentinel;
    }

    remove(key, options = {}) {
      try {
        this.store(options.scope || this.options.defaultScope).removeItem(this.key(key));
        return true;
      } catch {
        return false;
      }
    }

    keys(options = {}) {
      const store = this.store(options.scope || this.options.defaultScope);
      const prefix = this.options.namespace ? `${this.options.namespace}.` : '';
      const result = [];
      for (let index = 0; index < store.length; index++) {
        const key = store.key(index);
        if (key && (!prefix || key.startsWith(prefix))) result.push(prefix ? key.slice(prefix.length) : key);
      }
      return result;
    }

    clear(options = {}) {
      const store = this.store(options.scope || this.options.defaultScope);
      this.keys(options).forEach(key => store.removeItem(this.key(key)));
      return true;
    }

    size(options = {}) { return this.keys(options).length; }

    update(key, updater, options = {}) {
      if (typeof updater !== 'function') throw new TypeError('updater must be a function');
      const value = updater(this.get(key, null, options));
      this.set(key, value, options);
      return value;
    }
  }
  nj.storage = new StorageManager();
  nj.managers.StorageManager = StorageManager;
})(window);
