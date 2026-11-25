/*! nojquery 4.1.0 - accordion module */
(function(global){
  "use strict";
  const nj = global.nj;
  if (!nj || !nj.core) throw new Error("nojquery Core zuerst laden");
  const BaseManager = nj.managers.BaseManager;
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
  nj.accordion = new AccordionManager();
  nj.managers.AccordionManager = AccordionManager;
})(window);
