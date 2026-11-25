/*! nojquery 4.1.0 - modal module */
(function(global){
  "use strict";
  const nj = global.nj;
  if (!nj || !nj.core) throw new Error("nojquery Core zuerst laden");
  const BaseManager = nj.managers.BaseManager;
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
  nj.modal = new ModalManager();
  nj.managers.ModalManager = ModalManager;
})(window);
