import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';
import App from './App';

import store from './store'
import Remix from './lib/remix'
import actions from './actions'
import DataSchema from './lib/schema';

Remix.init({
    appStore: store,
    externalActions: [{
        comment: 'Use in to set correct option in quiz. Simpy dispatch this action and code in reducer will do operations.',
        type: actions.SET_CORRECT_OPTION,
        paramSchema: new DataSchema({
            "questionIndex": {
                type: "number",
                default: 0,
                min: 0
            },
            "optionIndex": {
                type: "number",
                default: 0,
                min: 0
            }
        })
    }],
    container: document.getElementById('root')
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
