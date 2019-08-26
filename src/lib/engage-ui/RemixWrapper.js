import React from 'react'
import sizeMe from 'react-sizeme'
import PropsNormalizer from './PropsNormalizer'

export default (Component, Schema, DisplayName) => {
    return compose(
        sizeMe({monitorHeight: true, noPlaceholder: true}),
        PropsNormalizer(Schema)
        // DisplayName
    )(Component);
}

function compose(...enhancers) {
    if (enhancers.length === 0) {
        return arg => arg
    }
    if (enhancers.length === 1) {
        return enhancers[0]
    }
    return enhancers.reduce((a, b) => (...args) => a(b(...args)))
}