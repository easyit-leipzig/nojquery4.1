/*!
 * nojquery 4.0.0 - Managers
 * Requires nojquery.core.js
 */
(function (global) {
  'use strict';

  const nj = global.nj;
  if (!nj) throw new Error('nojquery core must be loaded before managers');

  class BaseManager {
    constructor(options = {}) { this.options = { ...options }; }
    configure(options = {}) {
      Object.assign(this.options, options);
      return this;
    }
  }

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

  class AjaxManager extends BaseManager {
    constructor(options = {}) {
      super({ timeout: nj.config.ajaxTimeout, headers: {}, ...options });
    }

    async request(url, options = {}) {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeout = typeof options.timeout === 'number' ? options.timeout : this.options.timeout;
      let timer = null;

      if (controller && timeout > 0) timer = setTimeout(() => controller.abort(), timeout);

      const fetchOptions = {
        ...options,
        headers: { ...this.options.headers, ...(options.headers || {}) },
        signal: controller?.signal
      };

      delete fetchOptions.timeout;
      delete fetchOptions.responseType;

      try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const type = options.responseType || 'auto';
        if (type === 'json') return await response.json();
        if (type === 'blob') return await response.blob();
        if (type === 'arrayBuffer') return await response.arrayBuffer();
        if (type === 'text') return await response.text();

        const contentType = response.headers.get('content-type') || '';
        return contentType.includes('application/json') ? await response.json() : await response.text();
      } catch (error) {
        if (error?.name === 'AbortError') throw new Error('Request timed out');
        throw error;
      } finally {
        if (timer) clearTimeout(timer);
      }
    }

    get(url, options = {}) {
      return this.request(url, { ...options, method: 'GET' });
    }

    post(url, data = {}, options = {}) {
      return this.request(url, {
        ...options,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        body: JSON.stringify(data)
      });
    }

    put(url, data = {}, options = {}) {
      return this.request(url, {
        ...options,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        body: JSON.stringify(data)
      });
    }

    patch(url, data = {}, options = {}) {
      return this.request(url, {
        ...options,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        body: JSON.stringify(data)
      });
    }

    delete(url, options = {}) {
      return this.request(url, { ...options, method: 'DELETE' });
    }

    postForm(url, data = {}, options = {}) {
      const formData = data instanceof FormData
        ? data
        : Object.entries(data).reduce((form, [key, value]) => {
            form.append(key, value);
            return form;
          }, new FormData());

      return this.request(url, { ...options, method: 'POST', body: formData });
    }
  }

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

  class AccordionManager extends BaseManager {
    constructor(options = {}) {
      super({ selector: 'details', single: false, openClass: 'is-open', ...options });
      this.items = [];
    }

    init(options = {}) {
      this.configure(options);
      this.items = Array.from(document.querySelectorAll(this.options.selector));
      this.items.forEach(item => {
        item.classList.toggle(this.options.openClass, item.open);
        item.addEventListener('toggle', () => {
          item.classList.toggle(this.options.openClass, item.open);
          if (item.open && this.options.single) {
            this.items.forEach(other => {
              if (other !== item) other.open = false;
            });
          }
        });
      });
      return this;
    }

    element(target) { return typeof target === 'string' ? document.querySelector(target) : target; }
    open(target) { const element = this.element(target); if (element) element.open = true; return this; }
    close(target) { const element = this.element(target); if (element) element.open = false; return this; }
    toggle(target) { const element = this.element(target); if (element) element.open = !element.open; return this; }
    closeAll() { this.items.forEach(item => { item.open = false; }); return this; }
  }

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

  class AnimationManager extends BaseManager {
    constructor(options = {}) {
      super({ duration: 300, easing: 'ease', ...options });
    }

    animate(target, keyframes, options = {}) {
      return nj(target).animate(keyframes, {
        duration: this.options.duration,
        easing: this.options.easing,
        ...options
      });
    }

    fadeIn(target, duration) { return nj(target).fadeIn(duration || this.options.duration); }
    fadeOut(target, duration) { return nj(target).fadeOut(duration || this.options.duration); }
    slideUp(target, duration = this.options.duration) {
      const wrapper = nj(target);
      return Promise.all(wrapper.elements.map(element => {
        const height = element.getBoundingClientRect().height;
        element.style.overflow = 'hidden';
        return nj(element).animate([{ height: `${height}px` }, { height: '0px' }], { duration })
          .then(() => {
            element.style.display = 'none';
            element.style.height = '';
            element.style.overflow = '';
          });
      }));
    }

    slideDown(target, duration = this.options.duration, display = 'block') {
      const wrapper = nj(target);
      return Promise.all(wrapper.elements.map(element => {
        element.style.display = display;
        const height = element.scrollHeight;
        element.style.overflow = 'hidden';
        return nj(element).animate([{ height: '0px' }, { height: `${height}px` }], { duration })
          .then(() => {
            element.style.height = '';
            element.style.overflow = '';
          });
      }));
    }

    pulse(target, duration = 500) {
      return this.animate(target, [
        { transform: 'scale(1)' },
        { transform: 'scale(1.04)' },
        { transform: 'scale(1)' }
      ], { duration });
    }
  }

  class FormManager extends BaseManager {
    element(form) { return typeof form === 'string' ? document.querySelector(form) : form; }

    serialize(form) {
      const element = this.element(form);
      return element ? nj(element).serialize() : {};
    }

    validate(form) {
      const element = this.element(form);
      if (!element) return false;
      const valid = element.checkValidity();
      if (!valid) element.reportValidity();
      return valid;
    }

    reset(form) {
      this.element(form)?.reset();
      return this;
    }

    submit(form, options = {}) {
      const element = this.element(form);
      if (!element) return Promise.reject(new Error('Form not found'));
      if (options.validate !== false && !this.validate(element)) {
        return Promise.reject(new Error('Form validation failed'));
      }

      const url = options.url || element.action;
      const method = (options.method || element.method || 'POST').toUpperCase();

      if (method === 'GET') {
        const query = new URLSearchParams(this.serialize(element)).toString();
        return nj.ajax.get(`${url}${url.includes('?') ? '&' : '?'}${query}`, options);
      }

      if (options.formData) return nj.ajax.postForm(url, new FormData(element), options);

      return nj.ajax.request(url, {
        ...options,
        method,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        body: JSON.stringify(this.serialize(element))
      });
    }

    bind(form, options = {}) {
      const element = this.element(form);
      if (!element) return this;

      element.addEventListener('submit', event => {
        event.preventDefault();
        this.submit(element, options)
          .then(result => options.onSuccess?.(result, element))
          .catch(error => options.onError ? options.onError(error, element) : console.error(error));
      });

      return this;
    }
  }

  class ModalManager extends BaseManager {
    constructor(options = {}) {
      super({ activeClass: 'is-open', closeSelector: '[data-modal-close]', ...options });
      this.active = null;
      this.lastFocus = null;
    }

    element(target) { return typeof target === 'string' ? document.querySelector(target) : target; }

    open(target) {
      const modal = this.element(target);
      if (!modal) return this;

      this.lastFocus = document.activeElement;
      this.active = modal;
      modal.hidden = false;
      modal.classList.add(this.options.activeClass);
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      modal.querySelector('[autofocus],button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')?.focus();
      modal.querySelectorAll(this.options.closeSelector)
        .forEach(button => button.addEventListener('click', () => this.close(modal), { once: true }));

      return this;
    }

    close(target) {
      const modal = target ? this.element(target) : this.active;
      if (!modal) return this;

      modal.classList.remove(this.options.activeClass);
      modal.setAttribute('aria-hidden', 'true');
      modal.hidden = true;
      document.body.classList.remove('modal-open');
      this.lastFocus?.focus();
      if (modal === this.active) this.active = null;
      return this;
    }

    toggle(target) {
      const modal = this.element(target);
      if (!modal) return this;
      return modal.hidden || !modal.classList.contains(this.options.activeClass)
        ? this.open(modal)
        : this.close(modal);
    }

    create(options = {}) {
      const modal = document.createElement('div');
      modal.className = options.className || 'nj-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.hidden = true;
      if (options.id) modal.id = options.id;
      if (options.label) modal.setAttribute('aria-label', options.label);

      modal.innerHTML = `
        <div class="nj-modal__backdrop" data-modal-close></div>
        <div class="nj-modal__dialog">
          ${options.closeButton === false ? '' : '<button type="button" class="nj-modal__close" data-modal-close aria-label="Schließen">×</button>'}
          <div class="nj-modal__content">${options.content || ''}</div>
        </div>`;

      document.body.appendChild(modal);
      return modal;
    }
  }

  nj.core.ajax = new AjaxManager();
  nj.core.cookie = new CookieManager();

  nj.storage = new StorageManager();
  nj.navigation = new NavigationManager();
  nj.sidebar = new SidebarManager();
  nj.accordion = new AccordionManager();
  nj.theme = new ThemeManager();
  nj.animation = new AnimationManager();
  nj.ajax = new AjaxManager();
  nj.form = new FormManager();
  nj.modal = new ModalManager();
  nj.cookie = new CookieManager();

  nj.managers = {
    BaseManager,
    StorageManager,
    AjaxManager,
    CookieManager,
    NavigationManager,
    SidebarManager,
    AccordionManager,
    ThemeManager,
    AnimationManager,
    FormManager,
    ModalManager
  };

  nj.post = function (url, data, callback) {
    const promise = nj.ajax.post(url, data);
    if (typeof callback === 'function') {
      promise.then(result => callback(result)).catch(error => callback(null, error));
    }
    return promise;
  };

  nj.fetchPost = nj.fetchPostNew = nj.post;
})(window);
