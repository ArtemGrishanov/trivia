import '../style/rmx-options.css'
import React from 'react'
import DataSchema from '../../schema'
import CorrectIcon from './CorrectIcon';
import TextEditor from '../bricks/TextEditor';
import RemixWrapper from '../RemixWrapper';
import BasicImage from '../bricks/BasicImage';

class TextOption extends React.Component {

    static getDerivedStateFromProps(props, state) {
        return state;
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const st = {
                boxSizing: 'border-box',
                borderStyle: 'solid',
                ...Object.fromEntries(
                    ['borderRadius', 'borderWidth', 'borderColor', 'backgroundColor', 'textAlign']
                        .map(prop => {
                            const value = this.props[prop]

                            switch (typeof value) {
                                case 'number':
                                    return [prop, `${value}px`];
                                default:
                                    return [prop, value];
                            }
                        })
                )
            };
        if (this.props.dropShadow) {
            st.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.5)';
        }
        if (this.props.doubleClicked) {
            // in edit mode we must see a TextEditor toolbars
            st.overflow = 'visible';
        }
        const pbActive = {
            width: this.props.percent+'%'
        }
        const withIndic = this.props.correctIndicator !== 'none';
        const withPercent = this.props.percent > 0;
        return (
            <div className='rmx-component' >
                <div className='clipped' style={st}>
                    <div className={'rmx-option' + (withIndic ? ' withIndic': '') + (withPercent ? ' withPercent': '')}>
                        {this.props.imageSrc &&
                            <div className='rmx-option_backimg_wr'>
                                <BasicImage width={this.props.width} height={this.props.height} src={this.props.imageSrc} backgroundSize={'cover'}></BasicImage>
                            </div>
                        }
                        {this.props.percent > 0 &&
                            <div className='rmx-percent_info'>
                                <div className='rmx-pb_wr'>
                                    <div className={'rmx-option-pb __' + this.props.correctIndicator} style={pbActive}></div>
                                </div>
                                <p className={'rmx-option-pct __' + this.props.correctIndicator}>
                                    {this.props.percent+'%'}
                                </p>
                            </div>
                        }
                        {this.props.correctIndicator !== 'none' &&
                            <div className={'rmx-option_indicator ' + (withPercent ? 'withPercent': '')}>
                                <CorrectIcon left={0} top={0} width={24} height={24} mod={this.props.correctIndicator}/>
                            </div>
                        }
                        <TextEditor parentId={this.props.id} readOnly={!this.props.doubleClicked} text={this.props.text}></TextEditor>
                    </div>
                </div>
            </div>
        )
    }
}

export const Schema = new DataSchema({
    'text': {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
        default: 'input text'
    },
    'correctIndicator': {
        type: 'string',
        enum: ['none', 'empty', 'correct', 'wrong', 'wrong_gray'],
        default: 'none'
    },
    'percent': {
        type: 'number',
        min: 0,
        max: 100,
        default: 0
    },
    'textAlign': {
        type: 'string',
        enum: ['left','center','right'],
        default: 'left'
    },
    'borderRadius': {
        type: 'number',
        min: 0,
        max: 100,
        default: 4
    },
    'borderWidth': {
        type: 'number',
        min: 0,
        max: 400,
        default: 1
    },
    'borderColor': {
        type: 'string',
        default: '#d8d8d8'
    },
    'dropShadow': {
        type: 'boolean',
        default: false
    },
    'backgroundColor': {
        type: 'string',
        default: ''
    },
    'imageSrc': {
        type: 'string',
        default: ''
    },

});

export default RemixWrapper(TextOption, Schema, 'TextOption')