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
import initCoverScreen from './lib/plugins/cover-screen'

Remix.setStore(store);

initCoverScreen({
    remix: Remix,
    screenTag: 'start', // must match routing {tag: 'start'} first param
    startBtnTag: 'option' // must match initRemixRouting nextTag param, as this is one routing
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
    tag: 'option'
});

/**
 * Trivia quiz custom result calculation
 *
 */
Remix.addCustomFunction('calcTriviaRes', () => {
    const state = Remix.getState(),
        questionsCount = Remix.getScreens({tag: 'question'}).length,
        results = Remix.getScreens({tag: 'result'});
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

    //Remix.deserialize2('{"router":{"screens":{"_orderedIds":["z6z9sh","8wruuz","nch4zc","f5n509"],"z6z9sh":{"backgroundColor":"#000","components":{"_orderedIds":["b7nyif","emeh5f","fkrwjx","pkbeyp"],"b7nyif":{"step":1,"max":2,"fontSize":20,"color":"#aaa","id":"screen-progress:progressComponentId","tags":"remixcomponent","displayName":"Progress","width":30,"height":30,"left":48,"top":30,"data":{"nextScreenId":"","points":""}},"emeh5f":{"text":"Айтишники просят использовать пароли типа gH74eW11!m, а сотрудники постоянно их забывают. Все друг на друга злятся, работа стоит. Как быть?","fontSize":24,"color":"#C7A667","backgroundColor":"","padding":0,"fontShadow":false,"fontShadowColor":"rgba(0,0,0,0.2)","fontShadowDistance":3,"bold":false,"animationOnAppearance":"none","id":"none","tags":"question title","displayName":"Text","width":70,"height":30,"left":15,"top":120,"data":{"nextScreenId":"","points":""}},"fkrwjx":{"text":"Я использую пароль qwerty123 для всех сервисов. Он достаточно сложен","correctIndicator":"none","percent":0,"textAlign":"left","borderRadius":4,"id":"none","tags":"question option","displayName":"TextOption","width":70,"height":30,"left":15,"top":250,"data":{"nextScreenId":"","points":"0"}},"pkbeyp":{"text":"Есть же менеджеры паролей. Эти программы автоматически создают и хранят сложные для взлома ключи","correctIndicator":"none","percent":0,"textAlign":"left","borderRadius":4,"id":"none","tags":"question option","displayName":"TextOption","width":70,"height":30,"left":15,"top":350,"data":{"nextScreenId":"","points":"1"}}},"tags":"screen question question1","data":{"nextScreenId":"8wruuz"}},"8wruuz":{"backgroundColor":"#000","components":{"_orderedIds":["0nej9q","zbnkhy","sp2hjp","7l5bp4"],"0nej9q":{"step":2,"max":2,"fontSize":20,"color":"#aaa","id":"screen-progress:progressComponentId","tags":"remixcomponent","displayName":"Progress","width":30,"height":30,"left":48,"top":30,"data":{"nextScreenId":"","points":""}},"zbnkhy":{"text":"Пароль пользователя должен:","fontSize":24,"color":"#C7A667","backgroundColor":"","padding":0,"fontShadow":false,"fontShadowColor":"rgba(0,0,0,0.2)","fontShadowDistance":3,"bold":false,"animationOnAppearance":"none","id":"none","tags":"question title","displayName":"Text","width":50,"height":30,"left":27,"top":120,"data":{"nextScreenId":"","points":""}},"sp2hjp":{"text":"Содержать цифры и буквы, знаки препинания и быть сложным для угадывания","correctIndicator":"none","percent":0,"textAlign":"left","borderRadius":4,"id":"none","tags":"question option","displayName":"TextOption","width":70,"height":30,"left":15,"top":250,"data":{"nextScreenId":"","points":"1"}},"7l5bp4":{"text":"Быть простым и легко запоминаться, например «123», «111», «qwerty» и т.д.","correctIndicator":"none","percent":0,"textAlign":"left","borderRadius":4,"id":"none","tags":"question option","displayName":"TextOption","width":70,"height":30,"left":15,"top":350,"data":{"nextScreenId":"","points":"0"}}},"tags":"screen question question2","data":{"nextScreenId":"idByFunction:calcTriviaRes"}},"nch4zc":{"backgroundColor":"#6e1717","components":{"_orderedIds":["tqsfr9","py6c0w","qtrvbq"],"tqsfr9":{"text":"Ваши данные под угрозой. Вам срочно следует улучшить ваши знания в области ИТ-безопасности","fontSize":24,"color":"#C7A667","backgroundColor":"","padding":0,"fontShadow":false,"fontShadowColor":"rgba(0,0,0,0.2)","fontShadowDistance":3,"bold":false,"animationOnAppearance":"none","id":"none","tags":"question title","displayName":"Text","width":60,"height":30,"left":20,"top":100,"data":{"nextScreenId":"","points":""}},"py6c0w":{"text":"Начать заново","sizeMod":"normal","colorMod":"blue","id":"none","tags":"restart","displayName":"Button","width":30,"height":30,"left":40,"top":250,"data":{"nextScreenId":"","points":""}},"qtrvbq":{"shareText":"Share","sizeMod":"normal","id":"none","tags":"remixcomponent","displayName":"FbButton","width":30,"height":30,"left":38,"top":350,"data":{"nextScreenId":"","points":""}}},"tags":"screen result result1","data":{"nextScreenId":""}},"f5n509":{"backgroundColor":"#1f5418","components":{"_orderedIds":["bxeyfi","rtfms8","pq94on"],"bxeyfi":{"text":"Отлично, вы в безопасности. Ваши знания по ИТ-безопасности помогут вам избежать угроз","fontSize":24,"color":"#C7A667","backgroundColor":"","padding":0,"fontShadow":false,"fontShadowColor":"rgba(0,0,0,0.2)","fontShadowDistance":3,"bold":false,"animationOnAppearance":"none","id":"none","tags":"question title","displayName":"Text","width":60,"height":30,"left":20,"top":100,"data":{"nextScreenId":"","points":""}},"rtfms8":{"text":"Начать заново","sizeMod":"normal","colorMod":"blue","id":"none","tags":"restart","displayName":"Button","width":30,"height":30,"left":40,"top":250,"data":{"nextScreenId":"","points":""}},"pq94on":{"shareText":"Share","sizeMod":"normal","id":"none","tags":"remixcomponent","displayName":"FbButton","width":30,"height":30,"left":38,"top":350,"data":{"nextScreenId":"","points":""}}},"tags":"screen result result2","data":{"nextScreenId":""}}},"currentScreenId":"z6z9sh","displayMode":"oneScreen","backgroundColor":"","switchEffect":"none","routingMode":"linear"},"app":{"size":{"width":800,"height":600},"quiz":{"showQuestionProgress":true}}}');
    // PROGRAMMALICALLY CREATE PROJECT
    // Remix.setData({
    //     'app.size.width': 800,
    //     'app.size.height': 600
    // });

    // Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#000', tags: 'screen question question1'} });
    // Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#000', tags: 'screen question question2'} });
    // Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#6e1717', tags: 'screen result result1'} });
    // Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#1f5418', tags: 'screen result result2'} });

    // var screenId = store.getState().router.screens.getId(0);
    // var screenId2 = store.getState().router.screens.getId(1);

    // var result1sid = store.getState().router.screens.getId(2);
    // var result2sid = store.getState().router.screens.getId(3);

    // Remix.setCurrentScreen(screenId);

    // Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 70, left: 15, top: 120, text: 'Айтишники просят использовать пароли типа gH74eW11!m, а сотрудники постоянно их забывают. Все друг на друга злятся, работа стоит. Как быть?'} });
    // Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"0", "screenId": screenId2}, width: 70, left: 15, top: 250, text: 'Я использую пароль qwerty123 для всех сервисов. Он достаточно сложен'} });
    // Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"1", "screenId": result1sid}, width: 70, left: 15, top: 350, text: 'Есть же менеджеры паролей. Эти программы автоматически создают и хранят сложные для взлома ключи'} });
    // //Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'ProgressiveImage', src: '', width: 50, left: 25, top: 90} });

    // Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 50, left: 27, top: 120, text: 'Пароль пользователя должен:'} });
    // Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"1", "screenId": screenId}, width: 70, left: 15, top: 250, text: 'Содержать цифры и буквы, знаки препинания и быть сложным для угадывания'} });
    // Remix.addHashlistElement('router.screens.'+screenId2+'.components', undefined, { newElement: {displayName: 'TextOption', fontSize: 18, color: '#fff', tags: 'question option', data: {"points":"0"}, width: 70, left: 15, top: 350, text: 'Быть простым и легко запоминаться, например «123», «111», «qwerty» и т.д.'} });

    // Remix.addHashlistElement('router.screens.'+result1sid+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: 100, text: 'Ваши данные под угрозой. Вам срочно следует улучшить ваши знания в области ИТ-безопасности'} });
    // Remix.addHashlistElement('router.screens.'+result1sid+'.components', undefined, { newElement: {displayName: 'Button', tags: 'restart', left: 40, top: 250, text: 'Начать заново'} });
    // Remix.addHashlistElement('router.screens.'+result1sid+'.components', undefined, { newElement: {displayName: 'FbButton', left: 38, top: 350} });

    // Remix.addHashlistElement('router.screens.'+result2sid+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 60, left: 20, top: 100, text: 'Отлично, вы в безопасности. Ваши знания по ИТ-безопасности помогут вам избежать угроз'} });
    // Remix.addHashlistElement('router.screens.'+result2sid+'.components', undefined, { newElement: {displayName: 'Button', tags: 'restart', left: 40, top: 250, text: 'Начать заново'} });
    // Remix.addHashlistElement('router.screens.'+result2sid+'.components', undefined, { newElement: {displayName: 'FbButton', left: 38, top: 350} });
    // PROGRAMMALICALLY CREATE PROJECT


    //TODO 'text' from Button, and 'text' from FbButton conflict because they exists in one schema

}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('remix-app-root'));

setTimeout(test, 0);