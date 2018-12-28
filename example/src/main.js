// Imports dependencies.
import Vue from 'vue'
import App from './App.vue'
import store from './store'

// Sets up Vue.
new Vue({
  el: '#app',
  render: h => h(App),
  store
})
