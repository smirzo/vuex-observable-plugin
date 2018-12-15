/**
 * @name vuex-observable-plugin
 * @author smirzo
 * @license MIT
 * @description
 * A plugin that adapts the popular redux-observable middleware to Vuex.
 * @requires NPM:redux-observable
 * @requires NPM:clone
 * @requires NPM:fast-deep-equal
 */

'use-strict';

// Imports all redux-observable related methods.
const { createEpicMiddleware, combineEpics, ofType } = require('redux-observable');

// Imports helper function to determine if the store has changed.
const isEqual = require('fast-deep-equal');

// Imports helper function to deep clone the store.
const clone = require('clone');

exports.VuexObservable = (epics = [], options = {}) => {
  // Instantiates the epic middleware.
  const epicMiddleware = createEpicMiddleware(options);
  // Combines the user passed epics into a single root epic.
  const rootEpic = combineEpics(...epics);
  // Creates the main Vuex plugin function.
  return store => {
    // Replaces the default dispatch method with a function that passes undefined actions throught to epics.
    const dispatch = store.dispatch;
    store.dispatch = (type, payload) => {
      if (store._actions[type]) {
        return dispatch(type, payload);
      } else {
        return store.__dispatchEpic({ type, payload });
      }
    };
    // Defines a store model that conforms to the redux-observable middleware api.
    const storeModel = {
      // Returns a new, deep cloned, object reference if state has changed in order to
      // satisfy the state immutability assumption of the redux-observable api.
      getState() {
        if (!isEqual(this.stateCopy, { state: store.state, getters: store.getters })) {
          this.stateCopy = clone({ state: store.state, getters: store.getters });
        }
        return this.stateCopy;
      },
      // If action property has been set to true, dispatches an action, otherwise defaults to committing
      // a mutation in order to fit the Vuex action/mutation seperation philosophy.
      dispatch: ({ type, payload, action }) => {
        if (action === true) {
          store.dispatch(type, payload);
        } else {
          store.commit(type, payload);
        }
      },
      stateCopy: clone({ state: store.state, getters: store.getters })
    };
    // Creates a placeholder 'next' function for passing to the redux-observable middleware.
    const next = action => action;
    // Instanitates the redux-observable middleware and returns a function that can trigger the middleware.
    store.__dispatchEpic = epicMiddleware(storeModel)(next);
    // Sets up a listener for mutations in order to update the store
    // stream even when an epic hasn't been dispatched.
    store.subscribe(mutation => store.__dispatchEpic({ type: '__STATE_CHANGED__' }));
    // Runs the middleware with the root epic.
    epicMiddleware.run(rootEpic);
  };
};

exports.ofType = ofType;
