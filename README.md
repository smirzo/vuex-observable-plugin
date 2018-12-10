# Vuex Observable

![vuex-observable-image](./assets/vuex-observable-image.png)

A plugin that adapts the popular [redux-observable](https://redux-observable.js.org/) middleware to Vuex.

[![CircleCI](https://circleci.com/gh/smirzo/vuex-observable-plugin.svg?style=svg)](https://circleci.com/gh/smirzo/vuex-observable-plugin)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

_Please note that this plugin has not yet been battle tested in a production setting and should therefore be used with caution in a mission-critical environment._

## Installation

`npm i vuex-observable-plugin`

## Peer dependencies

`npm i rxjs@6.x.x`

_Your project should contain rxjs (version 6 or above) as redux-observable requires it as a peer dependency._

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

#### Epic's Outputs

By default, the epics receive an _action_ as input and return a _mutation_ as output. It is also possible to return an _action_ as output by simply specifying a third `action` parameter in the returned object. For example:

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

#### Store stream

The second argument passed to the epic is not only an observable of the `state$` but the `store$`, which contains both the _state_ and _getters_. For instance:

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

#### Dispatching actions vs epics

A dispatched action is either passed to an action or an epic, but never to both at the same time.<br/><br/>Whenever an action with the dispatched type is available, it will be passed to the standard Vuex action handler with the matching type name and it will not reach the epics. However, when an action with the dispacthed type has not been registered, it will be passed on to be handled by the root epic. <br/><br/>This is because both actions and epics are usually asynchronous and running them both in parallel would most often result in race conditions and unpredictable behaviour.

## Important performance relates notes

When the state gets very large (thousands of object) or if state mutations happen extremely often, then the store might start suffering in performance. This is due to the state mutability differences between _Vuex_ and _Redux_ (Vuex's state is mutable while Redux's is not).

The plugin must therefore check if the state has actually changed on every dispatched epic in order to conform to the _redux-observable_ api, which will expect a new object reference if the state has actually changed (so it can emit a store stream event).

There could be ways to avoid this by editing the _redux-observable_ source itself, but that would mean forgoing all the automatic bug fixes, testing and updates _redux-observable_ already receives.

That being said, in most common use cases this would not manifest as an issue.

## Contributing

Any help with contributing, finding solutions or in general improving the library would be very welcome.

## License

The MIT License (MIT)

Copyright (c) 2018 smirzo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
