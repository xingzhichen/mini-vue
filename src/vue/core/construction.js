import {mergeOptions} from '../utils'
import initState from './init-state'
let uid = 0;
export default function (Vue) {
  Vue.prototype.init = function (options) {
    let vm = this;
    vm._uid = ++uid;
    vm._isVue = true;
    vm.$options = mergeOptions(
        vm.constructor,
        options,
        vm
    );
    vm._self = vm;
    //处理methods compited,data,watch
    //依赖收集
    initState(vm)
    //mounted
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}