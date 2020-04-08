import React from 'react'
import Normalizer from '../normalizer'

export default function PropsNormalizer(Schema) {
    const n = new Normalizer(Schema)

    return function (Component) {
        return class extends React.Component {
            static getDerivedStateFromProps(props, state) {
                const np = n.process({ ...props })
                if (props.normalizerRef) {
                    props.normalizerRef(np)
                }
                return {
                    ...state,
                    normalizedProps: np,
                }
            }

            constructor(props) {
                super(props)
                this.state = {
                    normalizedProps: {},
                }
            }

            render() {
                return <Component schema={Schema} {...this.state.normalizedProps} />
            }

            componentDidMount() {
                if (this.props.normalizePropsCallback) this.props.normalizePropsCallback(this.state.normalizedProps)
            }

            componentDidUpdate() {
                if (this.props.normalizePropsCallback) this.props.normalizePropsCallback(this.state.normalizedProps)
            }
        }
    }
}
