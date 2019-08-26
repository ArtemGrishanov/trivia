import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'

function Text({text, color, fontSize}) {
    const st = {
        fontSize: fontSize+'px',
        color: color
    };
    return <p className="rmx-text" style={st}>{text}</p>
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    "text": {
        type: 'string',
        minLength: 1,
        maxLength: 1024,
        default: 'Some text'
    },
    "fontSize": {
        type: 'number',
        min: 8,
        max: 80,
        default: 14
    },
    "color": {
        type: 'string',
        default: '#333'
    }
});

export default RemixWrapper(Text, Schema, 'Text')