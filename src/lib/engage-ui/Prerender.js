import React from 'react'
import { connect } from 'react-redux'
import { getComponentClass } from './RemixWrapper'
import { setComponentsRects } from '../remix/layout/helpers'
import LayoutContainer from './layout/LayoutContainer'

class Prerender extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.preRenderRects = {}
    }

    componentRectMeasured(id, rect) {
        console.log('getContentRect', id, rect)
        this.preRenderRects[id] = rect
        setComponentsRects(this.preRenderRects)
    }

    render() {
        return (
            <div style={{ position: 'absolute', left: '-9999px', minHeight: '100%', width: '100%' }}>
                {this.props.preRenderComponents && (
                    <LayoutContainer
                        id={'__prerender_'}
                        width={this.props.width}
                        height={this.props.height}
                        adaptedui={this.props.adaptedui}
                    >
                        {this.props.preRenderComponents.map(cmpn => {
                            const RemixComponent = getComponentClass(cmpn.displayName)
                            return (
                                <RemixComponent
                                    {...cmpn}
                                    id={cmpn.hashlistId}
                                    key={cmpn.hashlistId}
                                    getContentRect={this.componentRectMeasured.bind(this, cmpn.hashlistId)}
                                ></RemixComponent>
                            )
                        })}
                    </LayoutContainer>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => {
    const width = state.session.size.width
    let props = {}
    if (state.session.prerender.components) {
        state.router.screens.toArray().forEach(scr => {
            if (scr.adaptedui && scr.adaptedui[width] && scr.adaptedui[width].props) {
                props = { ...props, ...scr.adaptedui[width].props }
            }
        })
    }
    return {
        width,
        height: state.session.size.height,
        preRenderComponents: state.session.prerender.components,
        adaptedui: { [width]: { props } },
    }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Prerender)
