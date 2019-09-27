import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';
import App from './App';

import store from './store'
import Remix from './lib/remix'
import initRemixRouting from './lib/plugins/remix-routing'

Remix.init({
    appStore: store,
    container: document.getElementById('root')
});

//TODO move to standart remix trigger actions
Remix.registerTriggerAction('console_log', (event) => {
    console.log(event.eventData[event.trigger.then.data]);
});

// Remix.registerTriggerAction('set_active_screen', (event) => {
//     let screenId = null;
//     if (event.eventData.data) {
//         if (event.eventData.data.screenId) {
//             screenId = event.eventData.data.screenId;
//         }
//         else if (typeof event.eventData.data === 'string') {
//             try {
//                 screenId = JSON.parse(event.eventData.data).screenId
//             }
//             catch(err) {}
//         }
//     }
//     if (screenId) {
//         Remix.setCurrentScreen(screenId);
//     }
//     else {
//         console.warn('Action "set_active_screen" says:"data.screenId" must be set in component');
//     }
// });



initRemixRouting({
    remix: Remix,
    // some params specially for Remix-Routing plugin
    screenRoute: [
        {tag: 'start'}, // show all scrrens with tag in linear order
        {tag: 'question', shuffle: true}, // show all scrrens with tag and shuffle them
        {idByFunction: 'calcTriviaRes'} // show one screenId returned by function 'calcTriviaRes'
    ],
    rebuildRouteTag: 'restart',
    nextTag: 'option'
});

/**
 * Trivia quiz custom result calculation
 *
 */
Remix.addCustomFunction('calcTriviaRes', () => {
    //TODO
    //return 'result';
    const state = Remix.getState();
    return state.router.screens.getId(2)
});

// TODO show start screen: true/false - component disabling

function test( ) {

    Remix.setData({
        'app.size.width': 800,
        'app.size.height': 600
    });

    // Remix.serizlise2(), deserialize2 does not work
    var s = '{"events":{"triggers":{"_orderedIds":["51c1r4"],"51c1r4":{"when":{"eventType":"onclick","condition":{"prop":"tags","clause":"CONTAINS","value":"option"}},"then":{"actionType":"console_log","data":"tags"}}}},"router":{"screens":{"_orderedIds":["vwo8k6","qxvle4"],"vwo8k6":{"backgroundColor":"#ff9999","components":{"_orderedIds":["w5qics","jxkpsp"],"w5qics":{"color":"blue","tags":"question title","displayName":"Text"},"jxkpsp":{"color":"red","tags":"option","displayName":"Text"}}},"qxvle4":{"backgroundColor":"#99ff99","components":{"_orderedIds":[]}}},"currentScreenId":"vwo8k6"},"app":{"size":{"width":400,"height":400}}}';

    // Remix.serialize, deserialiize works
    var s2 = '[{"path":"router.screens","value":{"_orderedIds":["jmfgu2","84upba"],"jmfgu2":{"backgroundColor":"#ff9999","tags":"screen question1","components":{"_orderedIds":["ywmqwp","mgl6sf"],"ywmqwp":{"displayName":"Text","color":"blue","tags":"question title"},"mgl6sf":{"displayName":"Text","color":"red","tags":"option"}}},"84upba":{"backgroundColor":"#99ff99","tags":"screen question2","components":{"_orderedIds":[]}}}},{"path":"router.currentScreenId","value":"jmfgu2"},{"path":"app.size.width","value":400},{"path":"app.size.height","value":400},{"path":"router.screens.jmfgu2.backgroundColor","value":"#ff9999"},{"path":"router.screens.84upba.backgroundColor","value":"#99ff99"},{"path":"router.screens.jmfgu2.components","value":{"_orderedIds":["ywmqwp","mgl6sf"],"ywmqwp":{"displayName":"Text","color":"blue","tags":"question title"},"mgl6sf":{"displayName":"Text","color":"red","tags":"option"}}},{"path":"router.screens.84upba.components","value":{"_orderedIds":[]}},{"path":"router.screens.jmfgu2.components.ywmqwp.color","value":"blue"},{"path":"router.screens.jmfgu2.components.mgl6sf.color","value":"red"}]';

    // screens
    Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#292C30', tags: 'screen question question1'} });
    Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#3d6b37', tags: 'screen question question2'} });
    Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#456fab', tags: 'screen result result1'} });
    var screenId = store.getState().router.screens.getId(0);
    var screenId2 = store.getState().router.screens.getId(1);
    var screenId3 = store.getState().router.screens.getId(2);
    Remix.setCurrentScreen(screenId);

    Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: 18, text: '«Приятно слышать, что вы так вежливо обращаетесь с котом. Котам обычно почему-то говорят "ты", хотя ни один кот никогда ни с кем не пил брудершафта»'} });
    Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"0", "screenId": screenId2}, width: 60, left: 20, top: 250, text: 'Это «Каникулы в Простоквашино» Успенского'} });
    Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"1", "screenId": screenId3}, width: 60, left: 20, top: 330, text: 'Это Булгаков. «Мастер и Маргарита»'} });
    //Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'ProgressiveImage', src: '', width: 50, left: 25, top: 90} });

    Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: 50, text: 'Это был неверный ответ, пожалуйста попробуйте заново.'} });
    Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"0", "screenId": screenId}, width: 60, left: 20, top: 250, text: 'Попробовать еще раз'} });
    Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"0"}, width: 60, left: 20, top: 350, text: 'Не знаю что делать...'} });

    Remix.addHashlistElement('router.screens.'+screenId3+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: -51, text: 'Верный ответ! «Ма́стер и Маргари́та» — роман Михаила Афанасьевича Булгакова, работа над которым началась в конце 1920-х годов и продолжалась вплоть до смерти писателя'} });

    //change component text color for test
    /*
    var screenId = store.getState().router.screens.getId(0);
    var componentId = store.getState().router.screens[screenId].components.getId(0);
    Remix.setData({['router.screens.'+screenId+'.components.'+componentId+'.color']: 'yellow'});
    */
    // Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'Text', color: 'red', tags: 'option'} });

    Remix.addTrigger({
        when: { eventType: 'onclick', condition: {prop: 'tags', clause: 'CONTAINS', value: 'option'} },
        then: { actionType: 'console_log', data: 'tags'}
    });

    // Plan ******* */
    // 1. Доделать триггеры до подсчета результата и показа экрана результата
    // - автотесты вернуть
    // - опции нужно время чтобы показать состояние/анимацию - верно или неверно а уже потом делать переход
    // 2. Сериалиция/десер этого всего
    // -- что будет представлять собой проект Тривия, есть финальное понимание?
    // -- индикатор вопросов и рандомизация вопросов?
    // -- линейная Тривия простая как?
    // -- попробовать открыть микроредактор
    // 3. Вернуться к лейауту
    //******* */


    //TODO layout. Определение размера контента при старте неверное для текста и опций. Этим и заняться.

    //TODO serialize-deserialize it. Add standatrt schema attributes

    //TODO link to result screen?
    // - calcRes before show screen
    // - or calcRes includes result screen id

    //TODO linear simple logic. How?


    //when-then, make thenable triggers ?

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
    //Remix.fireEvent('app_start');
}

setTimeout(test, 100);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
