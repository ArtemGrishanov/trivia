import React from 'react'
import { HashRouter, Route } from 'react-router-dom'

import BASE_SAMPLES from './base_samples'
import QUIZ_SAMPLES from './quiz'
import COMPONENTS from './components'

class Demo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isEdit: Remix.getMode() === 'edit',
        }
    }

    getId(hash) {
        const m = new RegExp(/id=([0-9A-z]+)/)
        const r = m.exec(hash)
        return r && r[1] ? r[1] : null
    }

    getChild(id) {
        let r = BASE_SAMPLES
            ? BASE_SAMPLES.find(c => {
                  return c.props.id == id
              })
            : ''
        if (r) return r
        r = COMPONENTS
            ? COMPONENTS.find(c => {
                  return c.props.id == id
              })
            : ''
        if (r) return r
        r = QUIZ_SAMPLES
            ? QUIZ_SAMPLES.find(c => {
                  return c.props.id == id
              })
            : ''
        return r
    }

    handleChange(event) {
        Remix.setMode(event.target.checked ? 'edit' : 'none')
        this.setState({
            isEdit: event.target.checked,
        })
        this.forceUpdate()
    }

    cloneWithProps(children, props) {
        return React.Children.map(children, child => {
            return React.cloneElement(child, { ...props })
        })
    }

    render() {
        const nav = (
            <div>
                <a href="#/components">Components</a>
                <span> </span>
                <a href="#/">Basic</a>
                <span> </span>
                <a href="#/quiz">Quiz</a>
                <span style={{ color: '#333', float: 'right' }}>
                    <label>Edit mode</label>
                    <input onChange={this.handleChange.bind(this)} defaultChecked={this.state.isEdit} type="checkbox" />
                </span>
                <br></br>
                <br></br>
            </div>
        )

        return (
            <HashRouter>
                <Route
                    path="/open"
                    render={() => {
                        // render only one filtered child
                        const id = this.getId(window.location.hash)
                        return (
                            <div>
                                {nav}
                                {this.cloneWithProps([this.getChild(id)], { isEdit: this.state.isEdit })}
                            </div>
                        )
                    }}
                />
                <Route
                    exact
                    path="/components"
                    render={() => (
                        <div>
                            {nav}
                            {this.cloneWithProps(COMPONENTS, { isEdit: this.state.isEdit })}
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/quiz"
                    render={() => (
                        <div>
                            {nav}
                            {QUIZ_SAMPLES}
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/"
                    render={() => (
                        <div>
                            {nav}
                            {BASE_SAMPLES}
                        </div>
                    )}
                />
            </HashRouter>
        )
    }
}

new window.RemixContainer({
    mode: 'preview',
    element: document.getElementById('id-app_preview_remix_cnt'),
    url: 'index.html',
    scriptUrl: 'main.js',
    cssUrl: 'main.css',
    width: 800,
    height: 600,
    containerLog: true,
    defaults: null,
    forceRestart: true,
    onAppChange: event => {
        switch (event) {
            case 'inited': {
                console.log('demo.js: THE APP WAS INITED!')
                //TODO add screens LAYOUTS_SAMPLES into each app
            }
        }
    },
})

export default Demo
