import {nextTick} from '../utils'
import {translateToAst} from '../compile/template-to-ast'
import {translateTorender} from '../compile/ast-to-render'
import Watcher from "./watcher";
import Vue from "../index";

export default function (Vue) {
  Vue.prototype.$nextTick = nextTick
  Vue.prototype._update = function () {

  }
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const ele = document.querySelector(el).outerHTML.trim();
    const ast = translateToAst(ele);
    const render = translateTorender(ast);
    const _render = function () {
      render.call(vm)
    }
    vm.$options._render = _render;
    const fn = function () {
      vm._update(vm.$options._render())
    }
    new Watcher(fn, this, false)
  }

// for
  Vue.prototype._f = function (lists,children) {
    debugger
  }


//createElement
  Vue.prototype._c = function (tag, data, children) {
    debugger

  }
//createTextNode
  Vue.prototype._s = function (text) {
    debugger

  }
  //html
  Vue.prototype._h = function () {

  }
}
