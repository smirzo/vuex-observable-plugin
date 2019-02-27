"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ofType", {
  enumerable: true,
  get: function get() {
    return _reduxObservable.ofType;
  }
});
exports.VuexObservable = void 0;

var _reduxObservable = require("redux-observable");

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _clone = _interopRequireDefault(require("clone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var VuexObservable = function VuexObservable() {
  var epics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var epicMiddleware = (0, _reduxObservable.createEpicMiddleware)(options);

  var rootEpic = _reduxObservable.combineEpics.apply(void 0, _toConsumableArray(epics));

  return function (store) {
    var storeModel = {
      getState: function getState() {
        if (!(0, _fastDeepEqual.default)(this.stateCopy, {
          state: store.state,
          getters: store.getters
        })) {
          this.stateCopy = (0, _clone.default)({
            state: store.state,
            getters: store.getters
          });
        }

        return this.stateCopy;
      },
      dispatch: function dispatch(_ref) {
        var type = _ref.type,
            payload = _ref.payload,
            action = _ref.action;

        if (action === true) {
          store.dispatch(type, payload);
        } else {
          store.commit(type, payload);
        }
      },
      stateCopy: (0, _clone.default)({
        state: store.state,
        getters: store.getters
      })
    };

    var next = function next(action) {
      return action;
    };

    store.__dispatchEpic = epicMiddleware(storeModel)(next);
    store.subscribe(function (mutation) {
      return store.__dispatchEpic({
        type: '__STATE_CHANGED__'
      });
    });
    epicMiddleware.run(rootEpic);
    store._actions = new Proxy(store._actions, {
      get: function get(actions, type) {
        return actions[type] || [function (payload) {
          return Promise.resolve(store.__dispatchEpic({
            type: type,
            payload: payload
          }));
        }];
      }
    });
  };
};

exports.VuexObservable = VuexObservable;