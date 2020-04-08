import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducer'
import eventSaga from './lib/remix/sagas/triggerExecutor'
import diffMiddleware from './lib/remix/middleware/diff.js'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware, diffMiddleware))

sagaMiddleware.run(eventSaga)

window.store = store // for debug: inspect storage state in browser console

export default store

/**
 * Simple middleware example
 *
 * @param {*} store
 */
function logger(store) {
  return function (next) {
    return function (action) {
      console.log('dispatching', action)
      let result = next(action)
      console.log('next state', store.getState())
      return result
    }
  }
}
