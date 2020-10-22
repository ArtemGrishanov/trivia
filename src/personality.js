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
import initPersonalityChain from './lib/plugins/personality-chain'
import initUserDataForm from './lib/plugins/user-data-form'

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
            min: 1,
            max: 2,
            default: 1,
        },
    })
}

initUserDataForm({ remix: Remix })

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
        { tag: 'start' }, // show all screens with tag in linear order
        { tag: 'question', shuffle: true }, // show all screens with tag and shuffle them
        { idByFunction: 'calcPersonalityRes' }, // show one screenId returned by function 'calcPersonalityRes'
    ],
    restartTag: 'restart',
    nextTag: 'option',
})

initScreenProgress({
    remix: Remix,
    screenTag: 'question',
})

initPersonalityChain({
    remix: Remix,
    optionTag: 'option',
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
 * Personality quiz distribution info
 *
 */

Remix.addMessageListener('getpersonalitydistribution', data => {
    let response = {
        questions: [],
        options: [],
        results: [],
        _collision: {
            options: {
                unlinked: [],
            },
            results: {
                neverShow: [],
            },
        },
        _probability: {},
    }

    const distributionData = JSON.parse(
        JSON.stringify(
            data.payload.links
                ? new HashList(data.payload.links).toArray()
                : Remix.getState().app.personality.links.toArray(),
        ),
    )
    const probabilityOnly = data.payload.probabilityOnly

    const questionScreens = Remix.getScreens({ tag: 'question' })
    const resultScreens = Remix.getScreens({ tag: 'result' })

    // Find and format questions / options
    let questionScreensCounter = 0
    for (const screen of questionScreens) {
        questionScreensCounter++

        const screenFirstTextComponent = screen.components.toArray().find(c => c.displayName === 'Text')
        response.questions.push({
            screenId: screen.hashlistId,
            image: screen.backgroundImage ? screen.backgroundImage : null,
            text: screenFirstTextComponent
                ? screenFirstTextComponent.text.replace(/<[^>]+>/g, '')
                : 'Question ' + questionScreensCounter,
            bgColor: screen.backgroundColor,
        })
        let optionCounter = 0
        for (const component of screen.components.toArray()) {
            if (typeof component.tags !== 'undefined') {
                const isOption = component.tags.indexOf('option') !== -1 && component.displayName === 'TextOption'

                if (isOption) {
                    optionCounter++
                    let links = []
                    let usedResults = []
                    const linksArr = distributionData.filter(
                        item =>
                            item.optionId === component.hashlistId &&
                            resultScreens.findIndex(item2 => item2.hashlistId === item.resultId) !== -1,
                    )
                    if (linksArr.length) {
                        usedResults = linksArr.map(item => item.resultId)
                        linksArr.forEach(el => {
                            links.push({
                                screenId: el.resultId,
                                weight: el.weight,
                            })
                        })
                    }
                    const unusedResults = resultScreens
                        .filter(result => usedResults.indexOf(result.hashlistId) === -1)
                        .map(item => item.hashlistId)
                    unusedResults.forEach(hashlistId => {
                        links.push({
                            screenId: hashlistId,
                            weight: 0,
                        })
                    })

                    let obj = {
                        screenId: screen.hashlistId,
                        componentId: component.hashlistId,
                        counter: optionCounter,
                        linked: linksArr.length !== 0,
                        links,
                        image: null,
                        text: null,
                    }

                    const image = component.imageSrc.length
                    obj.image = image ? component.imageSrc : null
                    if (component.text && component.text.length) {
                        obj.text = component.text.replace(/<[^>]+>/g, '')
                    } else {
                        obj.text = 'Answer ' + optionCounter
                    }

                    response.options.push(obj)
                }
            }
        }
    }

    // Find and format results
    let resultScreensCounter = 0
    for (const screen of resultScreens) {
        resultScreensCounter++

        let obj = {
            screenId: screen.hashlistId,
            counter: resultScreensCounter,
            links: [],
            questionScreenDistribution: {},
            bgColor: screen.backgroundColor,
            image: null,
            text: null,
        }

        const image = screen.backgroundImage
        obj.image = image ? screen.backgroundImage : null
        const screenFirstTextComponent = screen.components.toArray().find(c => c.displayName === 'Text')
        if (screenFirstTextComponent) {
            obj.text = screenFirstTextComponent.text.replace(/<[^>]+>/g, '')
        } else {
            obj.text = 'Result ' + resultScreensCounter
        }

        response.options.forEach(option => {
            if (!obj.questionScreenDistribution[option.screenId]) {
                obj.questionScreenDistribution[option.screenId] = {
                    screenId: option.screenId,
                    optionsScores: [],
                }
            }
            let questionScreenDistribution = obj.questionScreenDistribution[option.screenId]

            const linkIndex = option.links.findIndex(item => item.screenId === screen.hashlistId)

            if (linkIndex !== -1) {
                const optionWeight = option.links[linkIndex].weight

                obj.links.push({
                    screenId: option.screenId,
                    componentId: option.componentId,
                    weight: optionWeight,
                })

                questionScreenDistribution.optionsScores.push(optionWeight)
            }

            obj.questionScreenDistribution[option.screenId] = questionScreenDistribution
        })

        response.results.push(obj)
    }

    for (const option of response.options) {
        if (!option.linked) {
            response._collision.options.unlinked.push({
                screenId: option.screenId,
                componentId: option.componentId,
            })
        }
    }
    let distributionHelper = {}
    for (const result of response.results) {
        response._probability[result.screenId] = {
            screenId: result.screenId,
            screens: {},
        }

        Object.values(result.questionScreenDistribution).forEach(item => {
            response._probability[result.screenId].screens[item.screenId] = {
                scores: item.optionsScores,
            }

            if (!distributionHelper[item.screenId]) {
                distributionHelper[item.screenId] = {
                    optionsLength: item.optionsScores.length,
                    resultsLength: 0,
                    results: {},
                }
            }
            distributionHelper[item.screenId].resultsLength++
            distributionHelper[item.screenId].results[result.screenId] = item.optionsScores
        })
    }

    let weightDistribution = []

    let questionScreensDistribution = {}
    for (const [qId, q] of Object.entries(distributionHelper)) {
        questionScreensDistribution[qId] = {}
        let arr = new Array(q.optionsLength).fill([])
        Object.values(q.results).forEach(el1 => {
            el1.forEach((el2, index2) => {
                arr[index2] = [...arr[index2], el2]
            })
        })

        weightDistribution.push(arr)
    }

    const allPossibleChains = weightDistribution.reduce((a, b) =>
        a.reduce((r, v) => r.concat(b.map(w => [].concat(v.length && Array.isArray(v[0]) ? v : [v], [w]))), []),
    )

    const resultsIds = response.results.map(result => result.screenId)
    let check = new Array(allPossibleChains.length)
    allPossibleChains.forEach((chain, index) => {
        let chainWeightSum = new Array(resultsIds.length).fill(0)
        chain.forEach(weights => {
            for (let i = 0; i < resultsIds.length; i++) {
                chainWeightSum[i] = chainWeightSum[i] + weights[i]
            }
        })
        check[index] = chainWeightSum
    })
    let scores = new Array(resultsIds.length).fill(0)
    check.forEach(el1 => {
        const max = Math.max.apply(null, el1)
        const maxLength = el1.filter(w => w === max).length
        el1.forEach((el2, index2) => {
            if (maxLength === resultsIds.length || el2 === max) {
                scores[index2] = Math.round((scores[index2] + 1 / maxLength) * 100) / 100
            }
        })
    })

    scores.forEach((el, i) => {
        if (el === 0) {
            response._collision.results.neverShow.push(resultsIds[i])
            response._probability[resultsIds[i]].percentage = 0
        } else {
            response._probability[resultsIds[i]].percentage =
                Math.round(((el * 100) / allPossibleChains.length) * 100) / 100
        }
    })

    return {
        message: 'personality_distribution',
        data: {
            result: probabilityOnly ? response._probability : response,
        },
    }
})

/**
 * Personality quiz custom result calculation
 *
 */

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand)
}

Remix.addCustomFunction('calcPersonalityRes', () => {
    const state = Remix.getState(),
        questionsCount = Remix.getScreens({ tag: 'question' }).length,
        results = Remix.getScreens({ tag: 'result' })

    const personality_data = state.app.personality

    let res = {},
        q = 0
    // проходимся по кликам на опшены. на каждом клике смотрим есть ли связь этого опшена
    // к результату - если есть берем вес привязки и смотрим если ли в объекте res ключ равный resultId
    // если есть - добавляем значение weight к найденному resultId, если нет - сохраняет "resultId: weight" как новые
    for (var i = state.session.events.length - 1; i >= 0; i--) {
        const evt = state.session.events[i]
        if (evt.eventType === 'onclick' && evt.eventData.tags.indexOf('option') > 0) {
            q++
            const option_id = evt.eventData.id
            const opt_arr = personality_data.links.toArray().filter(item => item.optionId === option_id)
            if (opt_arr.length) {
                for (const item of opt_arr) {
                    if (res[item.resultId]) {
                        res[item.resultId] = res[item.resultId] + item.weight
                    } else {
                        res[item.resultId] = item.weight
                    }
                }
            }
        }
        if (q >= questionsCount) {
            break
        }
    }
    // отсортируем результаты в полрядке убывания weight
    // возможно ситуация что у нескольких result_id одинаковый weight, это не обрабатывается отдельно, также
    // возьмется просто нулевой элемент
    const res_sorted_arr = Object.entries(res)
        .map(el => {
            return {
                result_id: el[0],
                weight: el[1],
            }
        })
        .sort((a, b) => (a.weight > b.weight ? -1 : 1))

    if (res_sorted_arr.length) {
        const winRes = res_sorted_arr[0]

        if (res_sorted_arr.length > 1) {
            const winWeight = winRes.weight
            const equalWeightResults = res_sorted_arr.filter(el => el.weight === winWeight)
            if (equalWeightResults.length > 1) {
                // если попали сюда - значит с одинаковым weight есть несколько результатов, берем случайный из них
                const randomIndex = randomInteger(0, equalWeightResults.length - 1)
                console.warn('Result is random [NORMAL]')
                return equalWeightResults[randomIndex].result_id
            }
        }

        return winRes.result_id
    }
    // если попали сюда - значит привязки заданы не корректно и путь ответов не привел ни к одному из результатов
    // но чтобы скрыть баг и сделать вид что все нормально - покажем рандомный результат (если они вообще есть)

    if (results.length) {
        console.warn('Result is random [DANGER]')
        const randomIndex = randomInteger(0, results.length - 1)

        return results[randomIndex].hashlistId
    }
    throw new Error('Results not found')
})

extendPersonalitySchema()

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('remix-app-root'),
)
