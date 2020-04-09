import React from 'react'
import { connect } from 'react-redux'
import DataSchema from '../schema'
import Remix from '../remix'
import Router from './router'
import { getComponentClass } from './RemixWrapper'
import { setComponentsRects } from '../remix'

class EngageApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: null
        };
        this.preRenderRefs = {};
    }

    componentDidMount() {
        Remix.fireEvent('app_start');
    }

    componentDidUpdate() {
        if (this.props.preRenderComponents) {
            const rects = {}
            this.props.preRenderComponents.forEach( c => {
                if (this.preRenderRefs[c.hashlistId] && this.preRenderRefs[c.hashlistId].current)
                    rects[c.hashlistId] = this.preRenderRefs[c.hashlistId].current.getBoundingClientRect();
                else
                    console.error(`Prerender components: cannot find a ref for a ${c.hashlistId} component`)
            })
            setComponentsRects(rects);
        }
    }

    render() {
        const appSt = {
            width: '100%',
            height: '100%',
            overflow: this.props.editable ? 'initial': 'hidden'
        }
        return (
            <div className="rmx-app" style={appSt}>
                <Router></Router>
                <div>
                    {this.props.preRenderComponents &&
                        this.props.preRenderComponents.map( cmpn => {
                            this.preRenderRefs[cmpn.hashlistId] = React.createRef();
                            const RemixComponent = getComponentClass(cmpn.displayName);
                            return <RemixComponent {...cmpn} id={cmpn.hashlistId} key={cmpn.hashlistId}></RemixComponent>;
                        })
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        width: state.app.size.width,
        height: state.app.size.height,
        editable: state.session.mode === 'edit',
        preRenderComponents: state.session.prerender.components
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