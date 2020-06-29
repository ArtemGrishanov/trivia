import PropsNormalizer from './PropsNormalizer'
import { connect } from 'react-redux'
import LayoutItem from './layout/LayoutItem'
import { setData } from '../remix'
import { getConditionConfig } from '../remix/util/condition'

const componentClassMap = {}

export const REMIX_COMPONENTS_COMMON_PROPS_SCHEMA = {
    id: {
        type: 'string',
        minLength: 1,
        maxLength: 1024,
        //TODO default generate id
        default: 'none',
    },
    tags: {
        type: 'string',
        minLength: 0,
        maxLength: 1024,
        default: 'remixcomponent',
    },
    displayName: {
        type: 'string',
        minLength: 1,
        default: 'RemixComponent',
    },
    // это не строка это объект в котором плагины размещают различные данные для своих нужд
    // 'data': {
    //     type: 'string',
    //     minLength: 0,
    //     maxLength: 4096,
    //     default: ''
    // },
    width: {
        type: 'number',
        min: 1,
        max: 9999,
        default: 50,
        condition: getConditionConfig('width'),
        adaptedForCustomWidth: true,
    },
    widthStrategy: {
        type: 'string',
        enum: ['fixed', 'dynamic'],
        default: 'fixed',
    },
    height: {
        type: 'number',
        min: 1,
        max: 9999,
        default: 50,
        condition: getConditionConfig('height'),
        adaptedForCustomWidth: true,
    },
    left: {
        type: 'number',
        min: -1000,
        max: 9999,
        default: 100,
        condition: getConditionConfig('left'),
        adaptedForCustomWidth: true,
    },
    leftStrategy: {
        type: 'string',
        enum: ['dynamic', 'fixed'],
        default: 'dynamic',
    },
    top: {
        type: 'number',
        min: -1000,
        max: 9999,
        default: 100,
        condition: getConditionConfig('top'),
        adaptedForCustomWidth: true,
    },
    szLeft: {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        condition: getConditionConfig('szLeft'),
    },
    szRight: {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        condition: getConditionConfig('szRight'),
    },
    szTop: {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        condition: getConditionConfig('szTop'),
    },
    szBottom: {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        condition: getConditionConfig('szBottom'),
    },
    displayType: {
        type: 'string',
        enum: ['flow', 'decor'],
        default: 'flow',
    },
}

export default (Component, Schema, DisplayName) => {
    if (!DisplayName) {
        throw new Error(
            'RemixWrapper: you must specify DisplayName for each component. Usually it matches the class name',
        )
    }

    let composed = null

    switch (DisplayName) {
        case 'Router': {
            composed = compose(routerConnect(), withPropNormalizer(Schema, DisplayName))(Component)
            break
        }
        case 'Screen': {
            composed = compose(screenConnect(), withPropNormalizer(Schema, DisplayName))(Component)
            break
        }
        default: {
            composed = compose(
                LayoutItem(),
                //TODO It works without componentConnect Is screenConnect sufficient?
                //componentConnect(),
                withPropNormalizer(Schema, DisplayName),
            )(Component)
        }
    }

    componentClassMap[DisplayName] = composed
    return composed
}

export const getComponentClass = DisplayName => {
    return componentClassMap[DisplayName]
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
        state => {
            return {
                ...state.router,
                screens: state.router.screens.filter(s => !s.disabled),
                mode: state.session.mode,
            }
        },
        dispatch => {
            return {
                setData,
            }
        },
    )
}

function screenConnect() {
    return connect((state, ownProps) => {
        if (ownProps.id && state.router.screens[ownProps.id]) {
            return {
                ...state.router.screens[ownProps.id],
                ...state.session,
                size: state.app.sessionsize,
            }
        }
        return {}
    })
}

function componentConnect() {
    return connect((state, ownProps) => {
        //TODO find and return component state in global state
        return {}
    })
}

function withPropNormalizer(Schema, DisplayName) {
    return PropsNormalizer(
        Schema.extend({
            ...REMIX_COMPONENTS_COMMON_PROPS_SCHEMA, // use common Remix Components properties
            ...{ displayName: { ...REMIX_COMPONENTS_COMMON_PROPS_SCHEMA.displayName, ...{ default: DisplayName } } }, // use specific displayName for each Component type
        }),
    )
}
