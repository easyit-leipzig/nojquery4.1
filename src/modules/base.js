/*! nojquery 4.1.0 manager base */
(function(global){
 "use strict"; const nj=global.nj; if(!nj) throw new Error("nojquery Core zuerst laden"); nj.managers=nj.managers||{}; nj.managers.BaseManager=class BaseManager { constructor(options={}){this.options={...options};} configure(options={}){Object.assign(this.options,options);return this;} };
})(window);
