import reduceReducers from './reduce-reducers/index';
import isPlainObject from './utils/isPlainObject';
import isMap from './utils/isMap';
import ownKeys from './utils/ownKeys';
import flattenReducerMap from './utils/flattenReducerMap';
import handleAction from './handleAction';
import get from './utils/get';

export default function handleActions(handlers, defaultState, options = {}) {
  const flattenedReducerMap = flattenReducerMap(handlers, options);
  const reducers = ownKeys(flattenedReducerMap).map(type =>
    handleAction(type, get(type, flattenedReducerMap), defaultState)
  );
  const reducer = reduceReducers(...reducers, defaultState);
  return (state = defaultState, action) => reducer(state, action);
}
