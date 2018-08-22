import {nextTick} from '../utils'
import {translateToAst} from '../compile/template-to-ast'
import {translateTorender} from '../compile/ast-to-render'
import Watcher from "./watcher";
import patch from './patch'
import {createTextNode, createHtmlNode, createNormalNode} from '../vnode'

export default function (Vue) {
  Vue.prototype.$nextTick = nextTick
  Vue.prototype._update = function (oldVnode, newVnode, vm) {
    patch(oldVnode, newVnode, vm)
  }
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const ele = document.querySelector(el).outerHTML.trim();
    const ast = translateToAst(ele);
    const render = translateTorender(ast);
    const _render = function () {
      return render.call(vm)
    }
    vm.$options._render = _render;
    const fn = function () {
      let vnode = vm.$options._render();
      console.log(vnode)
      vm._update(vm.vnode, vnode, vm);
      vm.vnode = vnode
    }
    new Watcher(fn, this, false)
  }

// for
  Vue.prototype._f = function (lists, children) {
    return Object.keys(lists).map(key => {
      if (!/^_/.test(key)) {
        return children(lists[key], key)
      }
    }).filter(_ => _)
  }


//createElement
  Vue.prototype._c = function (tag, data, children) {
    return createNormalNode(tag, data, children)

  }
//createTextNode
  Vue.prototype._s = function (text) {
    return createTextNode(text)

  }
  //html
  Vue.prototype._h = function (html) {
    return createHtmlNode(html)
  }
}
