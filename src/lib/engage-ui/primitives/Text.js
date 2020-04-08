import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import TextEditor from '../bricks/TextEditor'

// Text animation ideas https://tobiasahlin.com/moving-letters/

class Text extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.animationOnAppearance !== state.animationOnAppearance) {
      return {
        ...state,
        animatedText: '',
        animationOnAppearance: props.animationOnAppearance,
      }
    }
    return {
      ...state,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      animatedText: '',
      animationOnAppearance: 'none',
    }
  }

  render() {
    const st = {
      // fontSize: this.props.fontSize+'px',
      // color: this.props.color,
      // backgroundColor: this.props.backgroundColor,
      textAlign: 'initial',
    }
    if (this.props.fontShadow) {
      st.textShadow = `${this.props.fontShadowDistance}px ${this.props.fontShadowDistance}px 0px ${this.props.fontShadowColor}`
    }
    //const text = (this.props.animationOnAppearance === 'none') ? this.state.stateText: this.state.animatedText;
    return (
      <div className="rmx-component" style={st}>
        <div className="clipped">
          <TextEditor parentId={this.props.id} readOnly={!this.props.doubleClicked} text={this.props.text}></TextEditor>
        </div>
      </div>
    )
  }

  componentDidMount() {
    if (this.props.animationOnAppearance === 'typing' && this.state.animatedText === '') {
      this.runTypingAnimation()
    }
  }

  componentDidUpdate() {
    if (this.props.animationOnAppearance === 'typing' && this.state.animatedText === '') {
      this.runTypingAnimation()
    }
  }

  runTypingAnimation() {
    const intr = setInterval(
      (() => {
        if (this.state.animatedText.length >= this.props.text) {
          this.setState({
            animatedText: this.props.text,
          })
          intr.clearInterval()
        }
        this.setState({
          animatedText: this.props.text.substring(0, this.state.animatedText.length + 1),
        })
      }).bind(this),
      200,
    )
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
    default: 'Some text',
  },
  // Implemented in TextEditor.js
  // 'fontSize': {
  //     type: 'number',
  //     min: 8,
  //     max: 80,
  //     default: 14
  // },
  // Implemented in TextEditor.js
  // 'color': {
  //     type: 'string',
  //     default: '#333'
  // },
  // Implemented in TextEditor.js
  // 'backgroundColor': {
  //     type: 'string',
  //     default: ''
  // },
  fontShadow: {
    type: 'boolean',
    default: false,
  },
  fontShadowColor: {
    type: 'string',
    default: 'rgba(0,0,0,0.2)',
  },
  fontShadowDistance: {
    type: 'number',
    default: 3,
    min: 0,
    max: 100,
  },
  // Implemented in TextEditor.js
  // 'bold': {
  //     type: 'boolean',
  //     default: false
  // },
  animationOnAppearance: {
    type: 'string',
    enum: ['none', 'typing'],
    default: 'none',
  },
})

export default RemixWrapper(Text, Schema, 'Text')
