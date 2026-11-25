/*! nojquery 4.1.0 - theme module */
(function(global){
  "use strict";
  const nj = global.nj;
  if (!nj || !nj.core) throw new Error("nojquery Core zuerst laden");
  const BaseManager = nj.managers.BaseManager;
  class ThemeManager extends BaseManager {
    constructor(options = {}) {
      super({
        attribute: 'data-theme',
        storageKey: 'theme',
        defaultTheme: 'leipzig-blau',
        themes: ['neon', 'dark', 'leipzig-blau'],
        ...options
      });
    }

    set(theme, { store = true } = {}) {
      if (!this.options.themes.includes(theme)) throw new Error(`Unknown theme: ${theme}`);
      document.documentElement.setAttribute(this.options.attribute, theme);
      if (store) nj.storage.local.set(this.options.storageKey, theme);
      document.dispatchEvent(new CustomEvent('nj:themechange', { detail: { theme } }));
      return theme;
    }

    get() { return document.documentElement.getAttribute(this.options.attribute) || this.options.defaultTheme; }
    restore() { return this.set(nj.storage.local.get(this.options.storageKey, this.options.defaultTheme), { store: false }); }
    toggle(sequence = this.options.themes) {
      const index = sequence.indexOf(this.get());
      return this.set(sequence[(index + 1) % sequence.length]);
    }
  }
  nj.theme = new ThemeManager();
  nj.managers.ThemeManager = ThemeManager;
})(window);
