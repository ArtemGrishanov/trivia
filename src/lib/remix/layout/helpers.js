import {
    setData,
    getState,
    getStore,
    postMessage,
    getMode,
    getSchema,
    getScreens,
    REMIX_SET_SESSION_SIZE,
    REMIX_PRE_RENDER,
} from '../../remix'

import { getAdaptedChildrenProps } from './adapter.js'

export const APP_BOTTOM_PADDING = 20

/**
 * Сохранить адаптированные свойства для компонента
 * Если нет полной адаптации для текущей ширины приложения, то она также будет создана
 *
 * @param {string} componentId
 * @param {object} props
 */
export function saveAdaptedProps(screenId, componentId, props) {
    const state = getState()
    // sessionWidth = state.session.size.width
    // if (
    //     (!state.app.adaptedui ||
    //         !state.app.adaptedui[sessionWidth] ||
    //         Object.keys(state.app.adaptedui[sessionWidth]).length === 0) &&
    //     state.session.adaptedui[sessionWidth]
    // ) {
    //     // если такая адаптация еще не существует, создать на основе сессии
    //     // state.session.adaptedui уже к этому моменту была вычислена автоматически
    //     setData({ [`app.adaptedui.${sessionWidth}`]: state.session.adaptedui[sessionWidth] })
    // }
    // сохраняем некоторые свойства, если они были изменены при другой ширине приложения
    // например: геометрические свойства (top, left, width, height) сохраняем для мобильной версии приложения
    const data = {}
    Object.keys(props).forEach(key => {
        data[`router.screens.${screenId}.adaptedui.${state.session.size.width}.props.${componentId}.${key}`] =
            props[key]
    })
    setData(data)
    updateAppHeight()
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
    // width === 0 | height === 0, window may be not loaded yet
    if (width > 0 && height > 0 && (width !== state.session.size.width || height !== state.session.size.height)) {
        console.log(`updateWindowSize ${width} ${height}`)
        const defaultWidth = state.app.size.width

        store.dispatch({
            type: REMIX_SET_SESSION_SIZE,
            width,
            height,
        })

        if (defaultWidth !== width) {
            // проверить что есть адаптации для всех экранов, если нет - запустить расчет недостающих адаптационных свойств
            let adaptationNeeded = false
            const needRequestRects = []
            getScreens().forEach(scr => {
                if (!getAdaptationProps(scr, width)) {
                    adaptationNeeded = true
                    getAdaptedProps({
                        screen: scr,
                        screenId: scr.hashlistId,
                        defaultWidth,
                        width,
                    }).props
                    //needRequestRects.push(??);
                }
            })
            if (adaptationNeeded) {
                //requestComponentsBoundingRect(store, needRequestRects)
            }
        }

        updateAppHeight()
    }
}

function updateAppHeight() {
    // set session height and request container size change
    const appHeight = getMaxContentHeight(),
        state = getState()
    if (Math.round(state.session.size.height) !== Math.round(appHeight)) {
        postMessage('requestSetSize', {
            size: {
                width: state.session.size.width,
                height: appHeight,
            },
        })
    }
}

function getAdaptationProps(scr, width) {
    return scr && scr.adaptedui && scr.adaptedui[width] && scr.adaptedui[width].props
        ? scr.adaptedui[width].props
        : null
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
 * @param {Screen} screen
 * @param {Screen} defaultWidth
 * @param {number} width ширина для которой рассчитать новые свойства
 * @param {object} boundingRects (опционально) рассчитанные размеры компонентов width,height
 */
function getAdaptedProps({ screen, screenId, defaultWidth, width, boundingRects }) {
    let props = {},
        maxContentHeight = 0

    const schema = getSchema(),
        nearestAdaptation = getScreenNearestAdaptation({ screen, defaultWidth, width }),
        // если нет адаптации то берем дефолтную ширину app.size.width при которой пользователь настроил весь основной UI
        originWidth = nearestAdaptation ? nearestAdaptation.width : defaultWidth,
        nearestProps = nearestAdaptation && nearestAdaptation.props ? nearestAdaptation.props : null,
        components = [],
        attrs = {}

    screen.components.toArray().forEach(c => {
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

    // filter props by schema 'adaptedForCustomWidth' attribute
    const filteredProps = {},
        adata = {}
    Object.keys(props).forEach(componentId => {
        filteredProps[componentId] = Object.keys(props[componentId])
            .filter(key => {
                const path = `router.screens.${screenId}.components.${componentId}.${key}`
                const d = schema.getDescription(path)
                if (d && d.adaptedForCustomWidth) {
                    adata[`router.screens.${screenId}.adaptedui.${width}.props.${componentId}.${key}`] =
                        props[componentId][key]
                }
            })
            .reduce((obj, key) => {
                obj[key] = props[componentId][key]
                return obj
            }, {})
    })

    // установить адаптированные свойства в экраны
    setData(adata)

    return {
        props: filteredProps,
        maxContentHeight: Math.round(maxContentHeight),
    }
}

export function setComponentsRects(boundingRects) {
    const state = getState()

    if (state.app.size.width !== state.session.size.width) {
        // продолжение адаптации по вертикали, запущенной в updateWindowSize
        const { width, height } = state.session.size

        getAdaptedProps({
            screen: scr,
            screenId: scr.hashlistId,
            defaultWidth: state.app.size.width,
            width,
            boundingRects,
        })
        console.log(`Vertical adaptation running for width=${width} ...`)

        updateAppHeight()
    }

    // // после смены размера экрана высота превысила исходную, контент не умещается по высоте
    // if (adapted.maxContentHeight > height) {
    //     // Хотя session size изменится в результате запроса 'requestSetSize', мы вынуждены сделать изменение размера сессии немедленно
    //     // так как после апдейта REMIX_SET_ADAPTED_PROPS будет перестроен интерфейс и в этот момент требуется уже актуальной размер session.size
    //     store.dispatch({
    //         type: REMIX_SET_SESSION_SIZE,
    //         width,
    //         height: adapted.maxContentHeight,
    //     })
    //     postMessage('requestSetSize', {
    //         size: {
    //             width,
    //             height: adapted.maxContentHeight,
    //         },
    //     })
    // }
}

/**
 * Возвращает хеш адаптированных свойств компоненетов (алаптацию) в зависимости от ширины приложения
 *
 * Например если у нас есть базовая ширина 800px и есть адаптация на 320px, то адаптацию 320 надо применять для ширин [0 ... 750px]
 * то есть в почти до базового размера. Так было решено на обсуждении, что лучше расширять адаптацию, чем сжимать.
 *
 * @param {Screen}
 * @param {number} width ширина приложения
 */
function getScreenNearestAdaptation({ screen, defaultWidth, width }) {
    //при наличии нескольких адаптаций здесь придется переделать. Но пока предполагается только одна моб адаптация и смена дефолтного размера
    //также предполагается что апаптация меньше по ширине чем defaultWidth
    const DEFAULT_WIDTH_DEVIATION = 50,
        aKeys = screen.adaptedui ? Object.keys(screen.adaptedui) : null

    if (!aKeys || aKeys.length === 0) {
        return undefined
    }

    if (defaultWidth - DEFAULT_WIDTH_DEVIATION < width) {
        // нет адаптации, использоваться будут дефолтные свойства компонентов (которые выставлены пользователем от размера defaultWidth)
        return undefined
    }

    return {
        width: parseInt(aKeys[0]),
        contentHeight: screen.adaptedui[aKeys[0]].height,
        props: screen.adaptedui[aKeys[0]].props,
    }
}

/**
 * Пройти по всем экранам и компонентам и определить максимальную высоту
 */
function getMaxContentHeight() {
    let maxH = 0,
        state = getState(),
        width = state.session.size.width

    getScreens().forEach(scr => {
        const adaptScr = getAdaptationProps(scr, width)
        scr.components.toArray().forEach(c => {
            const aprops = adaptScr ? adaptScr[c.hashlistId] : null
            let top = c.top,
                height = c.height
            if (aprops) {
                top = typeof aprops.top === 'number' ? aprops.top : top
                height = typeof aprops.height === 'number' ? aprops.height : height
            }
            maxH = Math.max(maxH, top + height)
        })
    })

    maxH = Math.round(maxH + APP_BOTTOM_PADDING)
    if (maxH < state.app.size.height) {
        maxH = state.app.size.height
    }

    return maxH
}
