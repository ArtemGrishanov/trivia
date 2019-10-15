import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';
import App from './App';

import store from './store'
import Remix from './lib/remix'
import initRemixRouting from './lib/plugins/remix-routing'
import initScreenProgress from './lib/plugins/screen-progress'
import initQuizPoints from './lib/plugins/quiz-points'

Remix.init({
    appStore: store,
    container: document.getElementById('root'),
    mode: 'edit' // edit | none
});

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

initScreenProgress({
    remix: Remix,
    screenTag: 'question'
});

initQuizPoints({
    remix: Remix,
    pointElementTag: 'option'
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

    Remix.deserialize2('{"router":{"screens":{"_orderedIds":["9j4e8n","uxv9i5","0m296z","c2ybjz"],"9j4e8n":{"backgroundColor":"#292C30","components":{"_orderedIds":["3qgavn","gv9ve8","hpbrnz","giabx3"],"3qgavn":{"step":1,"max":2,"fontSize":14,"color":"#fff","id":"screen-progress:progressComponentId","tags":"remixcomponent","displayName":"Progress","width":30,"height":30,"left":20,"top":20,"data":{"nextScreenId":"","points":""}},"gv9ve8":{"text":"«Приятно слышать, что вы так вежливо обращаетесь с котом. Котам обычно почему-то говорят \\"ты\\", хотя ни один кот никогда ни с кем не пил брудершафта»","fontSize":24,"color":"#C7A667","backgroundColor":"","padding":0,"fontShadow":false,"fontShadowColor":"rgba(0,0,0,0.2)","fontShadowDistance":3,"bold":false,"animationOnAppearance":"none","id":"none","tags":"question title","displayName":"Text","width":60,"height":30,"left":20,"top":18,"data":{"nextScreenId":"","points":""}},"hpbrnz":{"text":"Это «Каникулы в Простоквашино» Успенского","correctIndicator":"none","percent":0,"textAlign":"left","borderRadius":4,"id":"none","tags":"question option","displayName":"TextOption","width":60,"height":30,"left":20,"top":250,"data":{"nextScreenId":"","points":"0"}},"giabx3":{"text":"Это Булгаков. «Мастер и Маргарита»","correctIndicator":"none","percent":0,"textAlign":"left","borderRadius":4,"id":"none","tags":"question option","displayName":"TextOption","width":60,"height":30,"left":20,"top":330,"data":{"nextScreenId":"","points":"1"}}},"tags":"screen question question1","data":{"nextScreenId":"uxv9i5"}},"uxv9i5":{"backgroundColor":"#3d6b37","components":{"_orderedIds":["38bv66","tvsnc5","r4reta","z6dciw"],"38bv66":{"step":2,"max":2,"fontSize":14,"color":"#fff","id":"screen-progress:progressComponentId","tags":"remixcomponent","displayName":"Progress","width":30,"height":30,"left":20,"top":20,"data":{"nextScreenId":"","points":""}},"tvsnc5":{"text":"Придумай текст вопроса","fontSize":24,"color":"#C7A667","backgroundColor":"","padding":0,"fontShadow":false,"fontShadowColor":"rgba(0,0,0,0.2)","fontShadowDistance":3,"bold":false,"animationOnAppearance":"none","id":"none","tags":"question title","displayName":"Text","width":60,"height":30,"left":20,"top":50,"data":{"nextScreenId":"","points":""}},"r4reta":{"text":"Верный ответ","correctIndicator":"none","percent":0,"textAlign":"left","borderRadius":4,"id":"none","tags":"question option","displayName":"TextOption","width":60,"height":30,"left":20,"top":250,"data":{"nextScreenId":"","points":"1"}},"z6dciw":{"text":"Неверный","correctIndicator":"none","percent":0,"textAlign":"left","borderRadius":4,"id":"none","tags":"question option","displayName":"TextOption","width":60,"height":30,"left":20,"top":350,"data":{"nextScreenId":"","points":"0"}}},"tags":"screen question question2","data":{"nextScreenId":"idByFunction:calcTriviaRes"}},"0m296z":{"backgroundColor":"#456fab","components":{"_orderedIds":["309q47","ffk2vx"],"309q47":{"text":"Неплохо, но можно и лучше","fontSize":24,"color":"#C7A667","backgroundColor":"","padding":0,"fontShadow":false,"fontShadowColor":"rgba(0,0,0,0.2)","fontShadowDistance":3,"bold":false,"animationOnAppearance":"none","id":"none","tags":"question title","displayName":"Text","width":60,"height":30,"left":20,"top":-51,"data":{"nextScreenId":"","points":""}},"ffk2vx":{"text":"Начать заново","sizeMod":"normal","colorMod":"blue","id":"none","tags":"restart","displayName":"Button","width":30,"height":30,"left":11,"top":11,"data":{"nextScreenId":"","points":""}}},"tags":"screen result result1","data":{"nextScreenId":""}},"c2ybjz":{"backgroundColor":"#450f00","components":{"_orderedIds":["si87br","nef5v4"],"si87br":{"text":"Отлично, вы знаток литературы","fontSize":24,"color":"#C7A667","backgroundColor":"","padding":0,"fontShadow":false,"fontShadowColor":"rgba(0,0,0,0.2)","fontShadowDistance":3,"bold":false,"animationOnAppearance":"none","id":"none","tags":"question title","displayName":"Text","width":60,"height":30,"left":20,"top":-51,"data":{"nextScreenId":"","points":""}},"nef5v4":{"text":"Начать заново","sizeMod":"normal","colorMod":"blue","id":"none","tags":"restart","displayName":"Button","width":30,"height":30,"left":11,"top":11,"data":{"nextScreenId":"","points":""}}},"tags":"screen result result2","data":{"nextScreenId":""}}},"currentScreenId":"9j4e8n","displayMode":"oneScreen","backgroundColor":"","switchEffect":"none","routingMode":"linear"},"app":{"size":{"width":800,"height":600},"quiz":{"showQuestionProgress":true}}}');

    // PROGRAMMALICALLY CREATR PROJECT
    // Remix.setData({
    //     'app.size.width': 800,
    //     'app.size.height': 600
    // });

    // Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#292C30', tags: 'screen question question1'} });
    // Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#3d6b37', tags: 'screen question question2'} });
    // Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#456fab', tags: 'screen result result1'} });
    // Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#450f00', tags: 'screen result result2'} });

    // var screenId = store.getState().router.screens.getId(0);
    // var screenId2 = store.getState().router.screens.getId(1);

    // var result1sid = store.getState().router.screens.getId(2);
    // var result2sid = store.getState().router.screens.getId(3);

    // Remix.setCurrentScreen(screenId);

    // Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: 18, text: '«Приятно слышать, что вы так вежливо обращаетесь с котом. Котам обычно почему-то говорят "ты", хотя ни один кот никогда ни с кем не пил брудершафта»'} });
    // Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"0", "screenId": screenId2}, width: 60, left: 20, top: 250, text: 'Это «Каникулы в Простоквашино» Успенского'} });
    // Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"1", "screenId": result1sid}, width: 60, left: 20, top: 330, text: 'Это Булгаков. «Мастер и Маргарита»'} });
    // //Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'ProgressiveImage', src: '', width: 50, left: 25, top: 90} });

    // Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: 50, text: 'Придумай текст вопроса'} });
    // Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"1", "screenId": screenId}, width: 60, left: 20, top: 250, text: 'Верный ответ'} });
    // Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"0"}, width: 60, left: 20, top: 350, text: 'Неверный'} });

    // Remix.addHashlistElement('router.screens.'+result1sid+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: -51, text: 'Неплохо, но можно и лучше'} });
    // Remix.addHashlistElement('router.screens.'+result1sid+'.components', undefined, { newElement: {displayName: 'Button', tags: 'restart', text: 'Начать заново'} });

    // Remix.addHashlistElement('router.screens.'+result2sid+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: -51, text: 'Отлично, вы знаток литературы'} });
    // Remix.addHashlistElement('router.screens.'+result2sid+'.components', undefined, { newElement: {displayName: 'Button', tags: 'restart', text: 'Начать заново'} });
    // PROGRAMMALICALLY CREATR PROJECT


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

    //can add a new option

    //start screen
    // -- prepare layout?
    // logo link
    // sharing buttons

    //client reducer? Is there any CLIENT CODE?
    // - show feedback layer

    //Plugins: remix-quiz, remix-timeline, ... But basic remix app includes common classes
    //

    //Modal
    // - feedback modal
    // - router can show some screens in modal mode on the top of other screens
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

setTimeout(test, 0);