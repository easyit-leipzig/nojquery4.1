/*! nojquery 4.1.0 - navigation module */
(function(global){
  "use strict";
  const nj = global.nj;
  if (!nj || !nj.core) throw new Error("nojquery Core zuerst laden");
  const BaseManager = nj.managers.BaseManager;
  class NavigationManager extends BaseManager {
    constructor(options = {}) {
      super({
        linkSelector: '[data-nav-section]',
        activeClass: 'active',
        storageKey: 'navigation.active',
        ...options
      });
      this.observer = null;
    }

    links() { return Array.from(document.querySelectorAll(this.options.linkSelector)); }

    setActive(section, { store = true } = {}) {
      if (!section) return this;
      this.links().forEach(link => {
        const active = link.dataset.navSection === section;
        link.classList.toggle(this.options.activeClass, active);
        active ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current');
      });
      if (store) nj.storage.local.set(this.options.storageKey, section);
      document.dispatchEvent(new CustomEvent('nj:navigationchange', { detail: { section } }));
      return this;
    }

    restore(fallback = 'start') {
      const active = document.body.dataset.activeNav || nj.storage.local.get(this.options.storageKey, fallback);
      this.setActive(active, { store: false });
      return active;
    }

    scrollSpy(selector = 'main section[id]', options = {}) {
      this.stopScrollSpy();
      const sections = Array.from(document.querySelectorAll(selector));
      this.observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) this.setActive(visible.target.id);
      }, {
        root: options.root || null,
        rootMargin: options.rootMargin || '-20% 0px -60% 0px',
        threshold: options.threshold || [0.01, 0.2, 0.5]
      });
      sections.forEach(section => this.observer.observe(section));
      return this;
    }

    stopScrollSpy() {
      this.observer?.disconnect();
      this.observer = null;
      return this;
    }

    breadcrumbs(container, items = [], options = {}) {
      const element = typeof container === 'string' ? document.querySelector(container) : container;
      if (!element) return this;
      element.replaceChildren();

      items.forEach((item, index) => {
        if (index) {
          const separator = document.createElement('span');
          separator.className = 'nj-breadcrumb-separator';
          separator.textContent = options.separator || '›';
          element.appendChild(separator);
        }

        const node = document.createElement(item.href ? 'a' : 'span');
        node.textContent = item.label || '';
        node.className = 'nj-breadcrumb-item';
        if (item.href) node.href = item.href;
        if (item.current) node.setAttribute('aria-current', 'page');
        element.appendChild(node);
      });

      return this;
    }
  }
  nj.navigation = new NavigationManager();
  nj.managers.NavigationManager = NavigationManager;
})(window);
