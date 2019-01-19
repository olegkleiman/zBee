// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import { taskMiddleware } from 'react-palm';
import reducers from './reducers/reducers';

// export const middlewares = [
//   taskMiddleware
// ];
//
// export const enhancers = [applyMiddleware(...middlewares)];

const initialState = {};
// add redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(reducers,
  initialState,
  // composeEnhancers(...enhancers)
);

export default store;
