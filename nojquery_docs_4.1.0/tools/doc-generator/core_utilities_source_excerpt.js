nj.exposeAliases = function (options = {}) {
    const config = {
      underscore: nj.config.exposeUnderscore,
      dollar: nj.config.exposeDollar,
      force: nj.config.forceAliasOverwrite,
      ...options
    };

nj.create = (tag, attributes = {}, children = []) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'text') element.textContent = value;
      else if (key === 'html') element.innerHTML = value;
      else if (key === 'class') element.className = value;
      else if (key === 'dataset' && value && typeof value === 'object') Object.assign(element.dataset, value);
      else if (key.startsWith('on') && typeof value ==

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
    return

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
  nj.filterObjectArray = (array, field, value

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
    if

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
    if

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
    return 'Unknown

nj.detectBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Edg/')) return 'ChromiumEdge';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Unknown';
  };

nj.upload = (url, files, fields = {}, options = {}) => {
    const form = new FormData();
    Object.entries(fields).forEach(([k,v]) => form.append(k,v));
    const list = files instanceof FileList || Array.isArray(files) ? Array.from(files) : [files];
    list.filter(Boolean).forEach(file => form.append(options.fileField || 'files[]', file));
    return nj.request(url, { ...options, method: options.method || 'POST', body: form });
  };

nj.observe = (target, callback, options={ childList:true, subtree:true }) => { const obs=new MutationObserver(callback); toArray(target instanceof NJ?target:nj(target)).forEach(el=>obs.observe(el,options)); return obs; };
  nj.visible = (target, callback, options={}) => { const obs=new IntersectionObserver(entries=>entries.forEach(e=>callback(e.isIntersecting,e)),options); nj(target).each(function(){obs.observe(this);}); return obs; };
  nj.resize = (target, callback) => { const obs=new ResizeOb

nj.visible = (target, callback, options={}) => { const obs=new IntersectionObserver(entries=>entries.forEach(e=>callback(e.isIntersecting,e)),options); nj(target).each(function(){obs.observe(this);}); return obs; };
  nj.resize = (target, callback) => { const obs=new ResizeObserver(entries=>entries.forEach(e=>callback(e.contentRect,e))); nj(target).each(function(){obs.observe(this);}); return obs; };

nj.resize = (target, callback) => { const obs=new ResizeObserver(entries=>entries.forEach(e=>callback(e.contentRect,e))); nj(target).each(function(){obs.observe(this);}); return obs; };

nj.template = (template, data={}) => String(template).replace(/{{{\s*([\w.]+)\s*}}}|{{\s*([\w.]+)\s*}}/g, (_,raw,safe) => { const path=raw||safe; const val=path.split('.').reduce((o,k)=>o?.[k],data); return raw ? String(val ?? '') : nj.escapeHTML(val ?? ''); });
  nj.render = (target, template, data={}, mode='html') => { const html=nj.template(template,data); const el=nj(target); return mode==='append' ? el.append(html) : el.html(html); };

nj.render = (target, template, data={}, mode='html') => { const html=nj.template(template,data); const el=nj(target); return mode==='append' ? el.append(html) : el.html(html); };

nj.route = (pattern, handler) => { routes.push({pattern,handler}); return nj; };
  nj.router = {
    start(){ const run=()=>{ const path=location.pathname; for(const r of routes){ const keys=[]; const rx=new RegExp('^'+String(r.pattern).replace(/:([\w]+)/g,(_,k)=>(keys.push(k),'([^/]+)'))+'$'); const m=path.match(rx); if(m){ const params=Object.fromEntries(keys.map((k,i)=>[k,decodeURIComponent(m[i+1])])); r.handler(params,path); return true; }} return false; }; addEventListener('popstate',run);

nj.navigate=(...a)=>nj.router.navigate(...a);
  nj.url = {
    parse: value => new URL(value || location.href, location.href),
    get(name, value=location.href){ return new URL(value,location.href).searchParams.get(name); },
    set(name,val,value=location.href){ const u=new URL(value,location.href); u.searchParams.set(name,val); return u.toString(); },
    remove(name,value=location.href){ const u=new URL(value,location.href); u.searchParams.delete(name); return u.toString(); },
    query(valu

nj.drag = (target, options={}) => nj(target).each(function(){ this.draggable=options.enabled!==false; this.addEventListener('dragstart',e=>{e.dataTransfer?.setData('text/plain',options.data?.(this) ?? this.id ?? ''); options.start?.call(this,e);}); this.addEventListener('dragend',e=>options.end?.call(this,e)); });
  nj.drop = (target, handler, options={}) => nj(target).each(function(){ this.addEventListener('dragover',e=>{e.preventDefault();options.over?.call(this,e);}); this.addEventListener('d

nj.drop = (target, handler, options={}) => nj(target).each(function(){ this.addEventListener('dragover',e=>{e.preventDefault();options.over?.call(this,e);}); this.addEventListener('drop',e=>{e.preventDefault();handler.call(this,e,e.dataTransfer?.getData('text/plain'));}); });
  nj.sortable = (target, options={}) => nj(target).each(function(){ let dragged=null; Array.from(this.children).forEach(ch=>{ch.draggable=true;ch.addEventListener('dragstart',()=>dragged=ch);}); this.addEventListener('drago

nj.sortable = (target, options={}) => nj(target).each(function(){ let dragged=null; Array.from(this.children).forEach(ch=>{ch.draggable=true;ch.addEventListener('dragstart',()=>dragged=ch);}); this.addEventListener('dragover',e=>{e.preventDefault();const after=Array.from(this.children).find(ch=>e.clientY<ch.getBoundingClientRect().top+ch.offsetHeight/2); dragged && this.insertBefore(dragged,after||null);}); this.addEventListener('drop',e=>{e.preventDefault();options.change?.(Array.from(this.chil

nj.uuid = () => global.crypto?.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16);});
  nj.random = { int:(min,max)=>Math.floor(Math.random()*(max-min+1))+min, float:(min=0,max=1)=>Math.random()*(max-min)+min, string:(length=12,chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')=>Array.from({length},()=>chars[Math.floor(Math.random()*chars.length)]).join(''), color:()=>`#${Math.floo

nj.logger = ['log','info','warn','error','debug','table','group','groupEnd'].reduce((o,m)=>(o[m]=(...args)=>{if(nj.config.debug || ['warn','error'].includes(m)) console[m]?.('[nojquery]',...args);},o),{});
  nj.log = (...args)=>nj.logger.log(...args);

nj.fEa = (array, callback) => array.forEach((value, index) => callback(index, value));
  nj.ddS = (name, value) => nj.cssVar(name, value);
  nj.ddG = name => nj.cssVar(name);
  nj.gBr = nj.detectBrowser;

nj.ddS = (name, value) => nj.cssVar(name, value);
  nj.ddG = name => nj.cssVar(name);
  nj.gBr = nj.detectBrowser;

nj.ready = callback => {
    if (typeof callback !== 'function') return;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
    else queueMicrotask(callback);
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
  nj.cssV

nj.escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  nj.template = (template, data={}) => String(template).replace(/{{{\s*([\w.]+)\s*}}}|{{\s*([\w.]+)\s*}}/g, (_,raw,safe) => { const path=raw||safe; const val=path.split('.').reduce((o,k)=>o?.[k],data); return raw ? String(val ?? '') : nj.escapeHTML(val ?? ''); });
  nj.render = (target, template, data={}, mode='html') => { const html=nj.template(template,data)

nj.releaseAlias = name => {
    if (!['_', '$'].includes(name) || global[name] !== nj) return false;
    global[name] = name === '_' ? previousAliases.underscore : previousAliases.dollar;
    return true;
  };

nj.hasAlias = name => global[name] === nj;

nj.ddG = name => nj.cssVar(name);
  nj.gBr = nj.detectBrowser;
