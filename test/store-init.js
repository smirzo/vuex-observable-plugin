// Vue, Vuex and Vuex observable
const Vue = require('vue');
const Vuex = require('vuex');
const { VuexObservable } = require('../index');

// Store
const { actions, mutations, state, getters, epics } = require('./store');

// Operators
const { ofType } = require('../index');
const { from, interval } = require('rxjs');
const {
  filter,
  switchMap,
  mapTo,
  tap,
  map,
  takeUntil,
  distinctUntilChanged,
  skip
} = require('rxjs/operators');

// Set up
Vue.use(Vuex);

const store = new Vuex.Store({
  actions,
  mutations,
  state,
  getters,
  plugins: [
    VuexObservable(epics, {
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
    })
  ]
});

module.exports = store;
