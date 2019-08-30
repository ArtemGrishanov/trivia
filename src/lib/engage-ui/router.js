import React from 'react'
import RemixWrapper from './RemixWrapper';
import DataSchema from '../schema'
import Screen from './Screen'

/**
 *
 */
 class Router extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            screens: {}
        };
    }

    render() {
        const st = {
            backgroundColor: this.props.backgroundColor
        };
        return (
            <div className="rmx-scr_container" style={st}>
                {this.props.screens.length === 0 &&
                    <p>no screens</p>
                }
                {this.props.screens.length > 0 &&
                    this.props.screens.toArray().map( (scr, i) => <Screen id={this.props.screens.getId(i)} key={this.props.screens.getId(i)}></Screen>)
                    // {scr.displayName}
                    // TODO init Screen components here, based on state
                }
            </div>
        )
    }
}


/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    "backgroundColor": {
        type: 'string',
        default: ''
    },
    "displayMode": {
        type: 'string',
        enum: ['oneScreen', 'verticalAll'],
        default: 'oneScreen'
    },
    "switchEffect": {
        type: 'string',
        enum: ['none'],
        default: 'none'
    },
    "screens": {
        type: 'hashlist',
        default: []
    }
});

// this component must know about its store property (store.getState().screenManager),
// because it is unique and exists by default in EngageApp

export default RemixWrapper(Router, Schema, 'Router', 'router');