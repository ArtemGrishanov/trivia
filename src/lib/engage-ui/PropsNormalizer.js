import React from 'react'
import Normalizer from '../normalizer'

export default function PropsNormalizer(Component, Schema) {
    const n = new Normalizer(Schema);

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

        render() {
            return <Component schema={Schema} {...this.state.normalizedProps}/>
        }
    }
}