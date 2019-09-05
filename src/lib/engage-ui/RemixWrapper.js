import sizeMe from 'react-sizeme'
import PropsNormalizer from './PropsNormalizer'
import { getPropertiesBySelector } from '../object-path'
import { connect } from 'react-redux'
import LayoutItem from './layout/LayoutItem';

const componentClassMap = {};

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

export default (Component, Schema, DisplayName) => {
    if (!DisplayName) {
        throw new Error('RemixWrapper: you must specify DisplayName for each component. Usually it matches the class name');
    }

    let composed = null;

    switch (DisplayName) {
        case 'Router': {
            composed = compose( routerConnect(), withPropNormalizer(Schema, DisplayName) )(Component);
            break;
        }
        case 'Screen': {
            composed = compose( screenConnect(), withPropNormalizer(Schema, DisplayName) )(Component);
            break;
        }
        default: {
            composed = compose(
                LayoutItem(),
                sizeMe({monitorHeight: true, noPlaceholder: true}),
                //TODO It works! How it work without connect?
                //componentConnect(),
                withPropNormalizer(Schema, DisplayName)

            )(Component);
        }
    }

    componentClassMap[DisplayName] = composed;
    return composed;
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

function routerConnect() {
    return connect(
        (state) => state.router
    );
}

function screenConnect() {
    return connect(
        (state, ownProps) => {
            if (ownProps.id && state.router.screens[ownProps.id]) {
                return state.router.screens[ownProps.id];
            }
            return {}
        }
    )
}

function componentConnect() {
    return connect(
        (state, ownProps) => {
            //TODO find and return component state in global state
            return {}
        }
    )
}

function withPropNormalizer(Schema, DisplayName) {
    return PropsNormalizer(Schema.extend({
        ...REMIX_COMPONENTS_COMMON_PROPS_SCHEMA, // use common Remix Components properties
        ...{'displayName': {...REMIX_COMPONENTS_COMMON_PROPS_SCHEMA.displayName, ...{'default': DisplayName}}} // use specific displayName for each Component type
    }));
}