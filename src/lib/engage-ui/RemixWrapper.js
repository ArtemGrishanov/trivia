import PropsNormalizer from './PropsNormalizer'
import { connect } from 'react-redux'
import LayoutItem from './layout/LayoutItem'
import { setData } from '../remix'

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
    },
    left: {
        type: 'number',
        min: -1000,
        max: 9999,
        default: 100,
        /**
         *
         * Решить: до setData или после setData сделать обновления условия
         *
         */
        condition: {
            dependOn: ['state.session.size.width'],

            //beforeSetData
            whatToSaveInConditions: ({ path, state, setdata }) => {
                let adp = {}
                if (false) {
                    // первый раз надо сделать автоматическую адаптацию для удобства пользователя

                    // setdata не содержит адаптации
                    // и state не содержит адаптации

                    // ключ будет использован для сохранения в условиях
                    adp = { [state.session.size.width]: getAdaptedProps() }
                }

                // просто обычное сохранение left
                return { ...adp, [`${state.session.size.width}.${componentId}.left`]: setdata[path] }
            },

            /**
             * НЕ в режиме редактирования выбрать одно из сохраненных условных значений
             * Пример.
             * Пользователь сохранил такие свойства
             *      router.screens.1234.adapted.320.props.123.props.left = 78
             *       router.screens.1234.adapted.500.props.123.props.left = 130
             *       router.screens.1234.adapted.800.props.123.props.left = 160
             * Надо выбрать одно ближайшее из них, наиболее подходящее
             */
            select: ({ state, setdata }) => {},
        },
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
        condition: {
            /**
             * Эта настройка позволяет настроить перенаправление свойства на чтение/запись при условиях
             * Например: пишем/читаем данные из router.screens.br3lcy.components.a5zqu2.top,
             * но при условии state.app.size.width !== state.session.size.width
             * Реально запись/чтение происходит в 'router.screens.br3lcy.adaptedui.320.props.a5zqu2.top'
             *
             * Однако, надо не забыть создать схему для редирект свойства. См components.js -> 'router.[screens HashList]./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.top'
             *
             */
            to: ({ state, screenId, componentId }) =>
                screenId && state.session.size.width && componentId
                    ? `router.screens.${screenId}.adaptedui.${state.session.size.width}.props.${componentId}.top`
                    : void 0,
            when: ({ state }) =>
                !!state.session.size.width &&
                !!state.app.size.width &&
                state.app.size.width !== state.session.size.width,
        },
    },
    szLeft: {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
    },
    szRight: {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
    },
    szTop: {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
    },
    szBottom: {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
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
