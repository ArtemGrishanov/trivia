import React from 'react'
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux'
import DataSchema from '../schema'
import Remix from '../remix'
import Router from './router'

import './style/rmx-common.css';

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

    constructor(props) {
        super(props);
        this.state = {
            message: null
        };
        // this.executedTransactionIds = {};
        this.screens = [];
    }

    sendRequest() {
        //TODO saga

        // network request?

        // network.send({
        //     type: 'engagement',
        //     value: 10
        // });
    }

    componentDidMount() {
        Remix.fireEvent('app_start');
    }

    componentDidUpdate() {
        //this.syncScreens();
    }

    // syncScreens() {
    //     const prevScrs = this.screens;
    //     this.screens = [];
    //     const result = {
    //         added: [],
    //         changed: [],
    //         deleted: []
    //     };
    //     let childrenArr = this.props.children;
    //     if (!childrenArr) {
    //         childrenArr = [];
    //     }
    //     childrenArr.flat().forEach( (child) => {
    //         const screenId = child.props.screenId;
    //         if (!screenId) {
    //             throw new Error('You must define unique prop "screenId" for each Screen component');
    //         }
    //         if (this.getScreenById(this.screens, screenId)) {
    //             throw new Error(`screenId "${screenId}" is not unique`);
    //         }
    //         const markup = ReactDOMServer.renderToStaticMarkup(child);
    //         const scr = this.getScreenById(prevScrs, screenId);
    //         if (!scr) {
    //             // a new screen came
    //             const newScreen = {
    //                 screenId: screenId,
    //                 markup: markup
    //             };
    //             this.screens.push(newScreen);
    //             result.added.push(newScreen);
    //         }
    //         else {
    //             // screen already exist
    //             // sync screen markup
    //             if (scr.markup !== markup) {
    //                 result.changed.push(scr);
    //                 scr.markup = markup;
    //             }
    //             this.screens.push(scr); // because we created a new array
    //         }
    //     });
    //     // check deleted screens
    //     prevScrs.forEach( (scr) => {
    //         if (!this.getScreenById(this.screens, scr.screenId)) {
    //             result.deleted.push(scr);
    //         }
    //     });
    //     if (result.added.length > 0 || result.changed.length > 0 || result.deleted.length > 0) {
    //         Remix._setScreenEvents(result);
    //     }
    // }

    getScreenById(screenArr = [], id) {
        return screenArr.find( (scr) => scr.screenId === id);
    }

    emitEvents() {}

    // renderOld() {

    //     const appSt = {
    //         width: this.props.width + "px",
    //         minHeight: this.props.height + "px"
    //     }

    //     // only Screen children expected
    //     //TODO move to componentwillreceive props ?
    //     const filteredChildren = this.props.children ? this.props.children.flat().filter( (screen) => !!screen.props.if() ): null;

    //     return (
    //         <div className="eng-app" style={appSt}>
    //             {/* only Screen children expected */}
    //             {filteredChildren &&
    //                 filteredChildren}
    //             {!filteredChildren && <p>no content</p>}
    //             {/*this.props.messages.length > 0 &&
    //                 <MessageBox message="Application is not supported"/>
    //             */}

    //             {/*<Banner></Banner>*/}
    //         </div>
    //     )
    // }

    render() {
        const appSt = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            overflow: 'hidden'
        }
        return (
            <div className="rmx-app" style={appSt}>
                <Router></Router>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        width: state.app.size.width,
        height: state.app.size.height
    }
}

const mapDispatchToProps = {
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
        default: 444,
        appWidthProperty: true
    },
    "height": {
        type: 'number',
        min: 18,
        max: 12000,
        default: 444,
        appHeightProperty: true
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(EngageApp);