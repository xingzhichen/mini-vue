import {nextTick} from '../utils'
import {translateToAst} from '../compile/ast-to-render'
import translateTorender from '../compile/ast-to-render'
import Watcher from "./watcher";

export default function (Vue) {
  Vue.prototype.$nextTick = nextTick
  Vue.prototype._update = function () {

  }
  Vue.prototype.$mount = function (el) {
    const ele = document.querySelector(el).outerHTML.trim();
    translateToAst(ele);
    // const {render} = translateTorender(ast);
    // this.$options._render = render;
    // const fn = function () {
    //   this._update(this.$options._render())
    // }.bind(this)
    // new Watcher(() => {
    //
    // }, this, false)
  }
}