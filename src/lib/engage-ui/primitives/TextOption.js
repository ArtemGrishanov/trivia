import '../style/rmx-options.css'
import React from 'react'
import DataSchema from '../../schema'
import CorrectIcon from './CorrectIcon';
import RemixWrapper from '../RemixWrapper';

class TextOption extends React.Component {

    static getDerivedStateFromProps(props, state) {
        return state;
    }

    constructor(props) {
        super(props);
        this.state = {
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {

    }

    render() {
        const st = {
            borderRadius: this.props.borderRadius+'px',
            textAlign: this.props.textAlign
        }
        const pbActive = {
            width: this.props.percent+'%'
        }
        const withIndic = this.props.correctIndicator !== 'none';
        const withPercent = this.props.percent > 0;
        return (
            <div className={'rmx-component rmx-option' + (withIndic ? ' withIndic': '') + (withPercent ? ' withPercent': '')} style={st}>
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
                {this.props.text}
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
    }
});

export default RemixWrapper(TextOption, Schema, 'TextOption')