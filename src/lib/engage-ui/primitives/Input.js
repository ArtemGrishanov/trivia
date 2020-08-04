import React from 'react'
import { setComponentProps } from '../../remix'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import { getTranslation } from '../translations'

import '../style/rmx-input.css'

class Input extends React.Component {
    static validator = (type, value) => {
        const helpData = {
            email: {
                pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                errMsg: getTranslation('invalid_email'),
            },
            phone: {
                pattern: /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm,
                errMsg: getTranslation('invalid_phone'),
            },
        }

        if (!(type in helpData)) {
            return { isError: false }
        }

        const result = value.match(helpData[type].pattern)

        if (result === null || result.join('') !== value) {
            return { isError: true, msg: helpData[type].errMsg }
        } else {
            return { isError: false }
        }
    }

    state = {
        focused: false,
        result: { isError: false, msg: '' },
    }

    setFocus = value => this.setState({ ...this.state, focused: value })

    setResult = value => this.setState({ ...this.state, result: value })

    setValueDefault = value => {
        const { id } = this.props

        setComponentProps(
            {
                id,
                value,
            },
            { putStateHistory: true },
        )
    }

    render() {
        const {
            doubleClicked,
            dataType,
            dataSize,
            description,
            width,
            height,
            setValue = this.setValueDefault,
        } = this.props
        const { focused, result } = this.state

        const descriptionStyle = {
            color: '#787878',
            fontSize: '14px',
            marginBottom: '6px',
        }

        const inputStyle = {
            borderStyle: 'solid',
            backgroundColor: 'transparent',
            borderRadius: '4px',
            fontSize: '16px',
            fontColor: '#3c3c3c',
            fontFamily: 'Ubuntu',
            ...(focused
                ? { borderWidth: '2px', borderColor: '#69b1fc', caretColor: '#69b1fc' }
                : result.isError
                ? { borderWidth: '1px', borderColor: '#FF5656', caretColor: '#FF5656' }
                : { borderWidth: '1px', borderColor: '#979797', caretColor: '#979797' }),
        }

        return (
            <div className="remix-input" style={{ width: `${width}px`, height: `${height}px` }}>
                {description.length ? <span style={descriptionStyle}>{description}</span> : null}
                <input
                    type="text"
                    style={inputStyle}
                    onFocus={() => this.setFocus(true)}
                    onBlur={event => {
                        this.setFocus(false)
                    }}
                    onChange={event => {
                        const result = Input.validator(dataType, event.target.value)
                        this.setResult(result)

                        if (!result.isError) {
                            setValue(event.target.value)
                        }
                    }}
                    max={dataSize}
                    readOnly={doubleClicked}
                />
                <p className="remix-input__msg">{result.isError ? result.msg : ''}</p>
            </div>
        )
    }
}

export const schema = {
    dataType: {
        type: 'string',
        enum: ['any', 'phone', 'email'],
        default: 'any',
    },
    dataSize: {
        type: 'number',
        min: 1,
        max: 128,
        default: 128,
    },
    description: {
        type: 'string',
        minLength: 0,
        maxLength: 32,
        default: '',
    },
    value: {
        type: 'string',
        default: '',
    },
}

export { Input }

export const Schema = new DataSchema(schema)

export default RemixWrapper(Input, Schema, 'Input')
