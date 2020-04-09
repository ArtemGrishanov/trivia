import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import TextEditor from '../bricks/TextEditor'

class Button extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    getMarkup(props) {

        const {
            id,
            isArrow,
            arrowType,
            arrowDirection,
            arrowPosition,
            doubleClicked,
            dropShadow,
            sizeMod,
            text,
        } = props;

        const st = {
            textAlign: 'initial',
            boxSizing: 'border-box',
            borderStyle: 'solid',
            ...Object.fromEntries(
                ['borderRadius', 'borderWidth', 'borderColor', 'backgroundColor'].map(prop => {
                    const value = this.props[prop]

                    switch (typeof value) {
                        case 'number':
                            return [prop, `${value}px`]
                        default:
                            return [prop, value]
                    }
                }),
            ),
        }
        if (this.props.dropShadow) {
            st.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.5)'
        }

        return (
            <button className={`rmx-component rmx-button  __${this.props.sizeMod}`} style={st}>
                <div className="clipped">
                    <TextEditor
                        parentId={this.props.id}
                        readOnly={!this.props.doubleClicked}
                        text={this.props.text}
                    ></TextEditor>
                </div>
            </button>
        )
    }

    render() {
        return this.getMarkup(this.props);
    }

}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    text: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
        default: 'Button text',
    },
    sizeMod: {
        type: 'string',
        enum: ['small', 'normal'],
        default: 'normal',
    },
    borderRadius: {
        type: 'number',
        min: 0,
        max: 100,
        default: 0,
    },
    borderWidth: {
        type: 'number',
        min: 0,
        max: 400,
        default: 0,
    },
    borderColor: {
        type: 'string',
        default: '',
    },
    dropShadow: {
        type: 'boolean',
        default: false,
    },
    backgroundColor: {
        type: 'string',
        default: 'blue',
    },
    'isArrow': {
        type: 'boolean',
        default: false
    },
    'arrowType': {
        type: 'string',
        enum: ['triangle', 'thin', 'default'],
        default: 'default'
    },
    'arrowDirection': {
        type: 'string',
        enum: ['left', 'right'],
        default: 'right'
    },
    'arrowPosition': {
        type: 'string',
        enum: ['left', 'right', 'center'],
        default: 'center'
    },
    //TODO color format for strings, +tests
})

export default RemixWrapper(Button, Schema, 'Button')
