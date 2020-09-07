import React from 'react'
import DataSchema from '../schema'
import HashList from '../hashlist'
import RemixWrapper from './RemixWrapper'
import { getComponentClass } from './RemixWrapper'
import { setData } from '../remix'
import BasicImage from './bricks/BasicImage'

import LayoutContainer from './layout/LayoutContainer'

import './style/remix-popup.css'

class Popup extends React.Component {
    render() {
        const {
            // adaptedui,
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
        } = this.props

        const s = {
            backgroundColor: backgroundColor,
            margin: `${margin}px`,
            ...(size
                ? {
                      width: `${size.width - margin * 2}px`,
                      height: `${size.height - margin * 2}px`,
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
                // onClick={
                //     editable
                //         ? void 0
                //         : () => {
                //               setData({ 'router.showPopup': false }, false, true)
                //           }
                // }
            >
                <div className="rmx-popup__container" style={s}>
                    {size ? (
                        <LayoutContainer
                            editable={editable}
                            id={'__lc_of_popup_' + id}
                            width={size.width}
                            height={size.height}
                            adaptedui={{}}
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
        default: new HashList([
            {
                arrowColor: '#fff',
                arrowDirection: 'right',
                arrowPosition: 'center',
                arrowType: 'default',
                backgroundColor: '#2990FB',
                borderColor: '',
                borderRadius: 34,
                borderWidth: 0,
                displayName: 'Button',
                displayType: 'flow',
                dropShadow: false,
                height: 44,
                iconColor: '',
                iconColorHover: '',
                iconGap: 10,
                iconName: '',
                iconPosition: 'left',
                imageSrc: '',
                isArrow: false,
                left: 628.5,
                leftStrategy: 'dynamic',
                openUrl: '',
                sizeMod: 'normal',
                styleVariant: 'primary',
                szBottom: 10,
                szLeft: 10,
                szRight: 10,
                szTop: 10,
                tags: 'close_popup',
                text: `<p class="ql-align-center"><span class="ql-size-large ql-font-Roboto" style="color: #FFFFFF">Close</span></p>`,
                top: 396,
                width: 82,
                widthStrategy: 'fixed',
            },
        ]),
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
})

export default RemixWrapper(Popup, Schema, 'Popup')
