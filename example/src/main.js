// Imports dependencies.
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import packageJSON from '../package.json'

// Sets up Vue.
new Vue({
  el: '#app',
  render: h => h(App),
  store
})

console.log(`Current version: ${packageJSON.dependencies['vuex-observable-plugin']}`)
