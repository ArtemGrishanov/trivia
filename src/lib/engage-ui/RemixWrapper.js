import sizeMe from 'react-sizeme'
import PropsNormalizer from './PropsNormalizer'
import { getPropertiesBySelector } from '../object-path'
import { connect } from 'react-redux'

// import Text from './primitives/Text'
// import TextOption from './primitives/TextOption'
// import ProgressiveImage from './primitives/ProgressiveImage'

const componentClassMap = {
    // 'Text': Text,
    // 'TextOption': TextOption,
    // 'ProgressiveImage': ProgressiveImage
}

const REMIX_COMPONENTS_COMMON_PROPS_SCHEMA = {
    'id': {
        type: 'string',
        minLength: 4,
        maxLength: 32,
        default: 'none'
    },
    'tags': {
        type: 'string',
        minLength: 0,
        default: 'remixcomponent'
    },
    'displayName': {
        type: 'string',
        minLength: 1,
        default: 'RemixComponent'
    }
};

export default (Component, Schema, DisplayName, statePath) => {
    if (!DisplayName) {
        throw new Error('RemixWrapper: you must specify DisplayName for each component. Usually it matches the class name');
    }
    const wrappedComponent = compose(
        sizeMe({monitorHeight: true, noPlaceholder: true}),
        PropsNormalizer(Schema.extend({
            ...REMIX_COMPONENTS_COMMON_PROPS_SCHEMA, // use common Remix Components properties
            ...{'displayName': {...REMIX_COMPONENTS_COMMON_PROPS_SCHEMA.displayName, ...{'default': DisplayName}}} // use specific displayName for each Component type
        })),
        connect(
            (state, ownProps) => {
                if (ownProps.id && state.router.screens[ownProps.id]) {
                    //TODO specify path 'router.screens' ?
                    //TODO different path for all components 'app.components' ?
                    return state.router.screens[ownProps.id];
                }
                if (statePath) {
                    const res = getPropertiesBySelector(state, statePath);
                    if (res.length > 0) {
                        console.log('mapStateToProps ', res[0].value)
                        return res[0].value;
                    }
                }
                return {}
            }
        )
    )(Component);
    componentClassMap[DisplayName] = wrappedComponent;
    return wrappedComponent;
}
export const getComponentClass = (DisplayName) => {
    return componentClassMap[DisplayName];
}

/**
 * Regular compose function
 *
 * @param  {...function} enhancers - functions to compose
 */
function compose(...enhancers) {
    if (enhancers.length === 0) {
        return arg => arg
    }
    if (enhancers.length === 1) {
        return enhancers[0]
    }
    return enhancers.reduce((a, b) => (...args) => a(b(...args)))
}