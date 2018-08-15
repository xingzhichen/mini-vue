import {isArray, defineReactive, proxy} from '../utils'
import {isObject} from '../utils'
import Watcher from './watcher'
import Dep from './dep'
let noop = () => {
}
export default function (vm) {
  vm._watchers = [];
  const options = vm.$options;
  if (options.props) initProps(vm, options.props)
  if (options.methods) initMethods(vm, options.methods)
  if (options.data) {
    initData(vm)
  }
  if (options.computed) initComputed(vm, options.computed)
  if (options.watch) {
    initWatch(vm, options.watch)
  }
}

function initProps() {

}

function initMethods(vm, methods) {
  proxy(methods, vm);
}

export function initData(vm) {
  let data = vm.$options.data;
  proxy(data, vm);
  observe(data)

}

export function initComputed(vm, computes) {
  //绑定到this
  proxy(computes, vm);
  //增加依赖
  Object.keys(computes).forEach(key => {
    const computed = computes[key];
    Object.defineProperty(computes, key, {
      get() {
        let watcher = new Watcher(computed, vm,true)
        return watcher.getValue()
      },
    })

  })

}

export function initWatch(vm,watchs) {
  Object.keys(watchs).forEach(watch=>{
    new Watcher(watchs[watch],vm,false,watch)
  })
}


export function observe(data) {
  let ob
  if (data.hasOwnProperty('_ob_)')) {
    ob = data._ob_
  } else if (isObject(data)) {
    ob = new Observer(data)
  } else {
    ob = null
  }
  return ob

}

class Observer {
  constructor(data) {
    this.value = data;
    this.dep = new Dep();
    this.vmCount = 0;
    data._ob_ = this;
    if (isArray(data)) {
      this.observeArray(data)
    } else {
      Object.keys(data).forEach(item => {
        defineReactive(data, item)

      })
    }
  }


  observeArray(data) {
    data.forEach(item => {
      if (isObject(item)) {
        observe(item)
      }
    })
  }
}