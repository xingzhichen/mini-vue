import Dep from '../core/dep'
import {observe} from '../core/init-state'

export function defineReactive(obj, key) {

  if (key === '_ob_') {
    return
  }
  let value = obj[key];
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      let children = observe(value)
      if (Dep.target) {
        dep.depend()
        if (children) {
          children.dep.depend()
        }
      }
      return value
    },
    set(newValue) {
      if (value === newValue) {
        return
      }
      value = newValue;
      observe(newValue);
      dep.notify()
    }
  })
}

function dependArray(value) {

}