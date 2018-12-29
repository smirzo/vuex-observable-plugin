// Imports dependencies.
import Vue from 'vue'
import Vuex from 'vuex'
import { VuexObservable, ofType } from 'vuex-observable-plugin'
import { timer } from 'rxjs'
import { map, switchMap, takeUntil } from 'rxjs/operators'

// Defines epic.
const epics = [
  (action$, store$, { ofType, map, switchMap, takeUntil }) => {
    return action$.pipe(
      ofType('START_STREAMING_NUMBERS'),
      switchMap(() => {
        return timer(0, 50).pipe(
          map(() => ({ type: 'SET_NUMBER', payload: Math.random().toFixed(5) })),
          takeUntil(action$.pipe(ofType('STOP_STREAMING_NUMBERS')))
        )
      })
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

// Initialises store.
Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [VuexObservable(epics, { dependencies: { ofType, map, switchMap, takeUntil, timer } })]
})

// Exports store.
export default store
