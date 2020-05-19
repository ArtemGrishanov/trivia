import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import TextEditor from '../bricks/TextEditor'
import { CompletionIcon } from '../icons'
import '../style/rmx-progress.css'

/**
 *
 * @param {object} props
 * @param {string} props.color
 * @param {string} props.completionColor
 * @param {boolean} props.isFirst
 * @param {boolean} props.isLast
 * @param {boolean} props.isCompleted
 */
function ProgressArrowItem({
    color = '#D8D8D8',
    completionColor = '#69B1FC',
    isFirst = false,
    isLast = false,
    isCompleted = false,
}) {
    const backgroundColor = isCompleted ? completionColor : color
    let className = 'progress-variant-2__arrow'

    if (isFirst) {
        className += ' progress-variant-2__arrow_first'
    } else if (isLast) {
        className += ' progress-variant-2__arrow_last'
    }

    return (
        <div className={className} style={{ backgroundColor }}>
            {isCompleted && <CompletionIcon className="progress-variant-2__completed-icon" />}
        </div>
    )
}

/**
 *
 * @param {object} props
 * @param {number} props.radius
 * @param {string} props.color
 * @param {string} props.completionColor
 * @param {boolean} props.isCompleted
 */
function ProgressDotItem({ radius = 6, color = '#C4C4C4', completionColor = '#2990FB', isCompleted = false }) {
    const backgroundColor = isCompleted ? completionColor : color
    return <div className="progress-variant-3__dot" style={{ width: radius, height: radius, backgroundColor }} />
}

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
            completionBackground,
            background,
            fontSize,
            color,
            borderRadius,
            borderWidth,
            borderColor,
            dotSize,
            text,
            doubleClicked,
            id,
        } = this.props
        switch (variant) {
            case 'variant1': {
                const percent = +(step / max).toFixed(2) * 100
                const resultText = text
                    .replace(/<([^>]+)>/gi, '')
                    .replace(/\d+%/gi, '')
                    .trim()
                return (
                    <div className="progress-variant-1">
                        <div style={{ marginBottom: 8, textAlign: 'left', fontSize, color }}>
                            <TextEditor parentId={id} readOnly={!doubleClicked} text={resultText + ` ${percent}%`} />
                        </div>
                        <div
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                borderStyle: 'solid',
                                borderRadius,
                                borderWidth,
                                borderColor,
                                background,
                            }}
                        >
                            <div
                                style={{
                                    width: `${percent}%`,
                                    backgroundColor: completionBackground,
                                    height: 8,
                                    borderRadius,
                                }}
                            ></div>
                        </div>
                    </div>
                )
            }
            case 'variant2': {
                return (
                    <div className="progress-variant-2">
                        {new Array(max).fill('').map((_, index) => {
                            const isFirst = index === 0
                            const isLast = index === max - 1
                            const isCompleted = index < step
                            return (
                                <ProgressArrowItem
                                    key={index}
                                    color={background}
                                    completionColor={completionBackground}
                                    isFirst={isFirst}
                                    isLast={isLast}
                                    isCompleted={isCompleted}
                                />
                            )
                        })}
                    </div>
                )
            }
            case 'variant3': {
                return (
                    <div className="progress-variant-3">
                        {new Array(max).fill('').map((_, index) => {
                            const isCompleted = index < step
                            return (
                                <ProgressDotItem
                                    key={index}
                                    color={background}
                                    radius={dotSize}
                                    completionColor={completionBackground}
                                    isCompleted={isCompleted}
                                />
                            )
                        })}
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
    text: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
        default: 'Progress:',
    },
    variant: {
        type: 'string',
        enum: ['variant0', 'variant1', 'variant2', 'variant3'],
        default: 'variant0',
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
    background: {
        type: 'string',
        default: '#D8D8D8',
    },
    completionBackground: {
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
    dotSize: {
        type: 'number',
        min: 1,
        max: 100,
        default: 6,
    },
})

export default RemixWrapper(Progress, Schema, 'Progress')
