/*! nojquery 4.1.0 - form module */
(function(global){
  "use strict";
  const nj = global.nj;
  if (!nj || !nj.core) throw new Error("nojquery Core zuerst laden");
  const BaseManager = nj.managers.BaseManager;
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
  nj.form = new FormManager();
  nj.managers.FormManager = FormManager;
})(window);
