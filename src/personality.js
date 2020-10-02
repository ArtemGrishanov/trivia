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

const getPlainTextFromHtml = str => {
    ;[`\n`, `\r`, `\``, `'`, `"`, `<`, `>`].forEach(char => {
        const reg = new RegExp(`U\\+${char.charCodeAt(0)};`, 'g')
        str = str.replace(reg, char).replace(/(<([^>]+)>)/gi, '')
    })
    return str
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
        options: [],
        results: [],
        _collision: {
            options: {
                unlinked: [],
            },
            results: {
                unlinked: [],
                neverShow: [],
            },
        },
        _probability: {},
    }

    const distributionData = JSON.parse(JSON.stringify(Remix.getState().app.personality.links.toArray()))

    const questionScreens = Remix.getScreens({ tag: 'question' })
    const resultScreens = Remix.getScreens({ tag: 'result' })

    // Find and format options
    for (const screen of questionScreens) {
        for (const component of screen.components.toArray()) {
            if (typeof component.tags !== 'undefined') {
                const isOption = component.tags.indexOf('option') !== -1 && component.displayName === 'TextOption'

                if (isOption) {
                    const linked = distributionData.findIndex(item => item.optionId === component.hashlistId) !== -1
                    let links = []
                    if (linked) {
                        const arr = distributionData.filter(item => item.optionId === component.hashlistId)
                        arr.forEach(el => {
                            links.push({
                                screenId: el.resultId,
                                weight: el.weight,
                            })
                        })
                    }

                    let obj = {
                        screenId: screen.hashlistId,
                        componentId: component.hashlistId,
                        linked,
                        links,
                        image: null,
                        text: null,
                    }

                    const image = component.imageSrc.length
                    if (image) {
                        obj.image = image
                    }
                    obj.text = getPlainTextFromHtml(component.text)
                    response.options.push(obj)
                }
            }
        }
    }

    // Find and format results
    for (const screen of resultScreens) {
        let obj = {
            screenId: screen.hashlistId,
            neverShow: true,
            linked: false,
            links: [],
            questionScreenDistribution: {},
            scoresMax: 0,
            scoresMin: 0,
            image: null,
            text: null,
        }

        const image = screen.backgroundImage
        if (image) {
            obj.image = screen.backgroundImage
        }
        const textComponent = screen.components.toArray().find(c => c.displayName === 'Text')
        if (textComponent) {
            obj.text = textComponent.text.replace(/<[^>]+>/g, '')
        }

        response.options.forEach(option => {
            if (!obj.questionScreenDistribution[option.screenId]) {
                obj.questionScreenDistribution[option.screenId] = {
                    screenId: option.screenId,
                    hasUnlinkedOption: false,
                    weightMin: 0,
                    weightMax: 0,
                    optionsLength: 0,
                    optionsScores: [],
                }
            }
            let questionScreenDistribution = obj.questionScreenDistribution[option.screenId]

            questionScreenDistribution.optionsLength++

            const linkIndex = option.links.findIndex(item => item.screenId === screen.hashlistId)

            if (linkIndex !== -1) {
                const optionWeight = option.links[linkIndex].weight

                obj.linked = true
                obj.links.push({
                    screenId: option.screenId,
                    componentId: option.componentId,
                    weight: optionWeight,
                })

                questionScreenDistribution.optionsScores.push(optionWeight)

                if (!questionScreenDistribution.hasUnlinkedOption) {
                    if (!questionScreenDistribution.weightMin || questionScreenDistribution.weightMin > optionWeight) {
                        questionScreenDistribution.weightMin = optionWeight
                    }
                }
                if (questionScreenDistribution.weightMax < optionWeight) {
                    questionScreenDistribution.weightMax = optionWeight
                }
            } else {
                questionScreenDistribution.hasUnlinkedOption = true
                questionScreenDistribution.weightMin = 0
            }

            obj.questionScreenDistribution[option.screenId] = questionScreenDistribution
        })

        obj.scoresMax = Object.values(obj.questionScreenDistribution).reduce((a, b) => a + b.weightMax, 0)
        obj.scoresMin = Object.values(obj.questionScreenDistribution).reduce((a, b) => a + b.weightMin, 0)

        response.results.push(obj)
    }

    // Find distribution collision and result probability
    for (const option of response.options) {
        if (!option.linked) {
            response._collision.options.unlinked.push({
                screenId: option.screenId,
                componentId: option.componentId,
            })
        }
    }
    for (const [index, result] of response.results.entries()) {
        // for (const result of response.results) {
        if (!result.linked) {
            response._collision.results.unlinked.push(result.screenId)
        } else {
            const isNewerShow = response.results.findIndex(item => item.scoresMin > result.scoresMax) !== -1
            if (isNewerShow) {
                response._collision.results.neverShow.push(result.screenId)
            } else {
                response.results[index].neverShow = false
                response._probability[result.screenId] = {
                    screenId: result.screenId,
                    scoresAvgSum: 0,
                    screens: {},
                }
                Object.values(result.questionScreenDistribution).forEach(item => {
                    const clickProbability = (100 / item.optionsLength) * item.optionsScores.length
                    const scoresAvg =
                        Math.round(
                            (item.optionsScores.reduce((a, b) => a + b, 0) / item.optionsLength) *
                                (clickProbability / 100) *
                                100,
                        ) / 100
                    response._probability[result.screenId].scoresAvgSum =
                        Math.round((response._probability[result.screenId].scoresAvgSum + scoresAvg) * 100) / 100
                    response._probability[result.screenId].screens[item.screenId] = scoresAvg
                })
            }
        }
    }

    const avgResultPercentage = Math.round((100 / Object.values(response._probability).length) * 100) / 100
    for (const [key, value] of Object.entries(response._probability)) {
        const percentage =
            Math.round(
                (100 / Object.values(response._probability).reduce((a, b) => a + b.scoresAvgSum, 0)) *
                    value.scoresAvgSum *
                    100,
            ) / 100
        response._probability[key].percentage = percentage
        response._probability[key].deviationAvgResultPercentage =
            Math.round(((percentage * 100) / avgResultPercentage - 100) * 100) / 100
    }

    return {
        message: 'personality_distribution',
        data: {
            result: response,
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
        return res_sorted_arr[0].result_id
    }
    // если попали сюда - значит привязки заданы не корректно и путь ответов не привел ни к одному из результатов
    // но чтобы скрыть баг и сделать вид что все нормально - покажем рандомный результат (если они вообще есть)
    if (results.length) {
        console.warn('Result is random')
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
