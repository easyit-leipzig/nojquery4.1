/*! nojquery 4.1.0 - animation module */
(function(global){
  "use strict";
  const nj = global.nj;
  if (!nj || !nj.core) throw new Error("nojquery Core zuerst laden");
  const BaseManager = nj.managers.BaseManager;
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
  nj.animation = new AnimationManager();
  nj.managers.AnimationManager = AnimationManager;
})(window);
