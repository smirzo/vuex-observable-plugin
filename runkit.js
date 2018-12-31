// Imports dependencies.
const Vue = require('vue')
const Vuex = require('vuex')
const { VuexObservable, ofType } = require('vuex-observable-plugin')
const { map } = require('rxjs/operators')

// Defines a simple epic.
const epics = [
  (action$, store$, { ofType, map }) => {
    return action$.pipe(
      ofType('GENERATE_RANDOM_NUMBER'),
      map(() => ({ type: 'SET_NUMBER', payload: Math.random() }))
    )
  }
]

// Defines state.
const state = {
  number: 0
}

// Defines mutation.
const mutations = {
  SET_NUMBER (state, number) {
    state.number = number
  }
}

// Initialises the store.
Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [VuexObservable(epics, { dependencies: { ofType, map } })]
})

// Dispatches an epic.
store.dispatch('GENERATE_RANDOM_NUMBER')

// Loggs the state after the epic has run.
console.log(store.state.number)
