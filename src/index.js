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

    // remix.serizlise2(), deserialize2 does not work
    var s = '{"router":{"screens":{"_orderedIds":["zm100s","ju3ahw"],"zm100s":{"backgroundColor":"#ff9999","components":{"_orderedIds":["tm33ye","2djvts"],"tm33ye":{"color":"blue","tags":"question title","displayName":"Text"},"2djvts":{"color":"red","tags":"option","displayName":"Text"}}},"ju3ahw":{"backgroundColor":"#99ff99","components":{"_orderedIds":[]}}},"currentScreenId":"zm100s"},"app":{"size":{"width":400,"height":400}}}';

    // remix.serialize, deserialiize works
    var s2 = '[{"path":"router.screens","value":{"_orderedIds":["jmfgu2","84upba"],"jmfgu2":{"backgroundColor":"#ff9999","tags":"screen question1","components":{"_orderedIds":["ywmqwp","mgl6sf"],"ywmqwp":{"displayName":"Text","color":"blue","tags":"question title"},"mgl6sf":{"displayName":"Text","color":"red","tags":"option"}}},"84upba":{"backgroundColor":"#99ff99","tags":"screen question2","components":{"_orderedIds":[]}}}},{"path":"router.currentScreenId","value":"jmfgu2"},{"path":"app.size.width","value":400},{"path":"app.size.height","value":400},{"path":"router.screens.jmfgu2.backgroundColor","value":"#ff9999"},{"path":"router.screens.84upba.backgroundColor","value":"#99ff99"},{"path":"router.screens.jmfgu2.components","value":{"_orderedIds":["ywmqwp","mgl6sf"],"ywmqwp":{"displayName":"Text","color":"blue","tags":"question title"},"mgl6sf":{"displayName":"Text","color":"red","tags":"option"}}},{"path":"router.screens.84upba.components","value":{"_orderedIds":[]}},{"path":"router.screens.jmfgu2.components.ywmqwp.color","value":"blue"},{"path":"router.screens.jmfgu2.components.mgl6sf.color","value":"red"}]';

    //TODO how to get added screenId ?
    // remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#ff9999', tags: 'screen question1'} });
    // remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#99ff99', tags: 'screen question2'} });

    // var screenId = store.getState().router.screens.getId(0);
    // var screenId2 = store.getState().router.screens.getId(1);
    // Remix.setCurrentScreen(screenId);

    // remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'Text', color: 'blue', tags: 'question title'} });

    // remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'Text', color: 'red', tags: 'option'} });
    // //store.getState().router.screens[screenId].components

    // Remix.addTrigger({
    //     when: { eventType: 'onclick', condition: {prop: 'tags', clause: 'CONTAINS', value: 'option'} },
    //     execute: (t) => {
    //         console.log('option clicked');
    //         //TODO destinated screen id from option 'data' attr.
    //         Remix.setCurrentScreen(screenId2);
    //     }
    // });



    //when-then, make thenable triggers

    //serialization

    //calc result points

    //linear showing of question screens

    //quickly can add a new screen

    //can add a new option

    //start screen
    // -- prepare layout?
    // logo link
    // sharing buttons

    //result screens

    //client reducer? Is there any CLIENT CODE?
    // - randomize questions?
    // - show question progress
    // - show feedback layer

    //Plugins: remix-quiz, remix-timeline, ... But basic remix app includes common classes
    //

    //Modal
    // - feedback modal
    // - router can show some screens in modal mode on the top of other screens

    //Macros
    // goToNextScreenOfTag('option_screen')
    // setForAllComponentsWithTagInAllScreens(prop: value)
    //
}

setTimeout( test, 1000);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
