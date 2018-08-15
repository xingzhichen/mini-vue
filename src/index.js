import Vue from './vue'
window.vm = new Vue({
  el: '#app',
  data: {
    index: 1,
    arr: [{a: 1}, 2, 3],
    obj: {
      obj1: {
        value: 1
      },
      value: 2
    }
  },
  computed: {
    current() {
      return a
    }
  },
  watch: {
    index(oldVal, newVal) {
      console.log(`旧的value${oldVal}新的value${newVal}`)
    }
  },
  methods: {
    test() {
    }
  }
})
if (module.hot) {
  module.hot.accept();
}