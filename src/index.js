import Vue from './vue'
window.vm = new Vue({
  el: '#app',
  data: {
    src:'www.google.com',
    list:[1,1,2],
    inputValue:'input1',
    value:'input2',
    statur:true
  },
  computed: {

  },
  watch: {

  },
  methods: {
    select(){}

  }
})
if (module.hot) {
  module.hot.accept();
}