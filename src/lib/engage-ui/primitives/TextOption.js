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
            stateText: props.text
        };
        this.onOptionTextEdited = this.onOptionTextEdited.bind(this);
    }

    onOptionTextEdited(value) {
        this.setState({
            stateText: value
        });
        if (this.props.editable) {
            setComponentProps(null, this.props.id, {text: value});
        }
    }

    render() {
        const st = {
            borderRadius: this.props.borderRadius+'px',
            textAlign: this.props.textAlign,
            backgroundColor: this.props.backgroundColor
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
            <div className='rmx-component'>
                <div className={'rmx-option' + (withIndic ? ' withIndic': '') + (withPercent ? ' withPercent': '')} style={st}>
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
                    <TextEditor readOnly={!this.props.doubleClicked} onChange={this.onOptionTextEdited} text={this.state.stateText}></TextEditor>
                </div>
            </div>
        )
    }
}

export const Schema = new DataSchema({
    'text': {
        type: 'string',
        minLength: 1,
        maxLength: 1000,
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
    'backgroundColor': {
        type: 'string',
        default: ''
    },
    'imageSrc': {
        type: 'string',
        default: ''
    }
});

export default RemixWrapper(TextOption, Schema, 'TextOption')