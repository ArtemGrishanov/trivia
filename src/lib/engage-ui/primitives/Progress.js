import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'

class Progress extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    getTemplate = () => {
        const {
            variant,
            step,
            max,
            backgroundFilledLine,
            backgroundLine,
            fontSize,
            color,
            borderRadius,
            borderWidth,
            borderColor,
            progressText,
        } = this.props
        switch (variant) {
            case 'variant1': {
                const percent = +(step / max).toFixed(2) * 100
                return (
                    <div style={{ width: '100%' }}>
                        <div style={{ marginBottom: 8, textAlign: 'left', fontSize, color }}>
                            {progressText} {percent}%
                        </div>
                        <div
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                borderStyle: 'solid',
                                borderRadius,
                                borderWidth,
                                borderColor,
                                background: backgroundLine,
                            }}
                        >
                            <div
                                style={{
                                    width: `${percent}%`,
                                    backgroundColor: backgroundFilledLine,
                                    height: 8,
                                    borderRadius,
                                }}
                            ></div>
                        </div>
                    </div>
                )
            }
            case 'variant0':
            default: {
                const st = {
                    fontSize,
                    color,
                }
                const text = this.props.step + '/' + this.props.max
                return (
                    <p className="rmx-text" style={st}>
                        {text}
                    </p>
                )
            }
        }
    }

    render() {
        let template = this.getTemplate()
        return template
    }
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    variant: {
        type: 'string',
        enum: ['variant0', 'variant1'],
        default: 'variant0',
    },
    progressText: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
        default: 'Progress:',
    },
    width: {
        type: 'number',
        min: 1,
        max: 1000,
        default: 32,
    },
    height: {
        type: 'number',
        min: 1,
        max: 1000,
        default: 25,
    },
    step: {
        type: 'number',
        min: 1,
        max: 1000,
        default: 1,
    },
    max: {
        type: 'number',
        min: 1,
        max: 1000,
        default: 10,
    },
    fontSize: {
        type: 'number',
        min: 8,
        max: 80,
        default: 14,
    },
    color: {
        type: 'string',
        default: '#3C3C3C',
    },
    backgroundLine: {
        type: 'string',
        default: 'linear-gradient(180deg, #D8D8D8 0%, #EEEEEE 100%)',
    },
    backgroundFilledLine: {
        type: 'string',
        default: '#2990FB',
    },
    borderRadius: {
        type: 'number',
        min: 0,
        max: 100,
        default: 16,
    },
    borderWidth: {
        type: 'number',
        min: 0,
        max: 100,
        default: 0,
    },
    borderColor: {
        type: 'string',
        default: '',
    },
})

export default RemixWrapper(Progress, Schema, 'Progress')
