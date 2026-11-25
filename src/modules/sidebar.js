/*! nojquery 4.1.0 - sidebar module */
(function(global){
  "use strict";
  const nj = global.nj;
  if (!nj || !nj.core) throw new Error("nojquery Core zuerst laden");
  const BaseManager = nj.managers.BaseManager;
  class SidebarManager extends BaseManager {
    constructor(options = {}) {
      super({
        sidebar: '.sidebar',
        scrollWindow: '.sidebar-scroll-window',
        toggle: '.menu-toggle',
        up: '.sidebar-scroll-button--up',
        down: '.sidebar-scroll-button--down',
        openClass: 'open',
        bodyOpenClass: 'menu-open',
        storageKey: 'sidebar.position',
        ...options
      });
      this.initialized = false;
    }

    init(options = {}) {
      this.configure(options);
      this.sidebar = document.querySelector(this.options.sidebar);
      this.scrollWindow = document.querySelector(this.options.scrollWindow);
      this.toggleButton = document.querySelector(this.options.toggle);
      this.upButton = document.querySelector(this.options.up);
      this.downButton = document.querySelector(this.options.down);

      if (this.initialized) return this;
      this.initialized = true;

      this.toggleButton?.addEventListener('click', () => this.toggle());
      this.upButton?.addEventListener('click', () => this.scroll(-this.step()));
      this.downButton?.addEventListener('click', () => this.scroll(this.step()));
      this.scrollWindow?.addEventListener('scroll', () => {
        this.savePosition();
        this.updateButtons();
      }, { passive: true });
      window.addEventListener('resize', () => this.updateButtons());

      this.restorePosition();
      this.updateButtons();
      return this;
    }

    open() {
      this.sidebar?.classList.add(this.options.openClass);
      document.body.classList.add(this.options.bodyOpenClass);
      this.toggleButton?.setAttribute('aria-expanded', 'true');
      return this;
    }

    close() {
      this.sidebar?.classList.remove(this.options.openClass);
      document.body.classList.remove(this.options.bodyOpenClass);
      this.toggleButton?.setAttribute('aria-expanded', 'false');
      return this;
    }

    toggle() {
      return this.sidebar?.classList.contains(this.options.openClass) ? this.close() : this.open();
    }

    step() { return Math.max(120, Math.round((this.scrollWindow?.clientHeight || 0) * 0.6)); }

    scroll(amount, behavior = 'smooth') {
      this.scrollWindow?.scrollBy({ top: amount, behavior });
      return this;
    }

    savePosition() {
      if (this.scrollWindow) nj.storage.local.set(this.options.storageKey, this.scrollWindow.scrollTop);
      return this;
    }

    restorePosition() {
      if (this.scrollWindow) {
        this.scrollWindow.scrollTop = Number(nj.storage.local.get(this.options.storageKey, 0)) || 0;
      }
      return this;
    }

    updateButtons() {
      if (!this.scrollWindow) return this;
      const above = this.scrollWindow.scrollTop > 2;
      const below = this.scrollWindow.scrollTop + this.scrollWindow.clientHeight < this.scrollWindow.scrollHeight - 2;
      if (this.upButton) this.upButton.hidden = !above;
      if (this.downButton) this.downButton.hidden = !below;
      this.sidebar?.classList.toggle('has-overflow-above', above);
      this.sidebar?.classList.toggle('has-overflow-below', below);
      return this;
    }
  }
  nj.sidebar = new SidebarManager();
  nj.managers.SidebarManager = SidebarManager;
})(window);
