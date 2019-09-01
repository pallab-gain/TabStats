import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reduxActionsLogger from './logger';
import rootReducer from './reducers';

const middlewares = [thunk, reduxActionsLogger];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const AppStore = createStore(rootReducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(...middlewares)
));

export default AppStore;
