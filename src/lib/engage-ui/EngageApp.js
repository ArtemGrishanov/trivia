import React from 'react'
import { connect } from 'react-redux'
import DataSchema from '../schema'

import './style/eng-common.css';

/**
 * TODO
 * Engage application container
 * - set width and height
 * - size modes: stretch on width? min height? height by content?
 * - behaviour on mobile?
 * - can show modals
 * -- messages
 * -- animations, like loaders, counters...
 * -- forms
 * --- data collection forms
 * --- auth forms (like facebook login)
 * --- sharing window (like twitter post? I guess that all windows opens in browser popups)
 * --- other standart intergation modals...
 * --- ...
 * - can show bottom banner, show block banner
 * - network interaction
 * - if no content - show stub "no content"
 * - progress loader
 * - show default sharing pane
 * - show logo
 * - switch children with effect? slide left-right, shade effect ? But possible it is in Screen
 * - ...
 * -
 */
class EngageApp extends React.Component {
    
    // TODO как соотнести их со схемой? по идее надо по схеме компонента их заполнять
    // static defaultProps = {
    //     width: 400,
    //     height: undefined
    //     //TODO many props
    // }

    constructor(props) {
        super(props);
        this.state = {
            message: null
        };
    }

    componentWillReceiveProps(newProps) {
        //console.log(newProps);
    }

    sendRequest() {
        // network request?

        // network.send({
        //     type: 'engagement',
        //     value: 10
        // });
    }

    render() {

        const appSt = {
            width: this.props.appWidth + "px",
            minHeight: this.props.appHeight + "px"
        }

        return (
            <div className="eng-app" style={appSt}>
                {this.props.children &&
                    this.props.children}
                {!this.props.children && <p>no content</p>}
                {/*this.props.messages.length > 0 &&
                    <MessageBox message="Application is not supported"/>
                */}

                {/*<Banner></Banner>*/}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        width: state.app.width,
        height: state.app.height
    }
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const EngageAppSchema = new DataSchema({
    "width": {
        type: 'number',
        min: 80,
        max: 4000,
        default: 400
    },
    "height": {
        type: 'number',
        min: 18,
        default: 400
    }
});

export default connect(mapStateToProps)(EngageApp);