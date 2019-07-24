import React from 'react'
import DataSchema from '../../schema'
import Normalizer from '../../normalizer'

function Button({text="Button title", color = "blue", size = "normal"}) {
    return <button className={`rmx-button __${color} __${size}`}>{text}</button>
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    "text": {
        type: 'string',
        minLength: 1,
        maxLength: 128,
        default: 'Default button title'
    }
});

export default PropsNormalizer(Button, Schema);

// size: small | normal
// color: white | blue
// text string length
// disable true false

function PropsNormalizer(Component, schema) {
    const n = new Normalizer(schema);

    return class extends React.Component {

        static getDerivedStateFromProps(props, state) {
            return {
                normalizedProps: n.process({...props})
            }
        }

        constructor(props) {
            super(props);
            this.state = {};
        }

        componentDidMount() {
            console.log('PropsNormalizer.componentDidMount');
        }

        render() {
            console.log('PropsNormalizer.render');
            return <Component {...this.state.normalizedProps}/>
        }
    }
}