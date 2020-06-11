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
import initQuizAnalytics from './lib/plugins/quiz-analytics'
import { getScreenHTMLPreview } from './lib/remix/util/util'
import initButtonBehavior from './lib/plugins/button-behavior'
import HashList from './lib/hashlist'

Remix.setStore(store)

initButtonBehavior({ remix: Remix })

function extendPersonalitySchema() {
    Remix.extendSchema({
        'app.personality.[links HashList]': {
            type: 'hashlist',
            minLength: 0,
            maxLength: 128,
            default: new HashList([]),
        },
        'app.personality.[links HashList]./^[0-9a-z]+$/.optionId': {
            type: 'string',
            default: '',
        },
        'app.personality.[links HashList]./^[0-9a-z]+$/.resultId': {
            type: 'string',
            default: '',
        },
        'app.personality.[links HashList]./^[0-9a-z]+$/.weight': {
            type: 'number',
            min: 0,
            max: 2,
            default: 0,
        },
    })
}

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
        { idByFunction: 'calcPersonalityRes' }, // show one screenId returned by function 'calcPersonalityRes'
    ],
    restartTag: 'restart',
    nextTag: 'option',
})

initScreenProgress({
    remix: Remix,
    screenTag: 'question',
})

initShare({
    remix: Remix,
    displayTypes: ['FbButton', 'Button'],
    /**
     * Функция для генерации главного превью приложения в виде HTML
     * Отсылается вовне, в редактор, где на основе этого html кода будет создано графическое превью
     * Css стили - это те же самые стили, что и для типа проекта загруженный через админку файл
     */
    getMainPreviewHTML: remix => {
        const state = remix.getState(),
            screen = state.router.screens.getByIndex(0) // это может быть кавер скрин или первый вопрос
        return getScreenHTMLPreview({ screen, defaultTitle: 'Personality quiz' })
    },
    /**
     * Функция для генерации превью для каждого отдельного результата шаринга
     */
    getShareEntityPreviewHTML: (remix, shareEntity) => {
        const screenId = shareEntity.screen.id,
            state = remix.getState(),
            resultScreen = state.router.screens[screenId]
        return getScreenHTMLPreview({ screen: resultScreen, defaultTitle: 'Result' })
    },
})

initGoogleAnalytics({ remix: Remix })

initQuizAnalytics({ remix: Remix })

/**
 * Personality quiz custom result calculation
 *
 */
Remix.addCustomFunction('calcPersonalityRes', () => {
    const state = Remix.getState(),
        questionsCount = Remix.getScreens({ tag: 'question' }).length,
        results = Remix.getScreens({ tag: 'result' })

    let alloc = {}

    console.log('state:', state)
    console.log('questionsCount:', questionsCount)
    console.log('results:', results)

    let q = 0,
        resObj

    for (var i = state.session.events.length - 1; i >= 0; i--) {
        const evt = state.session.events[i]
        if (evt.eventType === 'onclick' && evt.eventData.tags.indexOf('option') > 0) {
            q++
            console.log('evt.eventData.data:', evt.eventData.data)
        }
        if (q >= questionsCount) {
            break
        }
    }
    console.log('q:', q)

    // // подсчитаем распределение ответов, то есть таблицу соотношения <количество баллов> = <ид результата>
    // // для любого возможного количества баллов
    // let resGap = Math.floor(questionsCount / results.length), // длина промежутка на шкале распределения, которая приходится на один результат
    //     g = 1,
    //     resIndex = results.length - 1 // начинаем распределять с конца
    // if (resGap < 1) {
    //     resGap = 1
    // }
    // if (resIndex >= 0) {
    //     let currentResultId = results[resIndex].hashlistId
    //     for (let i = maxPoints; i >= 0; i--) {
    //         // >= важно!
    //         resultPointsAllocation[i] = currentResultId
    //         g++
    //         if (g > resGap) {
    //             g = 1
    //             if (resIndex) {
    //                 resIndex--
    //                 currentResultId = results[resIndex].hashlistId
    //             }
    //         }
    //     }
    // }
    // return resultPointsAllocation[points]
})

extendPersonalitySchema()

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('remix-app-root'),
)
