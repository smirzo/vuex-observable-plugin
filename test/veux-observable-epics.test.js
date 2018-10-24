const store = require('./store-init.js');
const types = require('./types');
const sleep = time => new Promise(res => setTimeout(res, time));

describe('Vuex Observable epic functionalites', () => {
  test('Dispatches simple sync epic that properly changes the state', () => {
    store.dispatch(types.ADD_THREE);
    expect(store.getters[types.NUMBER]).toEqual(3);
  });
  test('Dispatches an epic that depends on previous state and properly changes the state', () => {
    store.dispatch(types.DECREMENT_NUMBER);
    store.dispatch(types.DECREMENT_NUMBER);
    expect(store.getters[types.NUMBER]).toEqual(1);
  });
  test('Receives expected state after performing multiple synchronous actions and epics that depend on previous state', () => {
    store.dispatch(types.DECREMENT_NUMBER);
    store.dispatch(types.ADD_THREE);
    store.dispatch(types.ADD_THREE);
    store.dispatch(types.DECREMENT_NUMBER);
    store.dispatch(types.INCREMENT_NUMBER);
    store.dispatch(types.INCREMENT_NUMBER);
    store.dispatch(types.ADD_THREE);
    store.dispatch(types.DECREMENT_NUMBER);
    expect(store.getters[types.NUMBER]).toEqual(9);
    expect(store.state.data).toEqual(null);
  });
  test('Receives correct state after dispacthing an async epic', async () => {
    store.dispatch(types.REQUEST_DATA);
    await sleep(0);
    expect(store.getters[types.DATA]).toEqual({ a: 1, b: 2 });
  });
  test('Receives correct state after dispacthing multiple async epics', async () => {
    store.dispatch(types.REQUEST_DATA);
    await sleep(0);
    expect(store.getters[types.DATA]).toEqual({ a: 1, b: 2 });
    store.commit(types.SET_DATA, null);
    expect(store.getters[types.DATA]).toEqual(null);
    store.dispatch(types.REQUEST_DATA);
    await sleep(0);
    expect(store.getters[types.DATA]).toEqual({ a: 1, b: 2 });
    expect(store.state.number).toEqual(9);
  });
  test('Gets correct data from getters inside epics', () => {
    store.dispatch(types.CHECK_GETTERS);
    expect(store.state.data).toEqual(19);
  });
  test('Store stream emits correctly and satisifies the immutability assumptions', async () => {
    store.dispatch(types.START_INTERVAL);
    await sleep(1050);
    expect(store.state.number).toEqual(14);
    store.commit(types.INTERVAL_OFF);
    await sleep(250);
    expect(store.state.number).toEqual(14);
  });
});
