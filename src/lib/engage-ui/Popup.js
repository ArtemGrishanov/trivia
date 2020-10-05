import React from 'react'
import { connect } from 'react-redux'
import DataSchema from '../schema'
import HashList from '../hashlist'
import RemixWrapper from './RemixWrapper'
import { getComponentClass } from './RemixWrapper'
import BasicImage from './bricks/BasicImage'

import LayoutContainer from './layout/LayoutContainer'

import './style/remix-popup.css'

class Popup extends React.Component {
    render() {
        const {
            adaptedui,
            width,
            height,
            editable = false,
            id,
            screenId,
            size,
            components,
            overflowHidden,
            backgroundColor,
            backgroundImage,
            margin,
            screen,
        } = this.props
        const adaptiveMargin = screen === 'desktop' ? margin : 20

        const s = {
            backgroundColor: backgroundColor,
            margin: `${adaptiveMargin}px`,
            ...(size
                ? {
                      width: `${size.width - adaptiveMargin * 2}px`,
                      height: `${size.height - adaptiveMargin * 2}px`,
                  }
                : {}),
            overflow: overflowHidden ? 'hidden' : 'initial',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: '50%',
        }

        const renderComponents = components.toArray().map((cmpn, i) => {
            const cmpnId = components.getId(i)

            const RemixComponent = getComponentClass(cmpn.displayName)

            return <RemixComponent {...cmpn} id={cmpnId} key={cmpnId} />
        })

        return (
            <div
                className="rmx-popup"
                style={
                    editable
                        ? { backgroundColor: '#cecece' }
                        : {
                              backgroundColor: 'rgba(13, 13, 13, 0.2)',
                          }
                }
            >
                <div className="rmx-popup__container" style={s}>
                    {/* {this.props.backgroundImage && (
                        <div className="rmx-screen_back_wr" style={{ margin: `${adaptiveMargin}px` }}>
                            <BasicImage
                                borderWidth={0}
                                width={size.width - adaptiveMargin * 2}
                                height={size.height - adaptiveMargin * 2}
                                src={this.props.backgroundImage}
                                backgroundSize="cover"
                            ></BasicImage>
                        </div>
                    )} */}
                    {size ? (
                        <LayoutContainer
                            editable={editable}
                            id={'__lc_of_popup_' + id}
                            width={size.width}
                            height={size.height}
                            adaptedui={adaptedui}
                            screenId={screenId}
                        >
                            {renderComponents}
                        </LayoutContainer>
                    ) : null}
                </div>
            </div>
        )
    }
}

export const Schema = new DataSchema({
    margin: {
        type: 'number',
        min: 0,
        max: 300,
        default: 40,
    },
    backgroundColor: {
        type: 'string',
        default: 'rgba(255, 255, 255, 0.85)',
    },
    backgroundImage: {
        type: 'string',
        default: '',
    },
    components: {
        type: 'hashlist',
        minLength: 0,
        maxLength: 128,
        default: new HashList([]),
        prototypes: [
            { id: 'dumb_component', data: { displayName: 'Element', backgroundColor: 'rgba(255, 255, 255, 0.85)' } },
        ],
    },
    staticMarkup: {
        type: 'string',
        minLength: 0,
        maxLength: 512000,
        default: '',
        serialize: false,
    },
    adaptedui: {
        type: 'object',
        default: {},
    },
})

const mapStateToProps = state => {
    return { screen: state.app.screen }
}

export default RemixWrapper(connect(mapStateToProps, null)(Popup), Schema, 'Popup')
