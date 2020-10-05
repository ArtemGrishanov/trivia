import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'
import App from './App'

import store from './store'
import Remix from './lib/remix'
import initRemixRouting from './lib/plugins/remix-routing'
import initScreenProgress from './lib/plugins/screen-progress'
import initCoverScreen from './lib/plugins/cover-screen'
import initShare from './lib/plugins/share'
import initGoogleAnalytics from './lib/plugins/googleAnalytics'
import initFacebookAnalytics from './lib/plugins/facebook-pixel'
import initQuizAnalytics from './lib/plugins/quiz-analytics'
import { getScreenHTMLPreview } from './lib/remix/util/util'
import initButtonBehavior from './lib/plugins/button-behavior'
import initQuizPoints from './lib/plugins/quiz-points'
import initUserDataForm from './lib/plugins/user-data-form'
import initPopupManager from './lib/plugins/popup-manager'

Remix.setStore(store)

initPopupManager({ remix: Remix })

initUserDataForm({ remix: Remix })

initButtonBehavior({ remix: Remix })

initCoverScreen({
    remix: Remix,
    screenTag: 'start', // must match routing {tag: 'start'} first param
    startBtnTag: 'option', // must match initRemixRouting nextTag param, as this is one routing
})

initRemixRouting({
    remix: Remix,
    resultScreenTag: 'result',
    userFormScreenTag: 'user_form_screen_tag',
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
    optionTag: 'option',
})

initShare({
    remix: Remix,
    /**
     * Функция для генерации главного превью приложения в виде HTML
     * Отсылается вовне, в редактор, где на основе этого html кода будет создано графическое превью
     * Css стили - это те же самые стили, что и для типа проекта загруженный через админку файл
     */
    getMainPreviewHTML: remix => {
        const state = remix.getState(),
            screen = state.router.screens.getByIndex(0) // это может быть кавер скрин или первый вопрос
        return getScreenHTMLPreview({ screen, defaultTitle: 'Take the quiz!' })
    },
    /**
     * Функция для генерации превью для каждого отдельного результата шаринга
     */
    getShareEntityPreviewHTML: (remix, shareEntity) => {
        const screenId = shareEntity.screen.id,
            state = remix.getState(),
            resultScreen = state.router.screens[screenId]
        return getScreenHTMLPreview({ screen: resultScreen, defaultTitle: 'Result title' })
    },
})

initGoogleAnalytics({ remix: Remix })

initFacebookAnalytics({ remix: Remix })

initQuizAnalytics({ remix: Remix })

/**
 * Trivia quiz distribution info
 *
 */

Remix.addMessageListener('gettriviadistribution', data => {
    let response = {
        questionsLength: 0,
        correctQuestionsLength: 0,
        resultsLength: 0,
        _collision: {
            questions: {
                noCorrect: [],
                allIncorrect: false,
            },
        },
        _probability: [],
    }

    const questionScreens = Remix.getScreens({ tag: 'question' }),
        resultScreens = Remix.getScreens({ tag: 'result' })

    response.questionsLength = questionScreens.length
    response.resultsLength = resultScreens.length

    //  Check questions
    let questionScreensCounter = 0
    for (const screen of questionScreens) {
        questionScreensCounter++
        let optionCounter = 0
        let hasCorrect = false
        for (const component of screen.components.toArray()) {
            if (typeof component.tags !== 'undefined') {
                const isOption = component.tags.indexOf('option') !== -1
                if (isOption) {
                    optionCounter++
                    if (component.data && component.data.points) {
                        hasCorrect = true
                    }
                }
            }
        }
        if (!hasCorrect) {
            response._collision.questions.noCorrect.push(screen.hashlistId)
        }
    }

    const correctQuestionsLength = questionScreens.length - response._collision.questions.noCorrect.length
    response.correctQuestionsLength = correctQuestionsLength
    if (!correctQuestionsLength) {
        response._collision.questions.allIncorrect = true
    } else {
        // Calculate probability
        let resGap = Math.floor(questionScreens.length / resultScreens.length)
        if (resGap < 1) {
            resGap = 1
        }

        let resultPointsAllocation = {},
            g = 1,
            resIndex = resultScreens.length - 1
        if (resGap < 1) {
            resGap = 1
        }
        if (resIndex >= 0) {
            let currentResultId = resultScreens[resIndex].hashlistId
            for (let i = questionScreens.length; i >= 0; i--) {
                // >= важно!
                resultPointsAllocation[i] = currentResultId
                g++
                if (g > resGap) {
                    g = 1
                    if (resIndex) {
                        resIndex--
                        currentResultId = resultScreens[resIndex].hashlistId
                    }
                }
            }
        }
        const test = Object.values(resultPointsAllocation).reduce((acc, el) => {
            acc[el] = (acc[el] || 0) + 1
            return acc
        }, {})

        let tmpMin = 0
        for (const [key, value] of Object.entries(test)) {
            response._probability.push({
                screenId: key,
                min: tmpMin,
                max: tmpMin + value - 1,
                range: value,
            })
            tmpMin = tmpMin + value
        }
    }

    return {
        message: 'trivia_distribution',
        data: {
            result: response,
        },
    }
})

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
