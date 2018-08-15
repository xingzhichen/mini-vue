import Dep from './dep'

let watcherId = 0;
export default class Watcher {
  constructor(fn, vm, isComputed = false, expression) {
    this.fn = fn;
    this.isComputed = isComputed;
    this.vm = vm;
    this.watcherId = ++watcherId;
    this.expression = expression;
    this.value = null;
    this.deps = []
    if (isComputed) {
      this.dep = new Dep();
      this.initComputed()
    }
    if (this.expression) {
      this.initWatch()
    }
  }

  initWatch() {
    const vm = this.vm;
    Dep.setTarget(this);
    this.value = vm[this.expression]
    Dep.setTarget(null);
    // }

  }

  initComputed() {
  }

  getValue() {
    if (this.isComputed && Dep.target) {
      this.dep.depend()
    }
    Dep.setTarget(this);
    let value = this.fn.call(this.vm)
    Dep.setTarget(null);
    return value
  }

  update() {
    const vm = this.vm;
    if (this.isComputed) {
      console.log('computed更新了');
      this.dep.notify();
    } else if (this.expression) {
      console.log('watcher更新了:'+this.expression);
      let oldValue = this.value;
      let newValue = vm[this.expression]
      this.fn.call(vm, oldValue, newValue)
    } else {
      this.getValue();
    }
  }

  appendDep(dep) {
    this.deps.push(dep)
  }

}