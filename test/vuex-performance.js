const store = require('./store-init.js');
// const storeDefault = require('./store-default.js');

const state = require('./state-example.js');
const types = require('./types');

const fakeStore = { number: 0 };

const iterations = 10000;

// FAST
console.time('A');
for (let i = 0; i < iterations; i++) {
  store.dispatch(types.ADD_THREE);
}
console.timeEnd('A');

// console.time('B');
// for (let i = 0; i < iterations; i++) {
//   storeDefault.dispatch(types.INCREMENT_NUMBER);
// }
// console.timeEnd('B');

console.time('C');
for (let i = 0; i < iterations; i++) {
  fakeStore.number = fakeStore.number + 3;
}
console.timeEnd('C');

// LARGE
// console.time('A');
// for (let i = 0; i < iterations; i++) {
//   state.ref = i;
//   store.dispatch(types.CHECK_PERFORMANCE, state);
// }
// console.timeEnd('A');

// console.time('B');
// for (let i = 0; i < iterations; i++) {
//   fakeStore.number = fakeStore.number + 3;
// }
// console.timeEnd('B');
