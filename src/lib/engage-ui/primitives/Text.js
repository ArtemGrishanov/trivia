import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import CKEditor from '@ckeditor/ckeditor5-react';
//TODO try import @ckeditor/ckeditor5-build-balloon
import BaloonEditor from '@ckeditor/ckeditor5-build-balloon-block';

// Text animation ideas https://tobiasahlin.com/moving-letters/

class Text extends React.Component {
    //({text, color, fontSize, backgroundColor, padding, fontShadow, fontShadowDistance, fontShadowColor, bold})

    static getDerivedStateFromProps(props, state) {
        if (props.animationOnAppearance !== state.animationOnAppearance) {
            return {
                ...state,
                animatedText: '',
                animationOnAppearance: props.animationOnAppearance
            }
        }
        return {
            ...state
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            animatedText: '',
            animationOnAppearance: 'none'
        }
        this.onMouseDown = this.onMouseDown.bind(this);
    }

    onMouseDown() {
        console.log('text mousedown');
    }

    render() {
        const st = {
            fontSize: this.props.fontSize+'px',
            color: this.props.color,
            backgroundColor: this.props.backgroundColor,
            padding: this.props.padding+'px'
        };
        if (this.props.fontShadow) {
            st.textShadow = `${this.props.fontShadowDistance}px ${this.props.fontShadowDistance}px 0px ${this.props.fontShadowColor}`;
        }
        if (this.props.bold) {
            st.fontWeight = 'bold';
        }
        const text = (this.props.animationOnAppearance === 'none') ? this.props.text: this.state.animatedText;
        // return <p className="rmx-text" style={st}>{text}</p>
        return (
            <>
                {!this.props.editing &&
                    <p className="rmx-component rmx-text" style={st} onMouseDown={this.onMouseDown}>{text}</p>
                }
                {this.props.editing &&
                    <div className="rmx-component rmx-text" style={st}>
                        <CKEditor
                            //LayoutItem UI blocks CKEditor UI
                            //TODO set changed text to the remix store
                            editor={ BaloonEditor }
                            data={ text }
                            onInit={ editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log( 'Editor is ready to use!', editor );
                            } }
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                console.log( { event, editor, data } );
                            } }
                            onBlur={ ( event, editor ) => {
                                console.log( 'Blur.', editor );
                            } }
                            onFocus={ ( event, editor ) => {
                                console.log( 'Focus.', editor );
                            } }
                        />
                    </div>
                }
            </>
        )
    }

    componentDidMount() {
        if (this.props.animationOnAppearance === 'typing' && this.state.animatedText === '') {
            this.runTypingAnimation();
        }
    }

    componentDidUpdate() {
        if (this.props.animationOnAppearance === 'typing' && this.state.animatedText === '') {
            this.runTypingAnimation();
        }
    }

    runTypingAnimation() {
        const intr = setInterval( (() => {
            if (this.state.animatedText.length >= this.props.text) {
                this.setState({
                    animatedText: this.props.text
                });
                intr.clearInterval();
            }
            this.setState({
                animatedText: this.props.text.substring(0, this.state.animatedText.length+1)
            });
        }).bind(this), 200);
    }
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    'editing': {
        serialize: 'false',
        type: 'boolean',
        default: false
    },
    'text': {
        type: 'string',
        minLength: 1,
        maxLength: 1024,
        default: 'Some text'
    },
    'fontSize': {
        type: 'number',
        min: 8,
        max: 80,
        default: 14
    },
    'color': {
        type: 'string',
        default: '#333'
    },
    'backgroundColor': {
        type: 'string',
        default: ''
    },
    'padding': {
        type: 'number',
        min: 0,
        max: 100,
        default: 0
    },
    'fontShadow': {
        type: 'boolean',
        default: false
    },
    'fontShadowColor': {
        type: 'string',
        default: 'rgba(0,0,0,0.2)'
    },
    'fontShadowDistance': {
        type: 'number',
        default: 3,
        min: 0,
        max: 100
    },
    'bold': {
        type: 'boolean',
        default: false
    },
    'animationOnAppearance': {
        type: 'string',
        enum: ['none', 'typing'],
        default: 'none'
    }
});

export default RemixWrapper(Text, Schema, 'Text')