import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(
    reducer
);

window.store = store; // for debug: inspect storage state in browser console

export default store
