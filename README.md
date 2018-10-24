# Vuex Observable

A plugin that adapts the popular [redux-observable](https://redux-observable.js.org/) middleware to Vuex.

## Installation

`npm i vuex-observable-plugin`

## Usage

```js
import Vue from 'vue';
import Vuex from 'vuex';
import { VuexObservable, ofType } from 'vuex-observable-plugin';

import { actions, mutations, state, getters, epics } from './store';

Vue.use(Vuex);

const store = new Vuex.Store({
  actions,
  mutations,
  state,
  getters,
  plugins: [VuexObservable(epics, { dependencies: { ofType } })]
});
```

## API

**VuexObservable(epics, options)**

- **epics**

  Description: An array containing all the epics.

  Type: `Array`

  Example: `[someEpic, someOtherEpic]`

- **options**

  Description: Options passed to the observable middleware (mostly used for dependency injection). More info about the options can be found [here](https://redux-observable.js.org/docs/api/createEpicMiddleware.html).

  Type: `Object`

  Example: `{ dependencies: { http } }`

## Differences between vuex-observable and redux-observable

This plugin aims to preserve the API of _redux-observable_ and therefore most of the documentation is compliant with what is shown in the [official redux-observable documentation](https://redux-observable.js.org/).

There are however a couple of differences to the original API due to the inherent architectural difference between _Vuex_ and _Redux_:

1. By default, the epics receive an _action_ as input and return a _mutation_ as output. However, it is also possible to return an _action_ as output by simply specifying a third `action` parameter in the returned object. For example:

```js
(action$, store$, { ofType, mapTo }) =>
  action$.pipe(
    ofType('SOME_ACTION'),
    mapTo({ type: 'SOME_MUTATION' })
  );

// => Triggers the mutation 'SOME_MUATATION'
```

```js
(action$, store$, { ofType, mapTo }) =>
  action$.pipe(
    ofType('SOME_ACTION'),
    mapTo({ type: 'SOME_OTHER_ACTION', action: true })
  );

// => Triggers the action 'SOME_OTHER_ACTION'
```

2. The second argument passed to the epic is not only an observable of the _state$_ but the _store$_, which contains both the _state_ and _getters_. For instance:

```js
(action$, store$, { ofType, map }) =>
  action$.pipe(
    ofType('SOME_ACTION'),
    map(payload => ({
      type: 'SOME_MUTATION',
      payload: store$.value.state.number * store$.value.getters['COMPUTED_NUMBER'] * payload
    }))
  );
```

3. A dispatched action is either passed to an action or an epic, but never to both at the same time.<br/><br/>Whenever an action with the dispatched type is available, it will be passed to the Vuex action handler with the matching type name and it will not reach the epics. However, when an action with the dispacthed type has not been registered, it will be passed on to be handled by the root epic. <br/><br/>This is because both actions and epics are asynchronous and running them both in parallel would result in race conditions and unpredictable behaviour.

## Important performance relates notes

When the state gets very large (thousands of object) or if state mutations happen extremely often, then the store might start suffering in performance. This is due to the state mutability differences between _Vuex_ and _Redux_ (Vuex's state is mutable while Redux's is not).

The plugin must therefore check if the state has actually changed on every dispatched epic in order to conform to the _redux-observable_ api, which will expect a new object refrenece if the state has actually changed (so it can emit a store stream event).

There could be a way to avoid this by editing the _redux-observable_ source itself, but that would mean forgoing all the automatic bug fixes, testing and updates _redux-observable_ already receives.
