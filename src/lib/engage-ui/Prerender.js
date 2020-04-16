import React from 'react'
import { connect } from 'react-redux'
import { getComponentClass } from './RemixWrapper'
import { setComponentsRects } from '../remix'
import LayoutContainer from './layout/LayoutContainer'

class Prerender extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.preRenderRects = {}
    }

    getContentRect(id, rect) {
        console.log('getContentRect', id, rect)
        this.preRenderRects[id] = rect
        if (Object.keys(this.preRenderRects).length === this.props.preRenderComponents.length) {
            setComponentsRects(this.preRenderRects)
        }
    }

    render() {
        return (
            <div style={{ position: 'absolute', left: '-9999px' }}>
                <LayoutContainer
                    id={'__prerender_'}
                    width={this.props.width}
                    height={this.props.height}
                    adaptedui={this.props.adaptedui}
                >
                    {this.props.preRenderComponents &&
                        this.props.preRenderComponents.map(cmpn => {
                            const RemixComponent = getComponentClass(cmpn.displayName)
                            return (
                                <RemixComponent
                                    {...cmpn}
                                    id={cmpn.hashlistId}
                                    key={cmpn.hashlistId}
                                    getContentRect={this.getContentRect.bind(this, cmpn.hashlistId)}
                                ></RemixComponent>
                            )
                        })}
                </LayoutContainer>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        width: state.session.size.width,
        height: state.session.size.height,
        adaptedui: state.session.adaptedui,
        preRenderComponents: state.session.prerender.components,
    }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Prerender)
