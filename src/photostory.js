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

Remix.setStore(store)

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
        { tag: 'photostoryitem', shuffle: true }, // show all screens with tag and shuffle them
        { tag: 'final' },
    ],
    restartTag: 'restart',
    nextTag: 'next',
    prevTag: 'prev',
})

initScreenProgress({
    remix: Remix,
    screenTag: 'photostoryitem',
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
