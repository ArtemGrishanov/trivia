/*IFTRUE_useTextOption*/
import '../style/rmx-options.css'
import React, { useState } from 'react'
import DataSchema from '../../schema'
import CorrectIcon from './CorrectIcon'
import TextEditor from '../bricks/TextEditor'
import RemixWrapper from '../RemixWrapper'
import BasicImage from '../bricks/BasicImage'
import DynamicContent, { DYNAMIC_CONTENT_PROP } from '../DynamicContent'

class TextOption extends React.Component {
    static getDerivedStateFromProps(props, state) {
        return state
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { id, doubleClicked, text, correctIndicator, dropShadow, align, blur, grayscale } = this.props

        const alignSt = {
            display: 'flex',
            justifyContent: align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end',
            alignItems: 'center',
            padding: '0 20px',
        }

        const st = {
            boxSizing: 'border-box',
            borderStyle: 'solid',
            ...Object.fromEntries(
                ['borderRadius', 'borderWidth', 'borderColor', 'backgroundColor', 'textAlign'].map(prop => {
                    const value = this.props[prop]

                    switch (typeof value) {
                        case 'number':
                            return [prop, `${value}px`]
                        default:
                            return [prop, value]
                    }
                }),
            ),
            ...(doubleClicked ? {} : alignSt),
        }

        if (dropShadow) {
            st.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.5)'
        }
        if (doubleClicked) {
            // in edit mode we must see a TextEditor toolbars
            st.overflow = 'visible'
        }
        // const pbActive = {
        //     width: this.props.percent + '%',
        // }
        // const withIndic = this.props.correctIndicator !== 'none'
        // const withPercent = this.props.percent > 0

        return (
            <div className="rmx-component rmx-pointer">
                <div className={`clipped`} style={st}>
                    {/* <div className="rmx-option" style={st}> */}
                    {this.props.imageSrc && (
                        <div className="rmx-option_backimg_wr">
                            <BasicImage
                                width={this.props.width}
                                height={this.props.height}
                                src={this.props.imageSrc}
                                backgroundSize={'cover'}
                                blur={blur}
                                grayscale={grayscale}
                                borderRadius={this.props.borderRadius}
                                borderColor={this.props.borderColor}
                                borderWidth={this.props.borderWidth}
                            ></BasicImage>
                        </div>
                    )}
                    {/* {this.props.percent > 0 && (
                        <div className="rmx-percent_info">
                            <div className="rmx-pb_wr">
                                <div
                                    className={'rmx-option-pb __' + this.props.correctIndicator}
                                    style={pbActive}
                                ></div>
                            </div>
                            <p className={'rmx-option-pct __' + this.props.correctIndicator}>
                                {this.props.percent + '%'}
                            </p>
                        </div>
                    )} */}
                    {doubleClicked ? null : <Icon name={correctIndicator} align={align} />}
                    <TextEditor parentId={id} readOnly={!doubleClicked} text={text} />
                    {this.props[DYNAMIC_CONTENT_PROP] ? (
                        <DynamicContent structure={this.props[DYNAMIC_CONTENT_PROP]} />
                    ) : null}
                </div>
                {/* </div> */}
            </div>
        )
    }
}

const Icon = ({ name, align }) => {
    const [isHover, setIsHover] = useState(false)

    const Normal = icons[name]
    const Hover = icons[name + '_hover']

    const st = {
        cursor: 'pointer',
        [align === 'right' ? 'marginLeft' : 'marginRight']: `12px`,
        order: align === 'right' ? 1 : 0,
        minWidth: '24px',
        minHeight: '24px',
        position: 'relative',
    }

    return Normal ? (
        isHover && Hover ? (
            <Hover style={st} onMouseLeave={() => setIsHover(false)} />
        ) : (
            <Normal style={st} onMouseEnter={() => setIsHover(true)} />
        )
    ) : null
}

const icons = {
    unchecked: props => (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
                stroke="#979797"
                strokeWidth="2"
            />
        </svg>
    ),
    unchecked_hover: props => (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
                stroke="#787878"
                strokeWidth="2"
            />
        </svg>
    ),
    checked: props => (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
                stroke="#2990FB"
                strokeWidth="2"
            />
            <path
                transform="translate(6,6)"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12Z"
                fill="#2990FB"
            />
        </svg>
    ),
    correct: props => (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                fill="#65BB5A"
            />
            <path
                d="M5.84277 12L11 17L18.5347 7.75928"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    wrong: props => (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                fill="#FF5656"
            />
            <path d="M7 7L17 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 7L7 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
}

export const Schema = new DataSchema({
    text: {
        type: 'string',
        minLength: 0,
        maxLength: 4096,
        default: '',
    },
    correctIndicator: {
        type: 'string',
        enum: ['none', 'unchecked', 'checked', 'correct', 'wrong'],
        default: 'none',
    },
    // percent: {
    //     type: 'number',
    //     min: 0,
    //     max: 100,
    //     default: 0,
    // },
    blur: {
        type: 'boolean',
        default: false,
    },
    grayscale: {
        type: 'boolean',
        default: false,
    },
    textAlign: {
        type: 'string',
        enum: ['left', 'center', 'right'],
        default: 'left',
    },
    align: {
        type: 'string',
        enum: ['left', 'center', 'right'],
        default: 'center',
    },
    borderRadius: {
        type: 'number',
        min: 0,
        max: 100,
        default: 4,
    },
    borderWidth: {
        type: 'number',
        min: 0,
        max: 400,
        default: 1,
    },
    borderColor: {
        type: 'string',
        default: '#d8d8d8',
    },
    dropShadow: {
        type: 'boolean',
        default: false,
    },
    backgroundColor: {
        type: 'string',
        default: '',
    },
    imageSrc: {
        type: 'string',
        default: '',
    },
})

export default RemixWrapper(TextOption, Schema, 'TextOption')
/*FITRUE_useTextOption */
