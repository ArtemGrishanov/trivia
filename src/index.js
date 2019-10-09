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
    restartTag: 'restart',
    nextTag: 'option'
});

/**
 * Trivia quiz custom result calculation
 *
 */
Remix.addCustomFunction('calcTriviaRes', () => {
    const state = Remix.getState(),
        questionsCount = state.router.screens.toArray().filter( (scr) => scr.tags.indexOf('question') >= 0).length,
        results = state.router.screens.toArray().filter( (scr) => scr.tags.indexOf('result') >= 0);
    let resultPointsAllocation = {},
        q = 0,
        points = 0,
        maxPoints = questionsCount;
    // посчитаем количество набранных баллов, посмотрим историю событий "клик по опциям" с конца (начиная с самых новых)
    for (var i = state.session.events.length-1; i >= 0; i--) {
        const evt = state.session.events[i];
        if (evt.eventType === 'onclick' && evt.eventData.tags.indexOf('option') > 0) {
            q++;
            points += parseInt(evt.eventData.data.points);
        }
        if (q >= questionsCount) {
            // достаточно: мы нашли количество кликов по опциям равное количеству вопросов
            // их может быть больше - но это уже прежние прохождения с рамкам одной сессии пользователя
            break;
        }
    }
    // подсчитаем распределение ответов, то есть таблицу соотношения <количество баллов> = <ид результата>
    // для любого возможного количества баллов
    let resGap = Math.floor(questionsCount / results.length), // длина промежутка на шкале распределения, которая приходится на один результат
        g = 1,
        resIndex = results.length-1; // начинаем распределять с конца
    if (resGap < 1) {
        resGap = 1;
    }
    if (resIndex >= 0) {
        let currentResultId = results[resIndex].hashlistId;
        for (let i = maxPoints; i >= 0; i--) { // >= важно!
            resultPointsAllocation[i] = currentResultId;
            g++;
            if (g > resGap) {
                g = 1;
                if (resIndex) {
                    resIndex--;
                    currentResultId = results[resIndex].hashlistId;
                }
            }
        }
    }
    return resultPointsAllocation[points];
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
    Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#450f00', tags: 'screen result result2'} });

    var screenId = store.getState().router.screens.getId(0);
    var screenId2 = store.getState().router.screens.getId(1);

    var result1sid = store.getState().router.screens.getId(2);
    var result2sid = store.getState().router.screens.getId(3);

    Remix.setCurrentScreen(screenId);

    Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: 18, text: '«Приятно слышать, что вы так вежливо обращаетесь с котом. Котам обычно почему-то говорят "ты", хотя ни один кот никогда ни с кем не пил брудершафта»'} });
    Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"0", "screenId": screenId2}, width: 60, left: 20, top: 250, text: 'Это «Каникулы в Простоквашино» Успенского'} });
    Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"1", "screenId": result1sid}, width: 60, left: 20, top: 330, text: 'Это Булгаков. «Мастер и Маргарита»'} });
    //Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'ProgressiveImage', src: '', width: 50, left: 25, top: 90} });

    Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: 50, text: 'Придумай текст вопроса'} });
    Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"1", "screenId": screenId}, width: 60, left: 20, top: 250, text: 'Верный ответ'} });
    Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"0"}, width: 60, left: 20, top: 350, text: 'Неверный'} });

    Remix.addHashlistElement('router.screens.'+result1sid+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: -51, text: 'Неплохо, но можно и лучше'} });
    Remix.addHashlistElement('router.screens.'+result1sid+'.components', undefined, { newElement: {displayName: 'Button', tags: 'restart', text: 'Начать заново'} });

    Remix.addHashlistElement('router.screens.'+result2sid+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: -51, text: 'Отлично, вы знаток литературы'} });
    Remix.addHashlistElement('router.screens.'+result2sid+'.components', undefined, { newElement: {displayName: 'Button', tags: 'restart', text: 'Начать заново'} });

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
