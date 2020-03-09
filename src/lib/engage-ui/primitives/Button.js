import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import TextEditor from '../bricks/TextEditor';

class Button extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const st = {
            textAlign: 'initial'
        };
        return (
            <button className={`rmx-component rmx-button __${this.props.colorMod} __${this.props.sizeMod}`} style={st}>
                <TextEditor parentId={this.props.id} readOnly={!this.props.doubleClicked} text={this.props.text}></TextEditor>
            </button>
        )
    }
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    "text": {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
        default: 'Button text'
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

export default RemixWrapper(Button, Schema, 'Button')