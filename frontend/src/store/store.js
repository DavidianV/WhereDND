import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session'
import spotsReducer from './spots';
import imagesReducer from './images'

const rootReducer = combineReducers({
  // ADD REDUCERS HERE
  session: sessionReducer,
  spots: spotsReducer,
  images: imagesReducer
});

let enhancer;
if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  const store = createStore(rootReducer, preloadedState, enhancer);

  window.store = store
  
  return store
};

export default configureStore;