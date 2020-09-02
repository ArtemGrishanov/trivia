import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'

import store from './store'

import Remix from './lib/remix'

import initRemixRouting from './lib/plugins/remix-routing'
import initShare from './lib/plugins/share'
import initGoogleAnalytics from './lib/plugins/googleAnalytics'
import initFacebookAnalytics from './lib/plugins/facebook-pixel'
import initQuizAnalytics from './lib/plugins/quiz-analytics'
import initButtonBehavior from './lib/plugins/button-behavior'

import { getTranslation } from './lib/engage-ui/translations'

import './index.css'

Remix.setStore(store)

Remix.extendSchema({
    ['router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ displayName=RankBattlePlayground].numberOfVotes./^[0-9a-z]+$/']: {
        type: 'number',
        min: 0,
        max: 2 ** 64,
        default: 0,
    },
})

initButtonBehavior({ remix: Remix })

initRemixRouting({
    remix: Remix,
    resultScreenTag: 'result',
    userFormScreenTag: 'user_form_screen_tag',
    // some params specially for Remix-Routing plugin
    screenRoute: [
        { tag: 'screen' }, // show all scrrens with tag in linear order
        { tag: 'question', shuffle: true }, // show all scrrens with tag and shuffle them
        { idByFunction: 'calcTriviaRes' }, // show one screenId returned by function 'calcTriviaRes'
    ],
    restartTag: 'restart',
    nextTag: 'option',
})

function getScreenHTMLPreview({ screen, defaultTitle }) {
    const FB_SHARE_WIDTH = 1200, // поддерживаем пока один фикс размер шаринг картинки
        FB_SHARE_HEIGHT = 630,
        backStyle = `width:${FB_SHARE_WIDTH}px;
        height:${FB_SHARE_HEIGHT}px;
        padding:100px;
        box-sizing:border-box;
        text-align:center;
        background-image:url(${screen.backgroundImage});
        background-size:cover;
        background-position:center;
        background-color:#C86445;
        font-family:Arial,sans-serif;
        color:#fff;
        font-size:48px;
        display:flex;
        justify-content:center;
        align-items:center;`

    return `<div style="${backStyle}">
                ${defaultTitle}
            </div>`
}

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
        return getScreenHTMLPreview({ screen, defaultTitle: 'Then/Now' })
    },
    /**
     * Функция для генерации превью для каждого отдельного результата шаринга
     */
    getShareEntityPreviewHTML: (remix, shareEntity) => {
        const screenId = shareEntity.screen.id,
            state = remix.getState(),
            resultScreen = state.router.screens[screenId]
        return getScreenHTMLPreview({ screen: resultScreen, defaultTitle: 'Then/Now' })
    },
})

initGoogleAnalytics({ remix: Remix })

initFacebookAnalytics({ remix: Remix })

initQuizAnalytics({ remix: Remix })

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('remix-app-root'),
)
