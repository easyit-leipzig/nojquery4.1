/*!
 * nojquery 4.1.0 - Complete Core
 * Modern DOM helper with backward-compatible aliases.
 * License: MIT
 */
(function (global) {
  'use strict';

  const previousAliases = {
    underscore: global._,
    dollar: global.$
  };

  const isNode = value =>
    typeof Node !== 'undefined' && value instanceof Node;

  const isNodeList = value =>
    typeof NodeList !== 'undefined' &&
    (value instanceof NodeList ||
     (typeof HTMLCollection !== 'undefined' && value instanceof HTMLCollection));

  const toArray = value => {
    if (!value) return [];
    if (value instanceof NJ) return value.elements.slice();
    if (isNode(value) || value === window || value === document) return [value];
    if (isNodeList(value)) return Array.from(value);
    if (Array.isArray(value)) return value.filter(item => isNode(item) || item === window || item === document);
    return [];
  };

  const select = (selector, context = document) => {
    if (!selector && selector !== 0) return [];
    if (selector instanceof NJ) return selector.elements.slice();
    if (isNode(selector) || selector === window || selector === document) return [selector];
    if (isNodeList(selector)) return Array.from(selector);
    if (Array.isArray(selector)) return selector.filter(isNode);
    if (typeof selector !== 'string') return [];

    const value = selector.trim();
    if (!value) return [];

    try {
      if (/^#[A-Za-z][\w\-:.]*$/.test(value) && context === document) {
        const element = document.getElementById(value.slice(1));
        return element ? [element] : [];
      }
      if (/^\.[A-Za-z_][\w-]*$/.test(value) && context === document) {
        return Array.from(document.getElementsByClassName(value.slice(1)));
      }
      if (/^[A-Za-z][\w-]*$/.test(value) && context === document) {
        return Array.from(document.getElementsByTagName(value));
      }
      return Array.from(context.querySelectorAll(value));
    } catch (error) {
      if (nj.config.debug) console.error('nojquery selector error:', error);
      return [];
    }
  };

  class NJ {
    constructor(elements = []) {
      this.elements = toArray(elements);
    }

    get length() { return this.elements.length; }
    get e() {
      if (!this.elements.length) return null;
      if (this.elements.length === 1) return this.elements[0];
      const list = this.elements.slice();
      list.item = index => list[index] || null;
      return list;
    }

    [Symbol.iterator]() { return this.elements[Symbol.iterator](); }

    each(callback) {
      if (typeof callback !== 'function') return this;
      this.elements.forEach((element, index) => callback.call(element, index, element));
      return this;
    }

    map(callback) {
      return this.elements.map((element, index) => callback.call(element, index, element));
    }

    get(index = 0) {
      if (index < 0) index = this.elements.length + index;
      return this.elements[index];
    }

    first() { return new NJ(this.elements.length ? [this.elements[0]] : []); }
    last() { return new NJ(this.elements.length ? [this.elements[this.elements.length - 1]] : []); }
    eq(index) {
      const element = this.get(index);
      return new NJ(element ? [element] : []);
    }

    find(selector) {
      const result = [];
      this.each(function () { result.push(...select(selector, this)); });
      return new NJ([...new Set(result)]);
    }

    closest(selector) {
      const result = this.elements.map(el => el.closest ? el.closest(selector) : null).filter(Boolean);
      return new NJ([...new Set(result)]);
    }

    parent() {
      return new NJ([...new Set(this.elements.map(el => el.parentElement).filter(Boolean))]);
    }

    children(selector) {
      let result = [];
      this.each(function () { result.push(...Array.from(this.children || [])); });
      if (selector) result = result.filter(el => el.matches(selector));
      return new NJ(result);
    }

    next() { return new NJ(this.elements.map(el => el.nextElementSibling).filter(Boolean)); }
    prev() { return new NJ(this.elements.map(el => el.previousElementSibling).filter(Boolean)); }

    html(value) {
      if (value === undefined) return this.get()?.innerHTML;
      return this.each(function () { this.innerHTML = value; });
    }

    text(value) {
      if (value === undefined) return this.get()?.textContent;
      return this.each(function () { this.textContent = value; });
    }

    val(value) {
      if (value === undefined) return this.get()?.value;
      return this.each(function () { this.value = value; });
    }

    append(content) { return insertContent(this, content, 'beforeend'); }
    prepend(content) { return insertContent(this, content, 'afterbegin'); }
    before(content) { return insertContent(this, content, 'beforebegin'); }
    after(content) { return insertContent(this, content, 'afterend'); }

    appendTo(target) {
      const parent = nj(target).get();
      if (!parent) return this;
      return this.each(function () { parent.appendChild(this); });
    }

    empty() { return this.each(function () { this.replaceChildren(); }); }
    remove() { return this.each(function () { this.remove(); }); }

    attr(name, value) {
      if (typeof name === 'object') {
        return this.each(function () {
          Object.entries(name).forEach(([key, val]) => this.setAttribute(key, String(val)));
        });
      }
      if (value === undefined) return this.get()?.getAttribute(name);
      return this.each(function () { this.setAttribute(name, String(value)); });
    }

    removeAttr(name) { return this.each(function () { this.removeAttribute(name); }); }
    hasAttr(name) { return !!this.get()?.hasAttribute(name); }

    prop(name, value) {
      if (value === undefined) return this.get()?.[name];
      return this.each(function () { this[name] = value; });
    }

    data(name, value) {
      if (value === undefined) return this.get()?.dataset?.[name];
      return this.each(function () {
        if (this.dataset) this.dataset[name] = String(value);
      });
    }

    removeData(name) {
      return this.each(function () {
        if (this.dataset) delete this.dataset[name];
      });
    }

    addClass(classes) {
      const list = String(classes || '').split(/\s+/).filter(Boolean);
      return this.each(function () { this.classList?.add(...list); });
    }

    removeClass(classes) {
      const list = String(classes || '').split(/\s+/).filter(Boolean);
      return this.each(function () { this.classList?.remove(...list); });
    }

    toggleClass(name, force) {
      return this.each(function () {
        if (!this.classList) return;
        force === undefined ? this.classList.toggle(name) : this.classList.toggle(name, !!force);
      });
    }

    hasClass(name) { return !!this.get()?.classList?.contains(name); }

    css(property, value) {
      if (typeof property === 'object') {
        return this.each(function () {
          Object.entries(property).forEach(([key, val]) => {
            if (key.startsWith('--')) this.style.setProperty(key, val);
            else this.style[key] = val;
          });
        });
      }
      if (value === undefined) {
        const element = this.get();
        return element ? getComputedStyle(element).getPropertyValue(property) || getComputedStyle(element)[property] : undefined;
      }
      return this.each(function () {
        if (property.startsWith('--')) this.style.setProperty(property, value);
        else this.style[property] = value;
      });
    }

    removeCss(property) {
      return this.each(function () { this.style?.removeProperty(property); });
    }

    show(display = '') {
      return this.each(function () {
        this.hidden = false;
        this.style.display = display;
        if (getComputedStyle(this).display === 'none') this.style.display = 'block';
      });
    }

    hide() {
      return this.each(function () { this.style.display = 'none'; });
    }

    toggle(display = 'block') {
      return this.each(function () {
        this.style.display = getComputedStyle(this).display === 'none' ? display : 'none';
      });
    }

    on(events, selector, handler, options) {
      if (typeof selector === 'function') {
        options = handler;
        handler = selector;
        selector = null;
      }
      if (typeof handler !== 'function') return this;

      return this.each(function () {
        const element = this;
        String(events).split(/\s+/).filter(Boolean).forEach(eventName => {
          const wrapped = selector
            ? function (event) {
                const match = event.target.closest(selector);
                if (match && element.contains(match)) handler.call(match, event);
              }
            : handler;

          element.__njEvents ||= [];
          element.__njEvents.push({ eventName, original: handler, wrapped, selector, options });
          element.addEventListener(eventName, wrapped, options || false);
        });
      });
    }

    off(events, handler) {
      const names = events ? String(events).split(/\s+/).filter(Boolean) : [];
      return this.each(function () {
        const records = this.__njEvents || [];
        this.__njEvents = records.filter(record => {
          const eventMatches = !names.length || names.includes(record.eventName);
          const handlerMatches = !handler || handler === record.original;
          if (eventMatches && handlerMatches) {
            this.removeEventListener(record.eventName, record.wrapped, record.options || false);
            return false;
          }
          return true;
        });
      });
    }

    once(events, selector, handler, options = {}) {
      if (typeof selector === 'function') {
        options = handler || {};
        handler = selector;
        selector = null;
      }
      return this.on(events, selector, handler, { ...options, once: true });
    }

    trigger(name, detail) {
      return this.each(function () {
        this.dispatchEvent(new CustomEvent(name, { bubbles: true, cancelable: true, detail }));
      });
    }

    checked(value) {
      if (value === undefined) return !!this.get()?.checked;
      return this.each(function () { this.checked = !!value; });
    }

    serialize() {
      const element = this.get();
      if (!(element instanceof HTMLFormElement)) return {};
      const result = {};
      new FormData(element).forEach((value, key) => {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          result[key] = Array.isArray(result[key]) ? [...result[key], value] : [result[key], value];
        } else {
          result[key] = value;
        }
      });
      return result;
    }

    rect() { return this.get()?.getBoundingClientRect(); }

    scrollIntoView(options = { behavior: 'smooth', block: 'start' }) {
      return this.each(function () { this.scrollIntoView(options); });
    }

    animate(keyframes, options = {}) {
      const defaults = {
        duration: nj.config.animation.duration,
        easing: nj.config.animation.easing,
        fill: 'both'
      };
      return Promise.all(this.elements.map(element => {
        if (!element.animate) return Promise.resolve();
        return element.animate(keyframes, { ...defaults, ...options }).finished;
      }));
    }

    fadeIn(duration) {
      this.show();
      return this.animate([{ opacity: 0 }, { opacity: 1 }], { duration: duration || nj.config.animation.duration });
    }

    fadeOut(duration) {
      return this.animate([{ opacity: 1 }, { opacity: 0 }], { duration: duration || nj.config.animation.duration })
        .then(() => this.hide());
    }

    is(selector) { return !!this.get()?.matches?.(selector); }
    exists() { return this.elements.length > 0; }
  }

  function insertContent(wrapper, content, position) {
    return wrapper.each(function (index) {
      if (typeof content === 'string') {
        this.insertAdjacentHTML(position, content);
        return;
      }

      const nodes = content instanceof NJ ? content.elements : toArray(content);
      if (!nodes.length) {
        this.insertAdjacentText(position, String(content ?? ''));
        return;
      }

      nodes.forEach(node => {
        const item = index === 0 ? node : node.cloneNode(true);
        if (position === 'beforeend') this.appendChild(item);
        else if (position === 'afterbegin') this.insertBefore(item, this.firstChild);
        else if (position === 'beforebegin') this.parentNode?.insertBefore(item, this);
        else if (position === 'afterend') this.parentNode?.insertBefore(item, this.nextSibling);
      });
    });
  }

  function nj(selector, context) {
    if (selector instanceof NJ) return selector;
    return new NJ(select(selector, context ? nj(context).get() : document));
  }

  nj.version = '4.1.0';
  nj.NJ = NJ;

  nj.config = {
    debug: false,
    warn: true,
    exposeUnderscore: true,
    exposeDollar: false,
    forceAliasOverwrite: false,
    ajaxTimeout: 8000,
    animation: {
      duration: 300,
      easing: 'ease'
    }
  };

  class StorageManager {
    constructor(scope = 'local', namespace = 'nojquery') {
      this.scope = scope === 'session' ? 'session' : 'local';
      this.namespace = String(namespace || '').trim();
    }

    get store() {
      try {
        return this.scope === 'session' ? global.sessionStorage : global.localStorage;
      } catch (error) {
        if (nj.config.debug) console.error('nojquery storage access error:', error);
        return null;
      }
    }

    key(name) {
      const key = String(name);
      return this.namespace ? `${this.namespace}.${key}` : key;
    }

    isAvailable() {
      const store = this.store;
      if (!store) return false;

      const testKey = this.key('__nj_storage_test__');
      try {
        store.setItem(testKey, '1');
        store.removeItem(testKey);
        return true;
      } catch (error) {
        if (nj.config.debug) console.error('nojquery storage unavailable:', error);
        return false;
      }
    }

    set(name, value) {
      const store = this.store;
      if (!store) return null;

      try {
        store.setItem(this.key(name), JSON.stringify(value));
        return value;
      } catch (error) {
        if (nj.config.debug) console.error('nojquery storage set error:', error);
        return null;
      }
    }

    get(name, fallback = null) {
      const store = this.store;
      if (!store) return fallback;

      try {
        const value = store.getItem(this.key(name));
        if (value === null) return fallback;
        return JSON.parse(value);
      } catch (error) {
        if (nj.config.debug) console.error('nojquery storage get error:', error);
        return fallback;
      }
    }

    has(name) {
      const store = this.store;
      if (!store) return false;

      try {
        return store.getItem(this.key(name)) !== null;
      } catch (error) {
        if (nj.config.debug) console.error('nojquery storage has error:', error);
        return false;
      }
    }

    remove(name) {
      const store = this.store;
      if (!store) return false;

      try {
        store.removeItem(this.key(name));
        return true;
      } catch (error) {
        if (nj.config.debug) console.error('nojquery storage remove error:', error);
        return false;
      }
    }

    keys() {
      const store = this.store;
      if (!store) return [];

      try {
        const prefix = this.namespace ? `${this.namespace}.` : '';
        const result = [];
        for (let index = 0; index < store.length; index += 1) {
          const key = store.key(index);
          if (key === null || (prefix && !key.startsWith(prefix))) continue;
          result.push(prefix ? key.slice(prefix.length) : key);
        }
        return result;
      } catch (error) {
        if (nj.config.debug) console.error('nojquery storage keys error:', error);
        return [];
      }
    }

    clear() {
      const store = this.store;
      if (!store) return false;

      try {
        this.keys().forEach(name => store.removeItem(this.key(name)));
        return true;
      } catch (error) {
        if (nj.config.debug) console.error('nojquery storage clear error:', error);
        return false;
      }
    }

    get size() {
      return this.keys().length;
    }
  }

  nj.storage = {
    StorageManager,
    local: new StorageManager('local'),
    session: new StorageManager('session'),
    create(scope = 'local', namespace = 'nojquery') {
      return new StorageManager(scope, namespace);
    },
    available(scope = 'local') {
      return new StorageManager(scope, '__nojquery_check__').isAvailable();
    }
  };

  nj.ready = callback => {
    if (typeof callback !== 'function') return;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
    else queueMicrotask(callback);
  };

  nj.create = (tag, attributes = {}, children = []) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'text') element.textContent = value;
      else if (key === 'html') element.innerHTML = value;
      else if (key === 'class') element.className = value;
      else if (key === 'dataset' && value && typeof value === 'object') Object.assign(element.dataset, value);
      else if (key.startsWith('on') && typeof value === 'function') element.addEventListener(key.slice(2).toLowerCase(), value);
      else if (key in element && key !== 'style') element[key] = value;
      else element.setAttribute(key, String(value));
    });
    const list = Array.isArray(children) ? children : [children];
    list.filter(item => item !== null && item !== undefined).forEach(child => {
      element.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return element;
  };

  nj.extend = (...objects) => Object.assign(...objects);
  nj.deepEqual = (a, b) => {
    try { return JSON.stringify(a) === JSON.stringify(b); }
    catch { return false; }
  };
  nj.isJSON = value => {
    try {
      if (typeof value === 'string') JSON.parse(value);
      else JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  };
  nj.arrayRemove = (array, value) => {
    const index = array.indexOf(value);
    if (index >= 0) array.splice(index, 1);
    return array;
  };
  nj.filterObjectArray = (array, field, value) => array.filter(item => item?.[field] === value);
  nj.forEach = (array, callback) => array.forEach(callback);
  nj.cssVar = (name, value) => {
    if (value === undefined) return getComputedStyle(document.documentElement).getPropertyValue(name);
    document.documentElement.style.setProperty(name, value);
    return value;
  };
  nj.detectBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Edg/')) return 'ChromiumEdge';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Unknown';
  };


  // HTTP / AJAX
  nj.request = async (url, options = {}) => {
    const controller = options.controller || new AbortController();
    const timeout = options.timeout ?? nj.config.ajaxTimeout;
    const headers = new Headers(options.headers || {});
    let body = options.body ?? options.data;
    if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob) && !(body instanceof URLSearchParams)) {
      if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
      if (headers.get('Content-Type')?.includes('application/json')) body = JSON.stringify(body);
    }
    const timer = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;
    try {
      const response = await fetch(url, { ...options, body, headers, signal: controller.signal });
      const type = response.headers.get('content-type') || '';
      const data = type.includes('application/json') ? await response.json() : await response.text();
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.status = response.status; error.response = response; error.data = data;
        throw error;
      }
      return { data, response, status: response.status, headers: response.headers };
    } finally { if (timer) clearTimeout(timer); }
  };
  ['get','delete','head'].forEach(method => { nj[method] = (url, options={}) => nj.request(url, { ...options, method: method.toUpperCase() }); });
  ['post','put','patch'].forEach(method => { nj[method] = (url, data, options={}) => nj.request(url, { ...options, method: method.toUpperCase(), data }); });
  nj.ajax = nj.request;
  nj.upload = (url, files, fields = {}, options = {}) => {
    const form = new FormData();
    Object.entries(fields).forEach(([k,v]) => form.append(k,v));
    const list = files instanceof FileList || Array.isArray(files) ? Array.from(files) : [files];
    list.filter(Boolean).forEach(file => form.append(options.fileField || 'files[]', file));
    return nj.request(url, { ...options, method: options.method || 'POST', body: form });
  };

  // Cache
  class CacheManager {
    constructor(storage = null, namespace = 'cache') { this.storage = storage; this.namespace = namespace; this.memory = new Map(); }
    set(key, value, ttl = 0) { const item={ value, expires: ttl>0 ? Date.now()+ttl : 0 }; this.memory.set(key,item); this.storage?.set(`${this.namespace}.${key}`,item); return value; }
    get(key, fallback=null) { const item=this.memory.get(key) || this.storage?.get(`${this.namespace}.${key}`); if(!item) return fallback; if(item.expires && item.expires<Date.now()){this.remove(key);return fallback;} this.memory.set(key,item); return item.value; }
    has(key){ return this.get(key, Symbol.for('nj.missing')) !== Symbol.for('nj.missing'); }
    remove(key){ this.memory.delete(key); this.storage?.remove(`${this.namespace}.${key}`); return true; }
    clear(){ this.memory.clear(); if(this.storage) this.storage.keys().filter(k=>k.startsWith(`${this.namespace}.`)).forEach(k=>this.storage.remove(k)); return true; }
    keys(){ return [...new Set([...this.memory.keys(), ...(this.storage ? this.storage.keys().filter(k=>k.startsWith(`${this.namespace}.`)).map(k=>k.slice(this.namespace.length+1)) : [])])]; }
    get size(){ return this.keys().length; }
  }
  nj.cache = new CacheManager();
  nj.cache.local = new CacheManager(nj.storage.local, 'cache');
  nj.cache.session = new CacheManager(nj.storage.session, 'cache');
  nj.CacheManager = CacheManager;

  // Observer helpers
  nj.observe = (target, callback, options={ childList:true, subtree:true }) => { const obs=new MutationObserver(callback); toArray(target instanceof NJ?target:nj(target)).forEach(el=>obs.observe(el,options)); return obs; };
  nj.visible = (target, callback, options={}) => { const obs=new IntersectionObserver(entries=>entries.forEach(e=>callback(e.isIntersecting,e)),options); nj(target).each(function(){obs.observe(this);}); return obs; };
  nj.resize = (target, callback) => { const obs=new ResizeObserver(entries=>entries.forEach(e=>callback(e.contentRect,e))); nj(target).each(function(){obs.observe(this);}); return obs; };

  // Template and rendering
  nj.escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  nj.template = (template, data={}) => String(template).replace(/{{{\s*([\w.]+)\s*}}}|{{\s*([\w.]+)\s*}}/g, (_,raw,safe) => { const path=raw||safe; const val=path.split('.').reduce((o,k)=>o?.[k],data); return raw ? String(val ?? '') : nj.escapeHTML(val ?? ''); });
  nj.render = (target, template, data={}, mode='html') => { const html=nj.template(template,data); const el=nj(target); return mode==='append' ? el.append(html) : el.html(html); };

  // Router and URL
  const routes=[];
  nj.route = (pattern, handler) => { routes.push({pattern,handler}); return nj; };
  nj.router = {
    start(){ const run=()=>{ const path=location.pathname; for(const r of routes){ const keys=[]; const rx=new RegExp('^'+String(r.pattern).replace(/:([\w]+)/g,(_,k)=>(keys.push(k),'([^/]+)'))+'$'); const m=path.match(rx); if(m){ const params=Object.fromEntries(keys.map((k,i)=>[k,decodeURIComponent(m[i+1])])); r.handler(params,path); return true; }} return false; }; addEventListener('popstate',run); run(); return this; },
    navigate(url, state={}){ history.pushState(state,'',url); dispatchEvent(new PopStateEvent('popstate',{state})); },
    replace(url,state={}){ history.replaceState(state,'',url); dispatchEvent(new PopStateEvent('popstate',{state})); },
    params(){ return Object.fromEntries(new URLSearchParams(location.search)); }
  };
  nj.navigate=(...a)=>nj.router.navigate(...a);
  nj.url = {
    parse: value => new URL(value || location.href, location.href),
    get(name, value=location.href){ return new URL(value,location.href).searchParams.get(name); },
    set(name,val,value=location.href){ const u=new URL(value,location.href); u.searchParams.set(name,val); return u.toString(); },
    remove(name,value=location.href){ const u=new URL(value,location.href); u.searchParams.delete(name); return u.toString(); },
    query(value=location.href){ return Object.fromEntries(new URL(value,location.href).searchParams); },
    hash(value){ if(value===undefined) return location.hash.slice(1); location.hash=value; return value; }
  };

  // Cookies
  nj.cookie = {
    set(name,value,options={}){ let s=`${encodeURIComponent(name)}=${encodeURIComponent(JSON.stringify(value))}`; if(options.days) s+=`; Max-Age=${options.days*86400}`; s+=`; Path=${options.path||'/'}`; if(options.sameSite) s+=`; SameSite=${options.sameSite}`; if(options.secure) s+='; Secure'; document.cookie=s; return value; },
    get(name,fallback=null){ const key=encodeURIComponent(name)+'='; const item=document.cookie.split('; ').find(v=>v.startsWith(key)); if(!item)return fallback; try{return JSON.parse(decodeURIComponent(item.slice(key.length)));}catch{return decodeURIComponent(item.slice(key.length));} },
    has(name){ return this.get(name,Symbol.for('nj.missing'))!==Symbol.for('nj.missing'); },
    remove(name,options={}){ this.set(name,'',{...options,days:-1}); return true; }
  };

  // Validation and formatting
  nj.validate = {
    required:v=>!(v===null||v===undefined||String(v).trim()===''), email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)),
    url:v=>{try{new URL(v);return true;}catch{return false;}}, number:v=>v!==''&&Number.isFinite(Number(v)), integer:v=>Number.isInteger(Number(v)),
    date:v=>!Number.isNaN(Date.parse(v)), phone:v=>/^[+\d][\d\s()./-]{5,}$/.test(String(v)), iban:v=>{const s=String(v).replace(/\s/g,'').toUpperCase(); if(!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s))return false; const r=(s.slice(4)+s.slice(0,4)).replace(/[A-Z]/g,c=>c.charCodeAt(0)-55); let m=0; for(const c of r)m=(m*10+Number(c))%97; return m===1;},
    bic:v=>/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(String(v).toUpperCase()), min:(v,n)=>Number(v)>=n, max:(v,n)=>Number(v)<=n, minLength:(v,n)=>String(v).length>=n, maxLength:(v,n)=>String(v).length<=n,
    test(value,rules={}){ const errors=[]; Object.entries(rules).forEach(([name,arg])=>{const fn=this[name]; if(typeof fn==='function' && !(arg===true?fn(value):fn(value,arg))) errors.push(name);}); return {valid:!errors.length,errors}; }
  };
  nj.format = {
    number:(v,locale=navigator.language,options={})=>new Intl.NumberFormat(locale,options).format(v),
    money:(v,currency='EUR',locale=navigator.language)=>new Intl.NumberFormat(locale,{style:'currency',currency}).format(v),
    percent:(v,locale=navigator.language,options={})=>new Intl.NumberFormat(locale,{style:'percent',...options}).format(v),
    date:(v,locale=navigator.language,options={})=>new Intl.DateTimeFormat(locale,options).format(new Date(v)),
    bytes:(bytes,decimals=2)=>{if(!Number(bytes))return '0 B'; const k=1024,i=Math.floor(Math.log(Math.abs(bytes))/Math.log(k)); return `${parseFloat((bytes/Math.pow(k,i)).toFixed(decimals))} ${['B','KB','MB','GB','TB','PB'][i]}`;}
  };

  // Additional animations
  NJ.prototype.slideDown=function(duration){ return this.each(function(){this.hidden=false;this.style.overflow='hidden';}).animate([{height:'0px',opacity:0},{height:`${this.scrollHeight}px`,opacity:1}],{duration:duration||nj.config.animation.duration}).then(()=>this.each(function(){this.style.height='';this.style.overflow='';})); };
  NJ.prototype.slideUp=function(duration){ return this.animate([{height:`${this.get()?.scrollHeight||0}px`,opacity:1},{height:'0px',opacity:0}],{duration:duration||nj.config.animation.duration}).then(()=>this.hide()); };
  NJ.prototype.slideToggle=function(duration){ return getComputedStyle(this.get()).display==='none'?this.slideDown(duration):this.slideUp(duration); };
  NJ.prototype.zoomIn=function(duration){this.show();return this.animate([{transform:'scale(.8)',opacity:0},{transform:'scale(1)',opacity:1}],{duration:duration||nj.config.animation.duration});};
  NJ.prototype.zoomOut=function(duration){return this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(.8)',opacity:0}],{duration:duration||nj.config.animation.duration}).then(()=>this.hide());};
  NJ.prototype.shake=function(duration=400){return this.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration});};

  // Drag, drop and sortable
  nj.drag = (target, options={}) => nj(target).each(function(){ this.draggable=options.enabled!==false; this.addEventListener('dragstart',e=>{e.dataTransfer?.setData('text/plain',options.data?.(this) ?? this.id ?? ''); options.start?.call(this,e);}); this.addEventListener('dragend',e=>options.end?.call(this,e)); });
  nj.drop = (target, handler, options={}) => nj(target).each(function(){ this.addEventListener('dragover',e=>{e.preventDefault();options.over?.call(this,e);}); this.addEventListener('drop',e=>{e.preventDefault();handler.call(this,e,e.dataTransfer?.getData('text/plain'));}); });
  nj.sortable = (target, options={}) => nj(target).each(function(){ let dragged=null; Array.from(this.children).forEach(ch=>{ch.draggable=true;ch.addEventListener('dragstart',()=>dragged=ch);}); this.addEventListener('dragover',e=>{e.preventDefault();const after=Array.from(this.children).find(ch=>e.clientY<ch.getBoundingClientRect().top+ch.offsetHeight/2); dragged && this.insertBefore(dragged,after||null);}); this.addEventListener('drop',e=>{e.preventDefault();options.change?.(Array.from(this.children));}); });

  // Clipboard, keyboard and device
  nj.clipboard = { copy: async value => navigator.clipboard.writeText(String(value)), read: async () => navigator.clipboard.readText() };
  nj.key = { on(combo,handler,target=document){ const parts=combo.toLowerCase().split('+'); const key=parts.pop(); const fn=e=>{if(e.key.toLowerCase()===key && (!parts.includes('ctrl')||e.ctrlKey) && (!parts.includes('shift')||e.shiftKey) && (!parts.includes('alt')||e.altKey) && (!parts.includes('meta')||e.metaKey)) handler(e);}; target.addEventListener('keydown',fn); return ()=>target.removeEventListener('keydown',fn); }, enter:h=>nj.key.on('enter',h), escape:h=>nj.key.on('escape',h) };
  nj.device = { touch:()=>('ontouchstart' in global)||navigator.maxTouchPoints>0, mobile:()=>matchMedia('(max-width: 767px)').matches, tablet:()=>matchMedia('(min-width: 768px) and (max-width: 1024px)').matches, desktop:()=>matchMedia('(min-width: 1025px)').matches, online:()=>navigator.onLine };

  // Color, date, random and IDs
  nj.color = {
    hexToRgb:hex=>{let h=String(hex).replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');const n=parseInt(h,16);return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};},
    rgbToHex:(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join(''),
    lighten:(hex,p=10)=>{const c=nj.color.hexToRgb(hex),a=255*p/100;return nj.color.rgbToHex(c.r+a,c.g+a,c.b+a);}, darken:(hex,p=10)=>nj.color.lighten(hex,-p)
  };
  nj.date = { today:()=>new Date(new Date().setHours(0,0,0,0)), addDays:(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;}, diff:(a,b,unit='days')=>{const ms=new Date(b)-new Date(a);return ms/({seconds:1000,minutes:60000,hours:3600000,days:86400000}[unit]||1);}, format:(d,locale=navigator.language,opt={})=>new Intl.DateTimeFormat(locale,opt).format(new Date(d)) };
  nj.uuid = () => global.crypto?.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16);});
  nj.random = { int:(min,max)=>Math.floor(Math.random()*(max-min+1))+min, float:(min=0,max=1)=>Math.random()*(max-min)+min, string:(length=12,chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')=>Array.from({length},()=>chars[Math.floor(Math.random()*chars.length)]).join(''), color:()=>`#${Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0')}`, uuid:nj.uuid };

  // Event bus and logger
  const busTarget=new EventTarget();
  nj.bus = { on:(name,handler)=>{busTarget.addEventListener(name,handler);return handler;}, off:(name,handler)=>busTarget.removeEventListener(name,handler), once:(name,handler)=>busTarget.addEventListener(name,handler,{once:true}), emit:(name,detail)=>busTarget.dispatchEvent(new CustomEvent(name,{detail})) };
  nj.logger = ['log','info','warn','error','debug','table','group','groupEnd'].reduce((o,m)=>(o[m]=(...args)=>{if(nj.config.debug || ['warn','error'].includes(m)) console[m]?.('[nojquery]',...args);},o),{});
  nj.log = (...args)=>nj.logger.log(...args);

  nj.core = {
    select,
    toArray,
    isNode,
    isNodeList,
    utilities: {
      extend: nj.extend,
      deepEqual: nj.deepEqual,
      isJSON: nj.isJSON
    }
  };

  nj.exposeAliases = function (options = {}) {
    const config = {
      underscore: nj.config.exposeUnderscore,
      dollar: nj.config.exposeDollar,
      force: nj.config.forceAliasOverwrite,
      ...options
    };

    global.nj = nj;

    const expose = (name, enabled) => {
      if (!enabled) return false;
      if (global[name] !== undefined && global[name] !== nj && !config.force) {
        if (nj.config.warn) console.warn(`nojquery: alias "${name}" is already in use.`);
        return false;
      }
      global[name] = nj;
      return true;
    };

    return {
      nj: true,
      underscore: expose('_', config.underscore),
      dollar: expose('$', config.dollar)
    };
  };

  nj.releaseAlias = name => {
    if (!['_', '$'].includes(name) || global[name] !== nj) return false;
    global[name] = name === '_' ? previousAliases.underscore : previousAliases.dollar;
    return true;
  };

  nj.hasAlias = name => global[name] === nj;

  // Backward compatibility aliases
  NJ.prototype.htm = NJ.prototype.html;
  NJ.prototype.txt = NJ.prototype.text;
  NJ.prototype.v = NJ.prototype.val;
  NJ.prototype.aCh = NJ.prototype.append;
  NJ.prototype.pCh = NJ.prototype.prepend;
  NJ.prototype.app = NJ.prototype.append;
  NJ.prototype.b = NJ.prototype.before;
  NJ.prototype.a = NJ.prototype.append;
  NJ.prototype.aft = NJ.prototype.after;
  NJ.prototype.p = NJ.prototype.parent;
  NJ.prototype.rEl = NJ.prototype.remove;
  NJ.prototype.aCN = NJ.prototype.addClass;
  NJ.prototype.rCN = NJ.prototype.removeClass;
  NJ.prototype.aCl = NJ.prototype.addClass;
  NJ.prototype.rCl = NJ.prototype.removeClass;
  NJ.prototype.tCl = NJ.prototype.toggleClass;
  NJ.prototype.hCl = NJ.prototype.hasClass;
  NJ.prototype.sty = NJ.prototype.css;
  NJ.prototype.sRP = NJ.prototype.removeCss;
  NJ.prototype.atr = NJ.prototype.attr;
  NJ.prototype.hAt = NJ.prototype.hasAttr;
  NJ.prototype.rAt = NJ.prototype.removeAttr;
  NJ.prototype.sDs = NJ.prototype.data;
  NJ.prototype.ds = NJ.prototype.data;
  NJ.prototype.tri = NJ.prototype.trigger;
  NJ.prototype.gRe = NJ.prototype.rect;
  NJ.prototype.isE = NJ.prototype.exists;
  NJ.prototype.fEl = NJ.prototype.first;
  NJ.prototype.lEl = NJ.prototype.last;
  NJ.prototype.nEl = function (number) { return typeof number === 'number' ? this.eq(number - 1) : this.next(); };
  NJ.prototype.bEl = NJ.prototype.prev;
  NJ.prototype.els = function (selector) {
    if (selector !== undefined) return nj(selector).e;
    return this.e;
  };

  // Legacy core command shortcuts (case-sensitive, 1–3 characters).
  // Explicit historical aliases take precedence; no automatic lowercasing.
  const coreShortcuts = Object.freeze({
    each:'ea', map:'mp', get:'g', first:'f', last:'l', eq:'eq',
    find:'fd', closest:'cl', parent:'p', children:'ch', next:'n', prev:'pr',
    html:'htm', text:'txt', val:'v', append:'a', prepend:'pp',
    before:'b', after:'aft', appendTo:'aTo', empty:'emp', remove:'rm',
    attr:'atr', removeAttr:'rAt', hasAttr:'hAt', prop:'pro',
    data:'ds', removeData:'rDs', addClass:'aCl', removeClass:'rCl',
    toggleClass:'tCl', hasClass:'hCl', css:'sty', removeCss:'rCs',
    show:'sh', hide:'hd', toggle:'tog', on:'on', off:'off', once:'onc',
    trigger:'tri', checked:'chk', serialize:'ser', rect:'gRe',
    scrollIntoView:'sIV', animate:'ani', fadeIn:'fIn', fadeOut:'fOu',
    is:'is', exists:'isE'
  });
  for (const [method, alias] of Object.entries(coreShortcuts)) {
    if (alias.length > 3) throw new Error('Invalid nojquery shortcut: ' + alias);
    if (typeof NJ.prototype[method] !== 'function') throw new Error('Missing core method: ' + method);
    if (Object.prototype.hasOwnProperty.call(NJ.prototype, alias) && NJ.prototype[alias] !== NJ.prototype[method]) {
      throw new Error('nojquery shortcut collision: ' + alias);
    }
    NJ.prototype[alias] = NJ.prototype[method];
  }
  nj.coreShortcuts = coreShortcuts;
  nj.resolveCoreShortcut = alias => Object.keys(coreShortcuts).find(name => coreShortcuts[name] === alias) || null;

  nj.oEx = nj.extend;
  nj.cEq = nj.deepEqual;
  nj.isJ = nj.isJSON;
  nj.rAE = nj.arrayRemove;
  nj.fOA = nj.filterObjectArray;
  nj.fEa = (array, callback) => array.forEach((value, index) => callback(index, value));
  nj.ddS = (name, value) => nj.cssVar(name, value);
  nj.ddG = name => nj.cssVar(name);
  nj.gBr = nj.detectBrowser;

  nj.exposeAliases();
})(window);
