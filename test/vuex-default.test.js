const createStore = require('./create-store.js')
const store = createStore()
const types = require('./types')

describe('Default Vuex functionalities', () => {
  test('Store has been initialized', () => {
    expect(typeof store).toEqual('object')
  })

  test('State properties have been defined', () => {
    expect(store.state.number).toEqual(0)
    expect(store.state.data).toEqual(null)
  })

  test('Getters are returning expected values', () => {
    expect(store.getters[types.NUMBER]).toEqual(0)
    expect(store.getters[types.DATA]).toEqual(null)
  })

  test('Synchronous action properly commits mutation', () => {
    store.dispatch(types.INCREMENT_NUMBER)
    expect(store.getters[types.NUMBER]).toEqual(1)
  })

  test('Committing a mutation performs expected state change', () => {
    const number = store.getters[types.NUMBER]
    store.commit(types.SET_NUMBER, number + 1)
    expect(store.getters[types.NUMBER]).toEqual(2)
  })
  test('Sequential synchronous action properly change state', () => {
    store.dispatch(types.INCREMENT_NUMBER)
    store.dispatch(types.INCREMENT_NUMBER)
    expect(store.getters[types.NUMBER]).toEqual(4)
  })
  test('Sequential mutations properly change state', () => {
    store.commit(types.SET_NUMBER, store.state.number + 1)
    store.commit(types.SET_NUMBER, store.state.number + 1)
    expect(store.getters[types.NUMBER]).toEqual(6)
  })
  test('Async actions properly mutate state', async () => {
    await store.dispatch(types.DOUBLE_NUMBER)
    expect(store.getters[types.NUMBER]).toEqual(12)
  })
  test('Multiple sequential async actions properly mutate state', async () => {
    store.dispatch(types.DOUBLE_NUMBER)
    store.dispatch(types.DOUBLE_NUMBER)
    await store.dispatch(types.DOUBLE_NUMBER)
    expect(store.getters[types.NUMBER]).toEqual(96)
  })
})
