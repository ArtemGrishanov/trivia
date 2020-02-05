import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'

// https://github.com/zenoamaro/react-quill
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Text animation ideas https://tobiasahlin.com/moving-letters/

class Text extends React.Component {
    //({text, color, fontSize, backgroundColor, padding, fontShadow, fontShadowDistance, fontShadowColor, bold})

    static getDerivedStateFromProps(props, state) {
        if (props.animationOnAppearance !== state.animationOnAppearance) {
            return {
                ...state,
                stateText: props.text,
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
            stateText: props.text,
            animatedText: '',
            animationOnAppearance: 'none'
        }
        this.onMouseDown = this.onMouseDown.bind(this);
        this.handleChange = this.handleChange.bind(this)
    }

    onMouseDown() {
        console.log('text mousedown');
    }

    handleChange(value) {
        this.setState({ stateText: value })
        console.log('Content was updated:', value);
    }

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],        // toggled buttons
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'clean']
        ]
    }

    render() {
        const st = {
            // fontSize: this.props.fontSize+'px',
            // color: this.props.color,
            // backgroundColor: this.props.backgroundColor,
            padding: this.props.padding+'px',
            textAlign: 'initial'
        };
        if (this.props.fontShadow) {
            st.textShadow = `${this.props.fontShadowDistance}px ${this.props.fontShadowDistance}px 0px ${this.props.fontShadowColor}`;
        }
        if (this.props.bold) {
            st.fontWeight = 'bold';
        }
        const text = (this.props.animationOnAppearance === 'none') ? this.state.stateText: this.state.animatedText;
        return (
            <>
                {/* TODO use post html processor on the server or use a own parser here on UI */}
                {/* {!this.props.doubleClicked &&
                    <p className="rmx-component rmx-text" style={st} onMouseDown={this.onMouseDown} dangerouslySetInnerHTML={{__html: text}}></p>
                } */}
                {/* {this.props.doubleClicked &&
                    <div className="rmx-component">
                        <ReactQuill modules={this.modules}
                                    value={this.state.stateText}
                                    onChange={this.handleChange} />

                    </div>
                } */}
                    <div className="rmx-component">
                        <ReactQuill readOnly = {!this.props.doubleClicked}
                                    modules={this.modules}
                                    value={this.state.stateText}
                                    onChange={this.handleChange} />

                    </div>
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
    // 'editing': {
    //     serialize: 'false',
    //     type: 'boolean',
    //     default: false
    // },
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