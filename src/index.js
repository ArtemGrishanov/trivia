import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'
import App from './App'

import store from './store'
import Remix from './lib/remix'
import initRemixRouting from './lib/plugins/remix-routing'
import initScreenProgress from './lib/plugins/screen-progress'
import initQuizPoints from './lib/plugins/quiz-points'
import initCoverScreen from './lib/plugins/cover-screen'
import initShare from './lib/plugins/share'
import initGoogleAnalytics from './lib/plugins/googleAnalytics'

Remix.setStore(store)

initCoverScreen({
    remix: Remix,
    screenTag: 'start', // must match routing {tag: 'start'} first param
    startBtnTag: 'option', // must match initRemixRouting nextTag param, as this is one routing
})

initRemixRouting({
    remix: Remix,
    // some params specially for Remix-Routing plugin
    screenRoute: [
        { tag: 'start' }, // show all scrrens with tag in linear order
        { tag: 'question', shuffle: true }, // show all scrrens with tag and shuffle them
        { idByFunction: 'calcTriviaRes' }, // show one screenId returned by function 'calcTriviaRes'
    ],
    restartTag: 'restart',
    nextTag: 'option',
})

initScreenProgress({
    remix: Remix,
    screenTag: 'question',
})

initQuizPoints({
    remix: Remix,
    tag: 'option',
})

initShare({
    remix: Remix,
    displayTypes: ['FbButton'],
})

initGoogleAnalytics({ remix: Remix })

/**
 * Trivia quiz custom result calculation
 *
 */
Remix.addCustomFunction('calcTriviaRes', () => {
    const state = Remix.getState(),
        questionsCount = Remix.getScreens({ tag: 'question' }).length,
        results = Remix.getScreens({ tag: 'result' })
    let resultPointsAllocation = {},
        q = 0,
        points = 0,
        maxPoints = questionsCount
    // посчитаем количество набранных баллов, посмотрим историю событий "клик по опциям" с конца (начиная с самых новых)
    for (var i = state.session.events.length - 1; i >= 0; i--) {
        const evt = state.session.events[i]
        if (evt.eventType === 'onclick' && evt.eventData.tags.indexOf('option') > 0) {
            q++
            points += parseInt(evt.eventData.data.points)
        }
        if (q >= questionsCount) {
            // достаточно: мы нашли количество кликов по опциям равное количеству вопросов
            // их может быть больше - но это уже прежние прохождения с рамкам одной сессии пользователя
            break
        }
    }
    // подсчитаем распределение ответов, то есть таблицу соотношения <количество баллов> = <ид результата>
    // для любого возможного количества баллов
    let resGap = Math.floor(questionsCount / results.length), // длина промежутка на шкале распределения, которая приходится на один результат
        g = 1,
        resIndex = results.length - 1 // начинаем распределять с конца
    if (resGap < 1) {
        resGap = 1
    }
    if (resIndex >= 0) {
        let currentResultId = results[resIndex].hashlistId
        for (let i = maxPoints; i >= 0; i--) {
            // >= важно!
            resultPointsAllocation[i] = currentResultId
            g++
            if (g > resGap) {
                g = 1
                if (resIndex) {
                    resIndex--
                    currentResultId = results[resIndex].hashlistId
                }
            }
        }
    }
    return resultPointsAllocation[points]
})

// Remix.addHashlistElement('router.screens', undefined, {newElement: {backgroundColor: '#000', tags: 'screen question question1'} });
// var screenId = store.getState().router.screens.getId(0);
// Remix.setCurrentScreen(screenId);
// Remix.addHashlistElement('router.screens.'+screenId+'.components', undefined, { newElement: {displayName: 'Text', fontSize: 24, color: '#C7A667', tags: 'question title', animationOnAppearance: 'none', width: 70, left: 15, top: 120, text: 'Айтишники просят использовать пароли типа gH74eW11!m, а сотрудники постоянно их забывают. Все друг на друга злятся, работа стоит. Как быть?'} });

//TODO 'text' from Button, and 'text' from FbButton conflict because they exists in one schema

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('remix-app-root'),
)
