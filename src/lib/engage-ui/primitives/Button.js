import React from 'react'
import DataSchema from '../../schema'
import PropsNormalizer from '../PropsNormalizer'

function Button({text="Button title", colorMod = "blue", sizeMod = "normal"}) {
    return <button className={`rmx-button __${colorMod} __${sizeMod}`}>{text}</button>
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    "text": {
        type: 'string',
        minLength: 1,
        maxLength: 128,
        default: 'Default button title'
    },
    "sizeMod": {
        type: 'string',
        enum: ['small', 'normal'],
        default: 'normal'
    },
    "colorMod": {
        type: 'string',
        enum: ['blue','white'],
        default: 'blue'
    }
    //TODO color format for strings, +tests
});

export default PropsNormalizer(Button, Schema);