import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';
import App from './App';

import store from './store'
import Remix from './lib/remix'
import {actions, init} from './actions'
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
                min: 0,
                max: 1
            },
            "optionIndex": {
                type: "number",
                default: 0,
                min: 0,
                max: 1
            }
        })
    }],
    container: document.getElementById('root')
});

//store.dispatch(init(store.getState().quiz.questions));

function test( ) {
    //TODO how to get added screenId ?
    remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#ff9999', tags: 'screen question1'} });
    remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#99ff99', tags: 'screen question2'} });

    var screenId = store.getState().router.screens.getId(0);
    var screenId2 = store.getState().router.screens.getId(1);
    Remix.setCurrentScreen(screenId);

    remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'Text', color: 'blue', tags: 'question title'} });

    remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'Text', color: 'red', tags: 'option'} });
    //store.getState().router.screens[screenId].components

    Remix.addTrigger({
        when: { eventType: 'onclick', condition: {prop: 'tags', clause: 'CONTAINS', value: 'option'} },
        execute: (t) => {
            console.log('option clicked');
            //TODO destinated screen id from option 'data' attr.
            Remix.setCurrentScreen(screenId2);
        }
    });
}

setTimeout( test, 1000);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
