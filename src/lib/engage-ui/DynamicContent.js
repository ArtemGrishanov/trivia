import React from 'react'

import DataSchema from '../schema'
import * as defaultIcons from './icons'

import { fireEvent } from '../../lib/remix'

export const DYNAMIC_CONTENT_PROP = 'dynamicContent'
export const ContentPropsList = {
    ICON_LIST: 'iconList',
}

const dynamicComponents = {
    [ContentPropsList.ICON_LIST]: ({ icons, parentProps }) => {
        const filteredIcons = Object.values(icons).filter(el => typeof el.name === 'string')
        const clickableIcons = filteredIcons.filter(el => el.clickable)
        const simpleIcons = filteredIcons.filter(el => !el.clickable)

        return (
            <>
                <ul className="rmx-option-icons">
                    {simpleIcons.map((icon, index) => {
                        const Img = defaultIcons[icon.name]
                        return (
                            <li key={index}>
                                <Img />
                            </li>
                        )
                    })}
                </ul>
                <ul className="rmx-option-icons-clickable">
                    {clickableIcons.map((icon, index) => {
                        const Img = defaultIcons[icon.name]
                        return (
                            <li
                                key={index}
                                title={icon.title}
                                onClick={evt => fireEvent(icon.onClickEvent, { parentProps }) && evt.preventDefault()}
                            >
                                <div className="prevent-layout-click icon-clickable-zone"></div>
                                <Img />
                            </li>
                        )
                    })}
                </ul>
            </>
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
