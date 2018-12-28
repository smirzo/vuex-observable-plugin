const types = require('./types')
const sleep = time => new Promise(resolve => setTimeout(resolve, time))

// Actions
exports.actions = {
  [types.INCREMENT_NUMBER]: ({ commit, state }) => {
    commit(types.SET_NUMBER, state.number + 1)
  },
  [types.DOUBLE_NUMBER]: async ({ commit, state }) => {
    await sleep(0)
    return commit(types.SET_NUMBER, state.number * 2)
  }
}

// Epics
exports.epics = [
  (action$, store$, { ofType, map }) => {
    return action$.pipe(
      ofType(types.CHECK_GETTERS),
      map(() => ({
        type: types.SET_DATA,
        payload: store$.value.state.number + store$.value.getters[types.COMBINED]
      }))
    )
  },
  (action$, store$, { ofType, mapTo }) => {
    return action$.pipe(
      ofType(types.INCREMENT_NUMBER),
      mapTo({ type: types.SET_NUMBER, payload: store$.value.state.number + 1 })
    )
  },
  (action$, store$, { ofType, mapTo }) => {
    return action$.pipe(
      ofType(types.TRIGGER_INCREMENT),
      mapTo({ type: types.INCREMENT_NUMBER, action: true })
    )
  },
  (action$, store$, { ofType, map }) => {
    return action$.pipe(
      ofType(types.DECREMENT_NUMBER),
      map(() => ({ type: types.SET_NUMBER, payload: store$.value.state.number - 1 }))
    )
  },
  (action$, store$, { ofType, from, switchMap }) => {
    return action$.pipe(
      ofType(types.REQUEST_DATA),
      switchMap(() =>
        from(new Promise(resolve => resolve({ type: types.SET_DATA, payload: { a: 1, b: 2 } })))
      )
    )
  },
  (action$, store$, { ofType, mapTo }) => {
    return action$.pipe(
      ofType(types.ADD_THREE),
      mapTo({ type: types.ADD_TO_NUMBER, payload: 3 })
    )
  },
  (action$, store$, { ofType, switchMap, interval, distinctUntilChanged, mapTo, takeUntil, map, skip }) => {
    return action$.pipe(
      ofType(types.START_INTERVAL),
      switchMap(() => {
        return interval(200).pipe(
          mapTo({ type: types.ADD_TO_NUMBER, payload: 1 }),
          takeUntil(
            store$.pipe(
              map(store => store.state.interval),
              distinctUntilChanged(),
              skip(1)
            )
          )
        )
      })
    )
  }
]

// Mutations
exports.mutations = {
  [types.SET_DATA]: (state, data) => (state.data = data),
  [types.SET_NUMBER]: (state, number) => (state.number = number),
  [types.ADD_TO_NUMBER]: (state, value) => (state.number = state.number + value),
  [types.INTERVAL_OFF]: state => {
    state.interval = !state.interval
  }
}

// State
exports.state = {
  number: 0,
  data: null,
  obj: {},
  intervalOff: false
}

// Getters
exports.getters = {
  [types.NUMBER]: state => state.number,
  [types.DATA]: state => state.data,
  [types.COMBINED]: state => ((state.data && state.data.a) || 0) + state.number
}
