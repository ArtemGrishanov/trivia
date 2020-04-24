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
import initScreenCollage from './lib/plugins/screen-collage'
import initShare from './lib/plugins/share'
import initGoogleAnalytics from './lib/plugins/googleAnalytics'

import { getScreenHTMLPreview } from './lib/remix/util/util'

Remix.setStore(store)

const PROJECT_TAG = 'quotes'
const PROJECT_ITEM_TAG = `${PROJECT_TAG}item`

initScreenCollage({
    remix: Remix,
    screenTag: 'final',
})

initCoverScreen({
    remix: Remix,
    screenTag: 'start', // must match routing {tag: 'start'} first param
    startBtnTag: 'next', // must match initRemixRouting nextTag param, as this is one routing
})

initRemixRouting({
    remix: Remix,
    // some params specially for Remix-Routing plugin
    screenRoute: [
        { tag: 'start' }, // show all screens with tag in linear order
        { tag: PROJECT_ITEM_TAG, shuffle: true }, // show all screens with tag and shuffle them
        { tag: 'final' },
    ],
    restartTag: 'restart',
    nextTag: 'next',
    prevTag: 'prev',
})

initScreenProgress({
    remix: Remix,
    screenTag: PROJECT_ITEM_TAG,
})

initShare({
    remix: Remix,
    displayTypes: ['FbButton'],
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

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('remix-app-root'),
)