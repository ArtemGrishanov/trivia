import React from 'react'

import DataSchema from '../schema'
import * as defaultIcons from './icons'

import { fireEvent } from '../../lib/remix'

export const DYNAMIC_CONTENT_PROP = 'dynamicContent'
export const ContentPropsList = {
    ICON_LIST: 'iconList',
}

const dynamicComponents = {
    [ContentPropsList.ICON_LIST]: ({ icons, vAlign, hAlign, vPadding, hPadding, gap, parentProps }) => {
        const style = {
            padding: `${hPadding}px ${vPadding}px`,
        }

        if (hAlign === 'left' || hAlign === 'right') {
            style[hAlign] = '0'
        }

        if (vAlign === 'top' || hAlign === 'bottom') {
            style[vAlign] = '0'
        }

        return (
            <div className="rmx-option-icons" style={style}>
                {Object.entries(icons).map(([key, icon], i) => {
                    if (typeof icon.name !== 'string') {
                        return null
                    }

                    const Icon = defaultIcons[icon.name]

                    return Icon ? (
                        <div
                            className={`rmx-option-icons--item${icon.clickable ? ' clickable' : ''}`}
                            onClick={evt =>
                                icon.clickable ? fireEvent(icon.onClickEvent, { parentProps }) : evt.preventDefault()
                            }
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

const DynamicContent = ({ structure = {}, parentProps }) => (
    <>
        {Object.entries(structure).map(([component, props]) => {
            const Component = dynamicComponents[component]

            if (Component) {
                return <Component {...props} key={component} parentProps={parentProps} />
            } else {
                return null
            }
        })}
    </>
)

export const Schemas = {
    [ContentPropsList.ICON_LIST]: new DataSchema({
        icons: {
            type: 'object',
            default: {},
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
