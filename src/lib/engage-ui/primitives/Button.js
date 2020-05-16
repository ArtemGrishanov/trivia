import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import TextEditor from '../bricks/TextEditor'
import Arrow from '../bricks/Arrow'
import * as icons from '../icons'

class Button extends React.Component {
    static primaryDefaultStyle = {
        color: '#FFFFFF',
    }

    static secondaryLightDefaultStyle = {
        backgroundColor: '#FFFFFF',
        borderWidth: '1px',
        borderColor: '#D8D8D8',
        color: '#787878',
    }

    static replaceDefaultStyle(styleVariant, style) {
        const defaultStyle = this[styleVariant + 'DefaultStyle']
        if (defaultStyle === void 0) {
            return style
        }

        const replacedStyle = { ...style }

        for (const key in defaultStyle) {
            if (key in schm) replacedStyle[key] = style[key] === schm[key].default ? defaultStyle[key] : style[key]
            else replacedStyle[key] = defaultStyle[key]
        }

        return replacedStyle
    }

    constructor(props) {
        super(props)
        this.state = { isHover: false }
    }

    getMarkup(props) {
        const {
            id,
            isArrow,
            arrowType,
            arrowDirection,
            arrowPosition,
            arrowColor,
            doubleClicked,
            dropShadow,
            sizeMod,
            text,
            iconName,
            iconColor,
            iconColorHover,
            iconPosition,
            iconGap,
            openUrl,
            styleVariant,
        } = props

        const st = Button.replaceDefaultStyle(styleVariant, {
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
        })

        const arrowPositionOptions = {
            right: '80%',
            left: '20%',
            center: '50%',
        }

        const arrowSt = {
            position: 'absolute',
            top: '50%',
            left: arrowPosition ? arrowPositionOptions[arrowPosition] : '50%',
            transform: 'translate(-50%, -50%)',
        }

        if (dropShadow) {
            st.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.5)'
        }

        // Delete inline background-color style,
        if (isArrow) {
            delete st.backgroundColor
        }

        return (
            <button
                className={`rmx-component rmx-button ${isArrow ? '__with-arrow' : ''}  __${sizeMod} ${styleVariant}`}
                style={st}
                onClick={() => openUrl && window.open(openUrl.includes('://') ? openUrl : '//' + openUrl)}
                onMouseLeave={() => this.setState({ ...this.state, isHover: false })}
                onMouseEnter={() => this.setState({ ...this.state, isHover: true })}
            >
                <div className={`clipped ${doubleClicked ? '' : 'align-center'}`}>
                    {doubleClicked ? null : (
                        <Icon
                            color={this.state.isHover ? iconColorHover : iconColor}
                            name={iconName}
                            position={iconPosition}
                            gap={iconGap}
                        />
                    )}
                    {isArrow && <Arrow type={arrowType} direction={arrowDirection} st={arrowSt} color={arrowColor} />}
                    {text.length ? <TextEditor parentId={id} readOnly={!doubleClicked} text={text} /> : null}
                </div>
            </button>
        )
    }

    render() {
        return this.getMarkup(this.props)
    }
}

const Icon = ({ name, position, gap, color }) => {
    const Icn = icons[name]

    const st = {
        [position === 'left' ? 'marginRight' : 'marginLeft']: `${gap}px`,
        order: position === 'left' ? 0 : 1,
    }

    return Icn ? <Icn style={st} color={color} /> : null
}

const schm = {
    text: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
        default: '',
    },
    styleVariant: {
        type: 'string',
        enum: ['none', 'primary', 'secondary', 'secondaryLight', 'icon'],
        default: 'none',
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
        default: '',
    },
    isArrow: {
        type: 'boolean',
        default: false,
    },
    arrowType: {
        type: 'string',
        enum: ['triangle', 'thin', 'default'],
        default: 'default',
    },
    arrowDirection: {
        type: 'string',
        enum: ['left', 'right'],
        default: 'right',
    },
    arrowPosition: {
        type: 'string',
        enum: ['left', 'right', 'center'],
        default: 'center',
    },
    arrowColor: {
        type: 'string',
        default: '#fff',
    },
    iconName: {
        type: 'string',
        default: '',
    },
    iconColor: {
        type: 'string',
        default: '',
    },
    iconColorHover: {
        type: 'string',
        default: '',
    },
    iconPosition: {
        type: 'string',
        enum: ['left', 'right'],
        default: 'left',
    },
    iconGap: {
        type: 'number',
        min: 0,
        max: 20,
        default: 10,
    },
    openUrl: {
        type: 'string',
        maxLength: 1024,
        default: '',
    },
    //TODO color format for strings, +tests
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema(schm)

export default RemixWrapper(Button, Schema, 'Button')
