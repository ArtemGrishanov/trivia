import {
    setData,
    getState,
    getStore,
    postMessage,
    getMode,
    getSchema,
    getScreens,
    REMIX_SET_ADAPTED_PROPS,
    REMIX_SET_SESSION_SIZE,
    REMIX_PRE_RENDER,
} from '../../remix'

import { getAdaptedChildrenProps } from './adapter.js'

/**
 * Сохранить адаптированные свойства для компонента
 * Если нет полной адаптации для текущей ширины приложения, то она также будет создана
 *
 * @param {string} componentId
 * @param {object} props
 */
export function saveAdaptedProps(componentId, props) {
    const store = getStore(),
        state = store.getState(),
        sessionWidth = state.session.size.width
    if (
        (!state.app.adaptedui ||
            !state.app.adaptedui[sessionWidth] ||
            Object.keys(state.app.adaptedui[sessionWidth]).length === 0) &&
        state.session.adaptedui[sessionWidth]
    ) {
        // если такая адаптация еще не существует, создать на основе сессии
        // state.session.adaptedui уже к этому моменту была вычислена автоматически
        setData({ [`app.adaptedui.${sessionWidth}`]: state.session.adaptedui[sessionWidth] })
    }
    // сохраняем некоторые свойства, если они были изменены при другой ширине приложения
    // например: геометрические свойства (top, left, width, height) сохраняем для мобильной версии приложения
    const data = {}
    Object.keys(props).forEach(key => {
        data[`app.adaptedui.${state.session.size.width}.props.${componentId}.${key}`] = props[key]
    })
    setData(data)
    // для сессии также надо сохранить новые значения
    // экраны берут адаптированные значения именно из session.adaptedui, в то время как в app.adaptedui они хранятся для сериализации
    store.dispatch({
        type: REMIX_SET_ADAPTED_PROPS,
        width: sessionWidth,
        props: { [componentId]: props },
    })
    recalculateAppHeight()
}

/**
 * Обновить размер приложения в рамках сессии
 * Запустится процедура адаптации UI для новой ширины
 *
 * @param {*} root
 */
export function updateWindowSize(root) {
    const store = getStore()
    let state = store.getState(),
        width,
        height
    if (getMode() === 'edit') {
        const rect = root.getBoundingClientRect()
        width = Math.round(rect.width)
        height = Math.round(rect.height)
    } else {
        width = window.innerWidth
        height = window.innerHeight
    }
    //console.log(`updateWindowSize ${width} ${height}`)
    // width === 0 | height === 0, window may be not loaded yet
    if (width > 0 && height > 0 && (width !== state.session.size.width || height !== state.session.size.height)) {
        const defaultWidth = state.app.size.width
        if (width !== defaultWidth) {
            if (state.app.adaptedui && state.app.adaptedui[width] && state.app.adaptedui[width].props) {
                // имеется адаптация созданная пользователем в редакторе. Например, пользователь отредактировал UI под моб устройство
                store.dispatch({
                    type: REMIX_SET_ADAPTED_PROPS,
                    width,
                    props: state.app.adaptedui[width].props,
                    height: state.app.adaptedui[width].height,
                })
                state = getState()
            }
            if (!state.session.adaptedui[width] || !state.session.adaptedui[width].props) {
                console.log(`Adaptation running for width=${width}...`)
                //TODO что делать с nearestAdaptation.height ? и как ее применять вообще?

                let adaptedComponentsProps = getAdaptedProps({
                    state,
                    width,
                }).props
                store.dispatch({
                    type: REMIX_SET_SESSION_SIZE,
                    width,
                    height,
                })
                store.dispatch({
                    type: REMIX_SET_ADAPTED_PROPS,
                    width,
                    props: adaptedComponentsProps,
                })
                requestComponentsBoundingRect(store)
            } else {
                console.log(`Adaptation already exist for width=${width}`)
                if (
                    typeof state.session.adaptedui[width].height === 'number' &&
                    Math.round(height) !== Math.round(state.session.adaptedui[width].height)
                ) {
                    // Хотя session size изменится в результате запроса 'requestSetSize', мы вынуждены сделать изменение размера сессии немедленно
                    // так как после апдейта REMIX_SET_ADAPTED_PROPS будет перестроен интерфейс и в этот момент требуется уже актуальный размер session.size
                    store.dispatch({
                        type: REMIX_SET_SESSION_SIZE,
                        width,
                        height: state.session.adaptedui[width].height,
                    })
                    console.log(`requestSetSize ${width} ${state.session.adaptedui[width].height}`)
                    postMessage('requestSetSize', {
                        size: {
                            width,
                            height: state.session.adaptedui[width].height,
                        },
                    })
                }
            }
        } else {
            store.dispatch({
                type: REMIX_SET_SESSION_SIZE,
                width,
                height,
            })
        }
    }
}

function requestComponentsBoundingRect(store) {
    const components = []

    store
        .getState()
        .router.screens.toArray()
        .forEach(scr => {
            scr.components.toArray().forEach(c => (c.displayName === 'Text' ? components.push(c) : null))
        })

    // найти все объекты которые могут изменить свой размер из-за нового размера приложения
    store.dispatch({
        type: REMIX_PRE_RENDER,
        components,
    })
}

/**
 * Получить адаптированные свойства компонентов для ширины и с вычисленными размерами компонентов boundingRects
 *
 * @param {object} state
 * @param {number} width ширина для которой рассчитать новые свойства
 * @param {object} boundingRects (опционально) рассчитанные размеры компонентов width,height
 */
function getAdaptedProps({ state, width, boundingRects }) {
    let props = {},
        maxContentHeight = 0
    const schema = getSchema(),
        compIdToScrId = {},
        nearestAdaptation = getAdaptation(width),
        // если нет адаптации то берем дефолтную ширину app.size.width при которой пользователь настроил весь основной UI
        originWidth = nearestAdaptation ? nearestAdaptation.width : state.app.size.width,
        nearestProps = nearestAdaptation && nearestAdaptation.props ? nearestAdaptation.props : null

    state.router.screens.toArray().forEach(scr => {
        const components = [],
            attrs = {}

        scr.components.toArray().forEach(c => {
            let overr = { id: c.hashlistId }
            if (nearestProps && nearestProps[c.hashlistId]) {
                overr = { ...overr, ...nearestProps[c.hashlistId] }
            }
            if (boundingRects && boundingRects[c.hashlistId]) {
                // добавляем измеренные размеры компонента в его свойства для более уточненной адаптации
                overr.width = boundingRects[c.hashlistId].width
                overr.height = boundingRects[c.hashlistId].height
            }
            components.push({
                ...c,
                ...overr,
            })
            compIdToScrId[c.hashlistId] = scr.hashlistId
        })

        props = {
            ...props,
            ...getAdaptedChildrenProps(
                components,
                {
                    origCntWidth: originWidth,
                    containerWidth: width,
                },
                attrs,
            ),
        }

        maxContentHeight = Math.max(maxContentHeight, attrs.contentHeight)
    })

    // filter props by schema 'adaptedForCustomWidth' attribute
    const filteredProps = {}
    Object.keys(props).forEach(componentId => {
        filteredProps[componentId] = Object.keys(props[componentId])
            .filter(key => {
                const path = `router.screens.${compIdToScrId[componentId]}.components.${componentId}.${key}`
                const d = schema.getDescription(path)
                return d && d.adaptedForCustomWidth
            })
            .reduce((obj, key) => {
                obj[key] = props[componentId][key]
                return obj
            }, {})
    })

    return {
        props: filteredProps,
        maxContentHeight: Math.round(maxContentHeight),
    }
}

export function setComponentsRects(boundingRects) {
    // продолжение адаптации по вертикали, запущенной в updateWindowSize
    const store = getStore(),
        state = getState(),
        { width, height } = state.session.size,
        adapted = getAdaptedProps({
            state,
            width,
            boundingRects,
        })

    console.log(`Vertical adaptation running for width=${width} ...`)

    // после смены размера экрана высота превысила исходную, контент не умещается по высоте
    if (adapted.maxContentHeight > height) {
        // Хотя session size изменится в результате запроса 'requestSetSize', мы вынуждены сделать изменение размера сессии немедленно
        // так как после апдейта REMIX_SET_ADAPTED_PROPS будет перестроен интерфейс и в этот момент требуется уже актуальной размер session.size
        store.dispatch({
            type: REMIX_SET_SESSION_SIZE,
            width,
            height: adapted.maxContentHeight,
        })
        store.dispatch({
            type: REMIX_SET_ADAPTED_PROPS,
            width,
            height: adapted.maxContentHeight,
            props: adapted.props,
        })
        //console.log(`requestSetSize ${width} ${adapted.maxContentHeight}`)
        postMessage('requestSetSize', {
            size: {
                width,
                height: adapted.maxContentHeight,
            },
        })
    } else {
        store.dispatch({
            type: REMIX_SET_ADAPTED_PROPS,
            width,
            height,
            props: adapted.props,
        })
    }
}

/**
 * Возвращает хеш адаптированных свойств компоненетов (алаптацию) в зависимости от ширины приложения
 *
 * Например если у нас есть базовая ширина 800px и есть адаптация на 320px, то адаптацию 320 надо применять для ширин [0 ... 750px]
 * то есть в почти до базового размера. Так было решено на обсуждении, что лучше расширять адаптацию, чем сжимать.
 *
 * @param {number} width ширина приложения
 */
function getAdaptation(width) {
    //при наличии нескольких адаптаций здесь придется переделать. Но пока предполагается только одна моб адаптация и смена дефолтного размера
    //также предполагается что апаптация меньше по ширине чем defaultWidth
    const DEFAULT_WIDTH_DEVIATION = 50,
        app = getState().app,
        defaultWidth = app.size.width,
        aKeys = app.adaptedui ? Object.keys(app.adaptedui) : null

    if (!aKeys || aKeys.length === 0) {
        return undefined
    }

    if (defaultWidth - DEFAULT_WIDTH_DEVIATION < width) {
        // нет адаптации, использоваться будут дефолтные свойства компонентов (которые выставлены пользователем от размера defaultWidth)
        return undefined
    }

    return {
        width: parseInt(aKeys[0]),
        contentHeight: app.adaptedui[aKeys[0]].height,
        props: app.adaptedui[aKeys[0]].props,
    }
}

/**
 * Пройти по всем экранам и компонентам и определить максимальную высоту и применить ее
 * Это происходит только при редактировании адаптации пока что
 * Подумаем - может делать то же самое и для дефолтного размера
 *
 */
function recalculateAppHeight() {
    const state = getState(),
        adapted = state.session.adaptedui[state.session.size.width].props || {}

    let maxH = 0

    getScreens().forEach(scr => {
        scr.components.toArray().forEach(c => {
            const aprops = adapted[c.hashlistId]
            let top = c.top,
                height = c.height
            if (aprops) {
                top = typeof aprops.top === 'number' ? aprops.top : top
                height = typeof aprops.height === 'number' ? aprops.height : height
            }
            maxH = Math.max(maxH, top + height)
        })
    })

    maxH = Math.round(maxH + 20) //TODO 20 - to padding bottom

    // set session height and request container size change
    if (state.session.size.height !== maxH) {
        setData({ [`app.adaptedui.${state.session.size.width}.height`]: maxH })
        postMessage('requestSetSize', {
            size: {
                width: state.session.size.width,
                height: maxH,
            },
        })
    }
}
