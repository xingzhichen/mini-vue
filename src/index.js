import Vue from './vue'
window.vm = new Vue({
  el: '#app',
  data: {
    src:'www.google.com',
    lists:['v','u','e'],
    inputValue:'input1',
    value:'input2',
    statur:true
  },
  computed: {

  },
  watch: {
    src(a,b){
      console.log(`变化了${a}和${b}`)
    }

  },
  methods: {
    click(){
      console.log('click')
    }

  }
})
if (module.hot) {
  module.hot.accept();
}