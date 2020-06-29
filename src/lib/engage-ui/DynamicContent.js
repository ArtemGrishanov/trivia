import React from 'react'

import DataSchema from '../schema'
import * as defaultIcons from './icons'

import { postMessage } from '../../lib/remix'

export const DYNAMIC_CONTENT_PROP = 'dynamicContent'
export const ContentPropsList = {
    ICON_LIST: 'iconList',
}

const dynamicComponents = {
    [ContentPropsList.ICON_LIST]: ({ icons, vAlign, hAlign, vPadding, hPadding, gap, payload }) => {
        const style = {
            padding: `${hPadding}px ${vPadding}px`,
        }

        if (hAlign === 'left' || hAlign === 'right') {
            style[hAlign] = '0'
        }

        if (vAlign === 'top' || hAlign === 'bottom') {
            style[vAlign] = '0'
        }

        function onClick(iconName, payload) {
            if (iconName === 'chainOption') {
                postMessage('request_data_layer', {
                    layer_type: 'personality_chain',
                    screen_id: payload.screen_id,
                    option_id: payload.option_id,
                })
            }
        }

        return (
            <div className="rmx-option-icons" style={style}>
                {icons.map((icon, i) => {
                    if (typeof icon.name !== 'string') {
                        return null
                    }

                    const Icon = defaultIcons[icon.name]

                    return Icon ? (
                        <div
                            className={`rmx-option-icons--item${icon.clickable ? ' clickable' : ''}`}
                            onClick={evt => (icon.clickable ? onClick(icon.name, payload) : evt.preventDefault())}
                            key={i}
                        >
                            <Icon style={i > 0 ? { marginLeft: `${gap}px` } : {}} />
                        </div>
                    ) : null
                })}
            </div>
        )
    },
}

const DynamicContent = ({ structure = {} }) => (
    <>
        {Object.entries(structure).map(([component, props]) => {
            const Component = dynamicComponents[component]

            if (Component) {
                return <Component {...props} key={component} />
            } else {
                return null
            }
        })}
    </>
)

export const Schemas = {
    [ContentPropsList.ICON_LIST]: new DataSchema({
        icons: {
            type: 'array',
            default: [],
        },
        vAlign: {
            type: 'string',
            enum: ['top', 'center', 'bottom'],
            default: 'top',
        },
        hAlign: {
            type: 'string',
            enum: ['left', 'center', 'right'],
            default: 'left',
        },
        vPadding: {
            type: 'number',
            min: 0,
            max: 128,
            default: 0,
        },
        hPadding: {
            type: 'number',
            min: 0,
            max: 128,
            default: 0,
        },
        gap: {
            type: 'number',
            min: 0,
            max: 64,
            default: 0,
        },
    }),
}

export default DynamicContent
