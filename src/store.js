import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'

const store = createStore(
    reducer,
    applyMiddleware(logger)
);

window.store = store; // for debug: inspect storage state in browser console

export default store

function logger(store) {
    return function(next) {

        return function (action) {
            console.log('dispatching', action)
            let result = next(action)
            console.log('next state', store.getState())
            return result
        }

    }
}