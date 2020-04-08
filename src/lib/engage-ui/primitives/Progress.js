import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'

class Progress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const st = {
      fontSize: this.props.fontSize + 'px',
      color: this.props.color,
    }
    const text = this.props.step + '/' + this.props.max
    return (
      <p className="rmx-text" style={st}>
        {text}
      </p>
    )
  }
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
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
    default: '#333',
  },
})

export default RemixWrapper(Progress, Schema, 'Progress')
