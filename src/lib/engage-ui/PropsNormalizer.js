import React from 'react'
import Normalizer from '../normalizer'

export default function PropsNormalizer(Component, Schema) {
    const n = new Normalizer(Schema);

    return class extends React.Component {

        static getDerivedStateFromProps(props, state) {
            // const np = n.process({...props});
            // if (!n.equal(state.normalizedProps, np)) {
            //     return {
            //         ...state,
            //         normalized: true,
            //         normalizedProps: np
            //     }
            // }
            // return {
            //     ...state,
            //     normalized: false
            // };
            return {
                ...state,
                normalizedProps: n.process({...props})
            }
        }

        constructor(props) {
            super(props);
            this.state = {
                normalizedProps: {}
            };
        }

        render() {
            return <Component schema={Schema} {...this.state.normalizedProps}/>
        }

        componentDidMount() {
            if (this.props.normalizePropsCallback)
                this.props.normalizePropsCallback(this.state.normalizedProps);
        }

        componentDidUpdate() {
            if (this.props.normalizePropsCallback)
                this.props.normalizePropsCallback(this.state.normalizedProps);
        }
    }
}