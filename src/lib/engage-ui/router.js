import React from 'react'
import RemixWrapper from './RemixWrapper';
import DataSchema from '../schema'
import HashList from '../hashlist'
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
                    this.props.screens.toArray().map( (scr, i) => {
                        return <Screen {...scr} id={this.props.screens.getId(i)} key={this.props.screens.getId(i)}></Screen>
                    })
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
        default: new HashList([
            { displayName: 'Screen', backgroundColor: 'yellow' }
        ]),
        minLength: 0,
        maxLength: 32,
        prototypes: [
            { id: 'default_prototype', data: { displayName: 'Screen', backgroundColor: 'green' }}
        ]
    }
});

export default RemixWrapper(Router, Schema, 'Router');