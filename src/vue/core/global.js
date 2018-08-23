import {nextTick} from '../utils/index'
export default function (Vue) {
  Vue.nextTick = nextTick
  Vue.options = Object.create(null)
  Vue.options.base = Vue
}