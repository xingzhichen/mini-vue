import {nextTick} from '../utils'

export default function (Vue) {
  Vue.prototype.$nextTick = nextTick
  Vue.prototype._update = function () {

  }
  Vue.prototype.$mount = function (el) {

  }
}