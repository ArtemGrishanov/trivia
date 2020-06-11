import React from 'react'

import DataSchema from '../schema'
import * as defaultIcons from './icons'

export const DYNAMIC_CONTENT_PROP = 'dynamicContent'
export const ContentPropsList = {
    ICON_LIST: 'iconList',
}

const dynamicComponents = {
    [ContentPropsList.ICON_LIST]: ({ icons, vAlign, hAlign, vPadding, hPadding, gap }) => {
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
            <div style={{ position: 'absolute', backgroundColor: 'transparent', ...style }}>
                {icons.map((icon, i) => {
                    if (typeof icon.name !== 'string') {
                        return null
                    }
                    if (typeof icon.color !== 'string') {
                        delete icon.color
                    }

                    const Icon = defaultIcons[icon.name]

                    return Icon ? (
                        <Icon color={icon.color} style={i > 0 ? { marginLeft: `${gap}px` } : {}} key={i} />
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
