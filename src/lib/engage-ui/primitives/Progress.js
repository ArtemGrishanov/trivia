import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import { CompletionIcon } from '../icons'
import '../style/rmx-progress.css'
/**
 *
 * @param {object} props
 * @param {number} props.height
 * @param {number} props.width
 * @param {string} props.color
 * @param {string} props.completionColor
 * @param {boolean} props.isFirst
 * @param {boolean} props.isLast
 * @param {boolean} props.isCompleted
 */
function ProgressArrowItem({
    height = 16,
    width = 125,
    color = '#D8D8D8',
    completionColor = '#69B1FC',
    isFirst = false,
    isLast = false,
    isCompleted = false,
}) {
    const fillColor = isCompleted ? completionColor : color
    const completedIcon = (
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1 3.21238L4.53363 6.99995L10.1572 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
    const firstItem = (
        <svg width={width} height={height} viewBox="0 0 125 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 8C0 3.58172 3.58172 0 8 0H120L125 8L120 16H8C3.58172 16 0 12.4183 0 8Z" fill={fillColor} />
        </svg>
    )
    const middleItem = (
        <svg width={width} height={height} viewBox="0 0 125 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H120L125 8L120 16H0L5 8L0 0Z" fill={fillColor} />
        </svg>
    )
    const lastItem = (
        <svg width={width} height={height} viewBox="0 0 120 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M112 0H0L5 8L0 16H112C116.418 16 120 12.4183 120 8C120 3.58172 116.418 0 112 0Z"
                fill={fillColor}
            />
        </svg>
    )

    let progressItem = middleItem

    if (isFirst) {
        progressItem = firstItem
    }

    if (isLast) {
        progressItem = lastItem
    }

    return (
        <div className="progress-arrow__item-wrapper" style={{ width, height }}>
            {progressItem}
            {isCompleted && (
                <div className="progress-arrow__item">
                    <CompletionIcon />
                </div>
            )}
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
    return <div className="progress-dot__item" style={{ width: radius, height: radius, backgroundColor }} />
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
            completedBackground,
            background,
            fontSize,
            color,
            borderRadius,
            borderWidth,
            borderColor,
            progressText,
            dotSize,
        } = this.props
        switch (variant) {
            case 'variant1': {
                const percent = +(step / max).toFixed(2) * 100
                return (
                    <div>
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
                                background,
                            }}
                        >
                            <div
                                style={{
                                    width: `${percent}%`,
                                    backgroundColor: completedBackground,
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
                    <div>
                        {new Array(max).fill('').map((_, index) => {
                            const isFirst = index === 0
                            const isLast = index === max - 1
                            const isCompleted = index < step
                            return (
                                <ProgressArrowItem
                                    key={index}
                                    fill={background}
                                    completedFill={completedBackground}
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
                    <div>
                        {new Array(max).fill('').map((_, index) => {
                            const isCompleted = index < step
                            return (
                                <ProgressDotItem
                                    key={index}
                                    fill={background}
                                    radius={dotSize}
                                    completedFill={completedBackground}
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
    variant: {
        type: 'string',
        enum: ['variant0', 'variant1', 'variant2', 'variant3'],
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
    background: {
        type: 'string',
        default: '#D8D8D8',
    },
    completedBackground: {
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
