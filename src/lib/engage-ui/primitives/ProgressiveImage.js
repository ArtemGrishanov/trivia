import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import BasicImage from '../bricks/BasicImage'

class ProgressiveImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="rmx-component">
        <BasicImage {...this.props}></BasicImage>
      </div>
    )
  }
}

export const Schema = new DataSchema({
  width: {
    type: 'number',
    min: 10,
    max: 2000,
    default: 400,
  },
  height: {
    type: 'number',
    min: 10,
    max: 2000,
    default: 300,
  },
  backgroundSize: {
    type: 'string',
    enum: ['cover', 'contain'],
    default: 'cover',
  },
  blur: {
    type: 'boolean',
    default: false,
  },
  grayscale: {
    type: 'boolean',
    default: false,
  },
  dropShadow: {
    type: 'boolean',
    default: false,
  },
  borderWidth: {
    type: 'number',
    min: 0,
    max: 400,
    default: 0,
  },
  borderRadius: {
    type: 'number',
    min: 0,
    max: 1000,
    default: 0,
  },
  borderColor: {
    type: 'string',
    default: '#999',
  },
  animation: {
    type: 'string',
    enum: ['none', 'zoom', 'eight'],
    default: 'none',
  },
  src: {
    type: 'string',
    default: 'https://p.testix.me/images/products/common/i/Placeholder.png',
  },
  srcThumb: {
    type: 'string',
    default: '',
  },
})

export default RemixWrapper(ProgressiveImage, Schema, 'ProgressiveImage')
