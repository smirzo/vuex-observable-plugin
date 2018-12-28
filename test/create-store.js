// Imports packages.
const Vue = require('vue')
const Vuex = require('vuex')
const { VuexObservable } = require('../dist/index')

// Imports store.
const { actions, mutations, state, getters, epics } = require('./store')

// Imports operators.
const { ofType } = require('../dist/index')
const { from, interval } = require('rxjs')
const {
  filter,
  switchMap,
  mapTo,
  tap,
  map,
  takeUntil,
  distinctUntilChanged,
  skip
} = require('rxjs/operators')

const options = {
  dependencies: {
    ofType,
    from,
    filter,
    switchMap,
    mapTo,
    tap,
    map,
    interval,
    takeUntil,
    distinctUntilChanged,
    skip
  }
}

// Initializes store.
Vue.use(Vuex)

const createStore = ({ withoutEpics, withoutOptions } = {}) =>
  new Vuex.Store({
    actions,
    mutations,
    state,
    getters,
    plugins: [VuexObservable(withoutEpics ? undefined : epics, withoutOptions ? undefined : options)]
  })

module.exports = createStore
