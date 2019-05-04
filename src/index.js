import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';
import App from './App';

import store from './store'
import Remix from './lib/remix'
import schema from './appStoreDataSchema'

Remix.init({
    appStore: store,
    dataSchema: schema,
    container: document.getElementById('root')
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));