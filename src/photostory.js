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
    startBtnTag: 'next', // must match initRemixRouting nextTag param, as this is one routing
})

initRemixRouting({
    remix: Remix,
    // some params specially for Remix-Routing plugin
    screenRoute: [
        { tag: 'start' }, // show all scrrens with tag in linear order
        { tag: 'photostory', shuffle: true }, // show all scrrens with tag and shuffle them
    ],
    restartTag: 'restart',
    nextTag: 'next',
    prevTag: 'prev',
})

initScreenProgress({
    remix: Remix,
    screenTag: 'photostory',
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

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('remix-app-root'),
)
