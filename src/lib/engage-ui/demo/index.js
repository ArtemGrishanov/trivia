import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from '../../../store'
import Demo from './demo'

Remix.setStore(store)
Remix.setMode('none')

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Demo></Demo>
    </div>
  </Provider>,
  document.getElementById('root'),
)
