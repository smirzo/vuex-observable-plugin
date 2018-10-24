const Vuex = require('vuex');
const Vue = require('vue');

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
      commit('SET_NUMBER', state.number + 1);
    }
  },
  getters: {
    NUMBER(state) {
      return state.number;
    }
  }
});

module.exports = store;
