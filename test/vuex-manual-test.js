const Vuex = require('vuex');
const Vue = require('vue');
const { VuexObservable } = require('../index');
const { epics } = require('./store');

const { ofType } = require('../index');
const { from } = require('rxjs');
const { switchMap, mapTo, tap } = require('rxjs/operators');

Vue.use(Vuex);

const store = new Vuex.Store({
  mutations: {
    SET_NUMBER(state, number) {
      state.number = number;
    }
  },
  state: {
    number: 0
  },
  actions: {
    INCREMENT_NUMBER({ commit, state }) {
      console.log(state.number);
      commit('SET_NUMBER', state.number + 1);
    }
  },
  getters: {
    NUMBER(state) {
      return state.number;
    }
  },
  plugins: [VuexObservable(epics, { dependencies: { ofType, from, switchMap, mapTo, tap } })]
});

store.dispatch('INCREMENT_NUMBER');

console.log(store.state.number);
