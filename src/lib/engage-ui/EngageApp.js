import React from 'react'
import { connect } from 'react-redux'
import DataSchema from '../schema'
import Remix from '../remix'
import Router from './router'
import Prerender from './Prerender'

class EngageApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        Remix.fireEvent('app_start')
    }

    componentDidUpdate() {}

    render() {
        const appSt = {
            width: '100%',
            height: '100%',
            overflow: this.props.editable ? 'initial' : 'hidden',
        }
        return (
            <div className="rmx-app" style={appSt}>
                <Router></Router>
                <Prerender></Prerender>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        editable: state.session.mode === 'edit',
    }
}

const mapDispatchToProps = {}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const EngageAppSchema = new DataSchema({
    width: {
        type: 'number',
        min: 80,
        max: 4000,
        default: 444,
        appWidthProperty: true,
    },
    height: {
        type: 'number',
        min: 18,
        max: 12000,
        default: 444,
        appHeightProperty: true,
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(EngageApp)
