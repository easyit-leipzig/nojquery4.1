/*! nojquery 4.1.0 - ajax module */
(function(global){
  "use strict";
  const nj = global.nj;
  if (!nj || !nj.core) throw new Error("nojquery Core zuerst laden");
  const BaseManager = nj.managers.BaseManager;
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
  nj.ajax = new AjaxManager();
  nj.core.ajax = nj.ajax;
  nj.post = function(url, data, callback) { const promise = nj.ajax.post(url, data); if (typeof callback === "function") promise.then(result => callback(result)).catch(error => callback(null, error)); return promise; };
  nj.fetchPost = nj.fetchPostNew = nj.post;
  nj.managers.AjaxManager = AjaxManager;
})(window);
