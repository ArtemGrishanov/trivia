import DataSchema from './schema.js'
import Normalizer from './normalizer.js'
import { assignByPropertyString, getPropertiesBySelector } from './object-path.js'
import {
    getUniqueId,
    isHashlistInstance,
    combineReducers,
    getScreenIdFromPath,
    getComponentIdFromPath,
    debounce,
    callOncePerTime,
    htmlEncode,
    htmlDecode,
} from './remix/util/util.js'
import { getAdaptedChildrenProps } from './engage-ui/layout/LayoutAdapter.js'

export const REMIX_UPDATE_ACTION = '__Remix_update_action__'
//export const REMIX_INIT_ACTION = '__Remix_init_action__'; redux standart init action is used
export const REMIX_HASHLIST_ADD_ACTION = '__Remix_hashlist_update_action__'
export const REMIX_HASHLIST_CHANGE_POSITION_ACTION = '__Remix_hashlist_change_position_action__'
export const REMIX_HASHLIST_DELETE_ACTION = '__Remix_hashlist_delete_action__'
export const REMIX_EVENT_FIRED = '__Remix_event_fired__'
export const REMIX_EVENTS_CLEAR = '__Remix_events_clear__'
export const REMIX_TRIGGERS_CLEAR = '__Remix_triggers_clear__'
export const REMIX_ADD_TRIGGER = '__Remix_add_trigger__'
export const REMIX_MARK_AS_EXECUTED = '__REMIX_MARK_AS_EXECUTED__'
export const REMIX_SET_CURRENT_SCREEN = '__Remix_set_current_screen__'
export const REMIX_SELECT_COMPONENT = '__Remix_select_component__'
export const REMIX_SET_MODE = '__Remix_set_mode__'
export const REMIX_PRE_RENDER = '__Remix_pre_render__'
export const REMIX_SET_ADAPTED_PROPS = '__Remix_set_adapted_props__'
export const REMIX_SET_SESSION_SIZE = '__Remix_set_session_size__'

//TODO specify origin during publishing?
//const containerOrigin = "http://localhost:8080";
const EXPECTED_CONTAINER_ORIGIN = null
const MODE_SET = new Set(['none', 'edit', 'preview', 'published'])
const LOG_BY_DEFAULT = false
const USER_ACTIVITY_EVENTS = ['mousemove', 'keydown']

let logging = LOG_BY_DEFAULT,
    root = null,
    containerOrigin = null,
    containerWindow = null,
    store = null,
    schema = null,
    customFunctions = {},
    normalizer = null,
    extActions = null,
    stateHistoryIndex = 0,
    stateHistory = [],
    _outerEvents = [],
    _orderCounter = 0,
    _triggerActions = {},
    _componentIdToScreenId = {},
    _externalListeners = {}

// establish communication with RemixContainer
window.addEventListener('message', receiveMessage, false)
window.addEventListener('keydown', onKeyDown, false)

USER_ACTIVITY_EVENTS.forEach(eventType => {
    const activity = () =>
        containerWindow && containerOrigin && containerWindow.postMessage({ method: 'user-activity' }, containerOrigin)

    window.addEventListener(eventType, callOncePerTime(activity, 5000))
})

function onKeyDown(e) {
    if (getMode() === 'edit') {
        if (e.metaKey || e.ctrlKey) {
            const k = String.fromCharCode(e.keyCode)
            if (e.shiftKey && k === 'Z') {
                redo()
            } else if (k === 'Z') {
                undo()
            }
        }
    }
}

/**
 * Получить и обработать сообщение
 * @param {Object} event
 */
function receiveMessage({ origin = null, data = {}, source = null }) {
    if (data.method) {
        log(data.method + ' message received')
    }
    if (EXPECTED_CONTAINER_ORIGIN && origin !== EXPECTED_CONTAINER_ORIGIN) {
        return
    }
    // method 'init' - managed by index.html
    // method 'embed' - managed by index.html

    if (data.method === 'setdata') {
        setData(data.data, data.forceFeedback)
        putStateHistory()
    }
    if (data.method === 'serialize') {
        _putOuterEventInQueue('serialized', { state: serialize2() })
        _sendOuterEvents()
    }
    if (data.method === 'getappboundingclientrect') {
        _putOuterEventInQueue('app_bounding_client_rect', {
            rect: document.getElementById('remix-app-root').getBoundingClientRect(),
        })
        _sendOuterEvents()
    }
    if (data.method === 'setsize') {
        // сообщение от контейнера по установке размера не имеет смысла
        // так как remix-приложение всегда width:100%;height:100% а реальный размер ставится в параметрах контейнера
        //setSize(data.width, data.height);
    }
    if (data.method === 'addhashlistelement') {
        addHashlistElement(data.propertyPath, data.index, { newElement: data.newElement })
        putStateHistory()
    }
    if (data.method === 'clonehashlistelement') {
        cloneHashlistElement(data.propertyPath, data.elementId)
        putStateHistory()
    }
    if (data.method === 'changepositioninhashlist') {
        let index = data.elementIndex,
            newIndex = data.newElementIndex
        if (data.elementId) {
            const hl = fetchHashlist(store.getState(), data.propertyPath)
            index = hl.getIndex(data.elementId)
        }
        if (data.delta) {
            newIndex = index + data.delta
        }
        changePositionInHashlist(data.propertyPath, index, newIndex)
        putStateHistory()
    }
    if (data.method === 'deletehashlistelement') {
        deleteHashlistElement(data.propertyPath, {
            elementId: data.elementId,
            index: data.index,
        })
        putStateHistory()
    }
    if (data.method === 'setcurrentscreen') {
        if (data.screenId) {
            setCurrentScreen(data.screenId)
            putStateHistory()
        }
    }
    if (data.method === 'select') {
        // postMessage=false, we dont need to notify container as has just got message from it
        selectComponents(data.componentIds, {}, { postMessage: false })
    }
    if (data.method === 'undo') {
        undo()
    }
    if (data.method === 'redo') {
        redo()
    }
    if (_externalListeners[data.method]) {
        // Ability to add specific message listeners for each plugin
        const r = _externalListeners[data.method].call(this, data)
        if (r && r.message) {
            _putOuterEventInQueue(r.message, r.data)
            _sendOuterEvents()
        }
    }
    if (data.method === 'set_remix_container_size') {
        console.log(`set_remix_container_size ${data.size.width} ${data.size.height}`)
        if (data.size.width > 0) {
            root.style.width = data.size.width + 'px'
        }
        if (data.size.height > 0) {
            root.style.height = data.size.height + 'px'
        }
        updateWindowSize()
    }
}

function onWindowResize() {
    updateWindowSize()
}

/**
 * Assign new property values to store
 *
 * @param {object} data, exmaple {'path.to.the.property': 'newvalue'}
 */
export function setData(data, forceFeedback) {
    if (typeof data !== 'object') {
        throw new Error(`You must pass data object as first argument, example {'path.to.the.property': 123}`)
    }
    store.dispatch({
        type: REMIX_UPDATE_ACTION,
        data,
        forceFeedback,
    })
}

function setCurrentScreen(screenId) {
    store.dispatch({
        type: REMIX_SET_CURRENT_SCREEN,
        screenId,
    })
}

/**
 * Sets default application width and height
 * Application will start with this size if width/height not specified in init()
 *
 * Value will be set, if not "undefined"
 *
 * It changes value in state only. In fact width-height are governed by rcontainer (and by loader.js params)
 *
 * @param {number} width
 * @param {number} height
 */
export function setSize(width, height) {
    // find propertes in schema responsible for width and height
    const data = {}
    if (width !== undefined) {
        const wprop = schema.getDescriptionsWithAttribute('appWidthProperty')
        if (wprop && wprop.length > 0) {
            if (wprop.length === 1) {
                data[wprop[0].selector] = width
            } else {
                throw new Error(`Remix: found more than one selectors with "appWidthProperty" attribute`)
            }
        }
    }
    if (height !== undefined) {
        const hprop = schema.getDescriptionsWithAttribute('appHeightProperty')
        if (hprop && hprop.length > 0) {
            if (hprop.length === 1) {
                data[hprop[0].selector] = height
            } else {
                throw new Error(`Remix: found more than one selectors with "appHeightProperty" attribute`)
            }
        }
    }
    if (Object.keys(data).length > 0) {
        setData(data)
    }
}

/**
 * Обновить размер приложения в рамках сессии
 * Запустится процедура адаптации UI для новой ширины
 *
 * @param {number} width
 * @param {number} height
 */
function updateWindowSize() {
    const state = getState()
    let width, height
    if (getMode() === 'edit') {
        const rect = root.getBoundingClientRect()
        width = rect.width
        height = rect.height
    } else {
        width = window.innerWidth
        height = window.innerHeight
    }
    console.log(`updateWindowSize ${width} ${height}`)
    // width === 0 | height === 0, window may be not loaded yet
    if (width > 0 && height > 0 && (width !== state.session.size.width || height !== state.session.size.height)) {
        const defaultWidth = state.app.size.width
        if (width !== defaultWidth) {
            if (state.app.adaptedui && state.app.adaptedui[width]) {
                // имеется адаптация созданная пользователем в редакторе. Например, пользователь отредактировал UI под моб устройство
                store.dispatch({
                    type: REMIX_SET_ADAPTED_PROPS,
                    width,
                    props: state.app.adaptedui[width],
                })
            }
            if (!state.session.adaptedui[width]) {
                const nearestAdaptation = getAdaptation(width) || {}
                console.log(`Adaptation running for width=${width}...`)
                // пройти по всем экранам и компонентам приложения и получить адаптированные свойства для новой ширины приложения width
                let adaptedComponentsProps = {}
                state.router.screens.toArray().forEach(scr => {
                    const components = []
                    scr.components
                        .toArray()
                        .forEach(c => components.push({ ...c, ...nearestAdaptation[c.hashlistId], id: c.hashlistId }))
                    adaptedComponentsProps = {
                        ...adaptedComponentsProps,
                        ...getAdaptedChildrenProps(components, {
                            origCntWidth: defaultWidth,
                            containerWidth: width,
                        }),
                    }
                })
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
                requestComponentsBoundingRect()
            } else {
                console.log(`Adaptation already exist for width=${width}`)
                if (height !== state.session.adaptedui[width].height) {
                    // Хотя session size изменится в результате запроса 'requestSetSize', мы вынуждены сделать изменение размера сессии немедленно
                    // так как после апдейта REMIX_SET_ADAPTED_PROPS будет перестроен интерфейс и в этот момент требуется уже актуальной размер session.size
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

function requestComponentsBoundingRect() {
    console.log(`requestComponentsBoundingRect`)
    const components = []

    getState()
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

export function setComponentsRects(rects) {
    console.log(`setComponentsRects`)
    // продолжение адаптации по вертикали, запущенной в updateWindowSize
    const { width, height } = getState().session.size,
        defaultWidth = getState().app.size.width

    let adaptedComponentsProps = {},
        maxContentHeight = 0

    console.log(`Vertical adaptation running for width=${width} ...`)

    // пройти по всем экранам и компонентам приложения и получить адаптированные свойства для новой ширины приложения width
    getState()
        .router.screens.toArray()
        .forEach(scr => {
            const components = [],
                attrs = {}
            scr.components.toArray().forEach(c => {
                const overr = { id: c.hashlistId }
                if (rects[c.hashlistId]) {
                    // добавляем измеренные размеры компонента в его свойства для более уточненной адаптации
                    overr.width = rects[c.hashlistId].width
                    overr.height = rects[c.hashlistId].height
                }
                components.push({
                    ...c,
                    ...overr,
                })
            })

            adaptedComponentsProps = {
                ...adaptedComponentsProps,
                ...getAdaptedChildrenProps(
                    components,
                    {
                        origCntWidth: defaultWidth,
                        containerWidth: width,
                    },
                    attrs,
                ),
            }

            maxContentHeight = Math.max(maxContentHeight, attrs.contentHeight)
        })

    // после смены размера экрана высота превысила исходную, контент не умещается по высоте
    if (maxContentHeight > height) {
        // Хотя session size изменится в результате запроса 'requestSetSize', мы вынуждены сделать изменение размера сессии немедленно
        // так как после апдейта REMIX_SET_ADAPTED_PROPS будет перестроен интерфейс и в этот момент требуется уже актуальной размер session.size
        store.dispatch({
            type: REMIX_SET_SESSION_SIZE,
            width,
            height: maxContentHeight,
        })
        store.dispatch({
            type: REMIX_SET_ADAPTED_PROPS,
            width,
            height: maxContentHeight,
            props: adaptedComponentsProps,
        })
        console.log(`requestSetSize ${width} ${maxContentHeight}`)
        postMessage('requestSetSize', {
            size: {
                width,
                height: maxContentHeight,
            },
        })
    } else {
        store.dispatch({
            type: REMIX_SET_ADAPTED_PROPS,
            width,
            height,
            props: adaptedComponentsProps,
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
    const app = getState().app,
        defaultWidth = app.size.width,
        aKeys = app.adaptedui ? Object.keys(app.adaptedui) : null

    if (!aKeys || aKeys.length === 0) {
        return undefined
    }

    if (defaultWidth - 50 < width) {
        // нет адаптации, использоваться будут дефолтные свойства компонентов (которые выставлены пользователем от размера defaultWidth)
        return undefined
    }

    return app.adaptedui(aKeys[0])
}

function registerTriggerAction(name, fn) {
    _triggerActions[name] = fn
    return { actionType: name }
}

function addMessageListener(message, fn) {
    _externalListeners[message] = fn
}

/**
 * Dispatches an action defined in Remix.init
 * External action can be used for state modification in reducer which can not be descibed in schema
 * For example: "set quiz correct option"
 *
 * @param {string} type
 * @param {object} param
 */
function dispatchAction(type, param) {
    const actInfo = extActions.find(act => type === act.type)
    if (actInfo) {
        param = new Normalizer(actInfo.paramSchema).process(param)
        store.dispatch({
            ...param,
            type: type,
        })
    } else {
        throw new Error(`Remix: this action ${type} is not defined. Use Remix.init to define some external actions.`)
    }
}

/**
 *
 * @param {object} trigger
 */
function addTrigger({ when = {}, then = null }) {
    store.dispatch({
        type: REMIX_ADD_TRIGGER,
        trigger: { when, then, order: ++_orderCounter },
    })
}

/**
 * Event happend in Remix app
 *
 * @param {string} eventType
 * @param {object} eventData
 */
function fireEvent(eventType, eventData) {
    if (eventType === undefined) {
        throw new Error('Remix.fireEvent: eventType is not specified')
    }
    // if (store) {
    //TODO с помощью этой проверки в начале старта приложения создаются свойствва и мы теряем эти события..
    // reducer создается и запускается а store еще не создан
    store.dispatch({
        type: REMIX_EVENT_FIRED,
        eventType: eventType,
        eventData: eventData,
    })
    // }
}

function clearTriggersAndEvents() {
    store.dispatch({
        type: REMIX_TRIGGERS_CLEAR,
    })
    store.dispatch({
        type: REMIX_EVENTS_CLEAR,
    })
}

/**
 *
 * @param {string} hashlistPropPath
 * @param {number} index
 * @param {*} elementData.newElement
 * @param {number} elementData.prototypeIndex
 */
function addHashlistElement(hashlistPropPath, index, elementData = {}) {
    index = parseInt(index)
    if (hashlistPropPath === undefined) {
        throw new Error('Remix.addElement: hashlistPropPath is not specified')
    }
    if (!schema.getDescription(hashlistPropPath)) {
        throw new Error(`Remix.addElement: ${hashlistPropPath} is not described in schema`)
    }
    const d = {
        type: REMIX_HASHLIST_ADD_ACTION,
        path: hashlistPropPath,
        index: index,
    }
    if (elementData.hasOwnProperty('newElement')) {
        d.newElement = elementData.newElement
    }
    if (elementData.hasOwnProperty('prototypeIndex')) {
        d.prototypeIndex = elementData.prototypeIndex
    }
    store.dispatch(d)
}

/**
 *
 * @param {string} hashlistPropPath
 * @param {string} elementId
 */
function cloneHashlistElement(hashlistPropPath, elementId) {
    if (!schema.getDescription(hashlistPropPath)) {
        throw new Error(`Remix.cloneHashlistElement: ${hashlistPropPath} is not described in schema`)
    }
    if (!elementId) {
        throw new Error('Remix.cloneHashlistElement: elementId is not specified')
    }
    const r = getPropertiesBySelector(store.getState(), hashlistPropPath)
    if (r.length === 0) {
        throw new Error(`Remix: there is no such property ${hashlistPropPath} in state`)
    }
    const hl = r[0].value,
        elem = hl[elementId]
    if (!elem) {
        throw new Error(`Remix: there is no such element ${elementId} in hashlist ${hashlistPropPath}`)
    }
    const index = hl.getIndex(elementId)
    addHashlistElement(hashlistPropPath, index + 1, {
        newElement: hl.getElementCopy(index, { cloneChildHashlists: true }),
    })
}

/**
 *
 * @param {number} elementIndex
 * @param {number} newElementIndex
 */
function changePositionInHashlist(hashlistPropPath, elementIndex, newElementIndex) {
    elementIndex = parseInt(elementIndex)
    newElementIndex = parseInt(newElementIndex)
    if (Number.isInteger(elementIndex) === false || elementIndex < 0) {
        throw new Error('Remix.changePositionInHashlist: Illegal elementIndex param')
    }
    if (Number.isInteger(newElementIndex) === false || newElementIndex < 0) {
        throw new Error('Remix.changePositionInHashlist: Illegal newElementIndex param')
    }
    if (!schema.getDescription(hashlistPropPath)) {
        throw new Error(`Remix.changePositionInHashlist: ${hashlistPropPath} is not described in schema`)
    }
    store.dispatch({
        type: REMIX_HASHLIST_CHANGE_POSITION_ACTION,
        path: hashlistPropPath,
        elementIndex: elementIndex,
        newElementIndex: newElementIndex,
    })
}

/**
 *
 * @param {string} hashlistPropPath
 * @param {object} targetElement - specify targetElement.elementId or targetElement.index
 */
function deleteHashlistElement(hashlistPropPath, targetElement) {
    if (hashlistPropPath === undefined) {
        throw new Error('Remix.deleteElement: hashlistPropPath is not specified')
    }
    if (!schema.getDescription(hashlistPropPath)) {
        throw new Error(`Remix.deleteElement: ${hashlistPropPath} is not described in schema`)
    }
    store.dispatch({
        type: REMIX_HASHLIST_DELETE_ACTION,
        path: hashlistPropPath,
        ...targetElement,
    })
}

export function setStore(astore) {
    store = astore
}

/**
 * Inites remix framework
 * Method for external init in index.html
 */
function init({ externalActions = [], container = null, mode = 'none', defaultProperties = '', origin, source, log }) {
    root = container
    containerOrigin = origin
    containerWindow = source
    logging = typeof log === 'boolean' ? log : LOG_BY_DEFAULT
    extActions = externalActions || []
    if (defaultProperties) {
        deserialize2(defaultProperties)
    } else if (window.__REMIX_DEFAULT_PROPERTIES__) {
        try {
            // один из способов передать свойства для запуска приложения. Используется при публикации
            deserialize2(window.__REMIX_DEFAULT_PROPERTIES__)
        } catch (err) {
            console.error('Cannot deserialize __REMIX_DEFAULT_PROPERTIES__ ', err.message)
        }
    }
    // mode устанавливаем после десериализации. Чтобы во время десериализации не рассылать события об изменении свойств
    // это произойдет потом единым событием
    setMode(mode)
    updateWindowSize()
    window.addEventListener('resize', debounce(onWindowResize, 500), false)
    stateHistory = []
    putStateHistory()
    Remix.fireEvent('remix_inited')
}

/**
 * Конвертация rgba(126,0,255,100) -> #7e00ff
 * @param {string} rgb
 * @returns {string}
 */
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/)
    function hex(x) {
        return ('0' + parseInt(x).toString(16)).slice(-2)
    }
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
}

/**
 * Проверить подходит ли строка под формат rgba(126,0,255,100)
 * @param {string} str
 * @return {boolean}
 */
function isRgb(str) {
    if (str) {
        str = str.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/)
        return !!str && !!str[1] && !!str[2] && !!str[3]
    }
    return false
}

/**
 *
 * @param {*} n
 */
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
}

function log(...msg) {
    if (logging) {
        console.log('Remix:', ...msg)
    }
}

/**
 * High Order Reducer:
 * - data normalization
 */
export function remixReducer({ reducers, dataSchema }) {
    if (!dataSchema) {
        throw new Error('Remix: schema is not defined')
    }
    if (dataSchema instanceof DataSchema === false) {
        throw new Error('Remix: schema must be instance of DataSchema class')
    }
    schema = dataSchema
    normalizer = new Normalizer(schema)
    // clients reducers + standart remix reducers
    const reducer = combineReducers({ ...reducers, app, router, session })
    log('data schema added. Selectors count ' + Object.keys(schema).length)

    return (state, action) => {
        log(`remixReducer: action.type="${action.type}" state=`, state)
        let nextState = null
        // if (action.type === REMIX_INIT_ACTION) {
        //     // empty data action, for data normalization
        //     nextState = {...state};
        // }
        // else
        if (action.type === REMIX_UPDATE_ACTION) {
            if (!action.data) {
                throw new Error('Remix: action.data is not specified')
            }
            nextState = _cloneState(state)
            _doUpdate(nextState, action.data)
        } else if (action.type === REMIX_HASHLIST_ADD_ACTION) {
            nextState = _cloneState(state)
            const targetHashlist = fetchHashlist(nextState, action.path, action.type)
            //TODO how to specify prototype id or index
            const protIndex = action.prototypeIndex || 0
            const newElement = action.hasOwnProperty('newElement')
                ? action.newElement
                : clone(schema.getDescription(action.path).prototypes[protIndex].data)
            targetHashlist.addElement(newElement, action.index)
            //assignByPropertyString(nextState, action.path, targetHashlist); не обязательно, так мы ранее полностью склонировали стейт и создали новые hashlist в том числе

            //TODO
            //nextState = {...reducer(nextState, {type: "REMIX_HASHLIST_ELEMENT_WAS_ADDED", property: action.path})};
            //клиентской логике приложения возможно надо запустить какую-то свою бизнес-логику
            // - например перераспределить баллы по результатам с появлением нового вопроса
            // - например создать новый экран (хотя это в компонентах может быть)
        } else if (action.type === REMIX_HASHLIST_CHANGE_POSITION_ACTION) {
            nextState = _cloneState(state)
            const targetHashlist = fetchHashlist(nextState, action.path, action.type)
            targetHashlist.changePosition(action.elementIndex, action.newElementIndex)
            //assignByPropertyString(nextState, action.path, targetHashlist); не обязательно, так мы ранее полностью склонировали стейт и создали новые hashlist в том числе

            //TODO
            //nextState = {...reducer(nextState, {type: "REMIX_HASHLIST_ELEMENT_POSITION_WAS_CHANGED", property: action.path})};
            //клиентской логике приложения возможно надо запустить какую-то свою бизнес-логику
            // - например перераспределить баллы по результатам с появлением нового вопроса
            // - например создать новый экран (хотя это в компонентах может быть)
        } else if (action.type === REMIX_HASHLIST_DELETE_ACTION) {
            nextState = _cloneState(state)
            const targetHashlist = fetchHashlist(nextState, action.path, action.type)
            if (action.elementId) {
                targetHashlist.deleteElementById(action.elementId)
            } else if (action.index >= 0) {
                targetHashlist.deleteElement(action.index)
            } else {
                throw new Error('Remix: can not delete hashlist element. You must specify "elementId" or "index"')
            }
            //assignByPropertyString(nextState, action.path, targetHashlist); не обязательно, так мы ранее полностью склонировали стейт и создали новые hashlist в том числе

            //TODO
            //nextState = {...reducer(nextState, {type: "REMIX_HASHLIST_ELEMENT_WAS_DELETED", property: action.path})};
            //клиентской логике приложения возможно надо запустить какую-то свою бизнес-логику
            // - например перераспределить баллы по результатам с появлением нового вопроса
            // - например создать новый экран (хотя это в компонентах может быть)
        } else {
            // it maybe @@redux/INITx.x.x.x actions
            // it maybe a regular app action
            nextState = reducer(state, action)
        }
        log('remixReducer: next state: ', nextState)
        // normalize data according to schema
        // in first start it's need to be normalized and store filled with default values
        if (normalizer) {
            nextState = normalizer.process(nextState)
            log('remixReducer: normalized next state: ', nextState)
        }
        // _lastUpdDiff = diff(state, nextState);
        // const changed = _lastUpdDiff.added.length > 0 || _lastUpdDiff.changed.length > 0 || _lastUpdDiff.deleted.length > 0;
        // if (changed) {
        //     log('Diff', _lastUpdDiff);
        // }
        // if (action.forceFeedback/* || changed*/) {
        //     _putOuterEventInQueue('properties_updated', {...getLastDiff(), state: serialize2(nextState)});
        // }
        _sendOuterEvents()
        return nextState
    }
}

//TODO если объявить свойство в схеме и не использовать редюсер, то оно стирается каждый раз, и потом нормализуется (дефолтное значение). Не решил пока проблема ли это.
// где пользователю объявлять кастомные данные типа getState().my.property
function app(state = {}) {
    return state
}

function router(state = {}, action) {
    switch (action.type) {
        case REMIX_SET_CURRENT_SCREEN: {
            return {
                ...state,
                currentScreenId: action.screenId,
            }
        }
    }
    // state sets by normalizer
    return state
}

/**
 *
 * @param {*} state
 * @param {*} action
 */
function session(
    state = {
        triggers: [],
        events: [],
        selectedComponentIds: [],
        mode: 'none',
        prerender: {},
        adaptedui: {},
        size: { width: undefined, height: undefined },
    },
    action,
) {
    switch (action.type) {
        case REMIX_ADD_TRIGGER: {
            //const newTriggers = (state.triggers) ? state.triggers.shallowClone().addElement(action.trigger): new HashList([action.trigger]);
            return {
                ...state,
                triggers: [...state.triggers, action.trigger],
            }
        }
        case REMIX_EVENT_FIRED: {
            // create events only in this place
            const event = {
                eventType: action.eventType,
                eventData: action.eventData,
                id: getUniqueId(),
                time: Date.now(),
                order: ++_orderCounter,
            }
            const newHistory = [...state.events, event]
            return {
                ...state,
                events: newHistory,
            }
        }
        case REMIX_EVENTS_CLEAR: {
            return {
                ...state,
                events: [],
            }
        }
        case REMIX_TRIGGERS_CLEAR: {
            return {
                ...state,
                triggers: [],
            }
        }
        case REMIX_SELECT_COMPONENT: {
            return {
                ...state,
                selectedComponentIds: action.componentIds || [],
            }
        }
        case REMIX_SET_MODE: {
            if (MODE_SET.has(action.mode)) {
                return { ...state, mode: action.mode }
            }
            return state
        }
        case REMIX_PRE_RENDER: {
            return {
                ...state,
                prerender: {
                    components: action.components,
                },
            }
        }
        case REMIX_SET_ADAPTED_PROPS: {
            return {
                ...state,
                adaptedui: {
                    ...state.adaptedui,
                    [action.width]: {
                        ...action.props,
                        height: action.height,
                    },
                },
            }
        }
        case REMIX_SET_SESSION_SIZE: {
            return {
                ...state,
                size: {
                    width: action.width,
                    height: action.height,
                },
            }
        }
        default:
            return state
    }
}

/**
 *
 * @param {object} state
 * @param {array | object} data
 */
function _doUpdate(state, data) {
    const pathesArr = Array.isArray(data) ? data.map(p => p.path) : Object.keys(data)
    const pathesValues = Array.isArray(data)
        ? data.reduce((res, elem) => {
              return { ...res, [elem.path]: elem.value }
          }, {})
        : data
    pathesArr.forEach(path => {
        const propDescription = schema.getDescription(path)
        if (!propDescription) {
            throw new Error(`Remix: can not find description for path "${path}" in schema`)
        }
        //Artem: 07.05.2020 зачем была сделана эта проверка? для нового типа object это не подходит
        // const propResult = getPropertiesBySelector(state, path)
        // if (propResult.length === 0) {
        //     throw new Error(`Remix: there is no such property ${path} in state`)
        // } else {
        const value = normalizer.processValue(path, pathesValues[path])
        assignByPropertyString(state, path, value)
        // }
    })
}

function _putOuterEventInQueue(method, data, eventIndex) {
    if (eventIndex !== undefined) {
        _outerEvents.splice(eventIndex, 0, { method: method, data: data })
    } else {
        _outerEvents.push({ method: method, data: data })
    }
}

//TODO очередь зачем? реализовать отправку по таймеру?
/**
 * События могут накапливаться в очереди пока приложение в состоянии 'none'
 */
function _sendOuterEvents() {
    // containerWindow.postMessage({method: 'app_size_changed'}, containerOrigin); ?
    // containerWindow.postMessage({method: 'send_data_state'}, containerOrigin); // on 'request_data_state'
    while (containerWindow && containerOrigin && _outerEvents.length > 0) {
        const e = _outerEvents.shift()
        // in postMessage default serialization algorythm is used https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
        // hashlist will be serialized as object
        containerWindow.postMessage({ ...e.data, method: e.method }, containerOrigin)
    }
}

// function _getLastUpdateDiff() {
//     return getLastDiff();
// }

function _setScreenEvents(updateData) {
    _putOuterEventInQueue('screens_updated', updateData)
    _sendOuterEvents()
}

/**
 * Send out a message to external services
 *
 * @param {string} method
 * @param {*} data
 */
export function postMessage(method, data) {
    _putOuterEventInQueue(method, data)
    _sendOuterEvents()
}

/**
 * Select a component on the screen
 * User can select some components
 *
 * @param {Array} componentIds - because we need support multiselect
 * @param {object} data - selected component props, screen props, dom rects, etc...
 * @param {boolean} options.postMessage - option to send or not notification back to container
 */
export function selectComponents(componentIds = [], data = {}, options = { postMessage: true }) {
    if (componentIds === null) {
        componentIds = []
    }
    const state = store.getState()
    // check if arrays contain the same ids
    // use this comparison method as arrays contain strings only
    if (JSON.stringify(state.router.selectedComponentIds) !== JSON.stringify(componentIds)) {
        store.dispatch({
            type: REMIX_SELECT_COMPONENT,
            componentIds,
        })
        if (options.postMessage) {
            // deep data clone is needed before postMessage
            postMessage('selected', { componentIds, ...clone(data) })
        }
    }
}

export function setMode(mode) {
    store.dispatch({
        type: REMIX_SET_MODE,
        mode,
    })
}

export function getMode() {
    return store ? store.getState().session.mode : 'none'
}

/**
 * Sets component position and size
 *
 * @param {string} id component id
 */
export function setComponentPosition({ id, top, left, width, height }, options) {
    const props = {}
    if (top !== undefined) props.top = top
    if (left !== undefined) props.left = left
    if (width !== undefined) props.width = width
    if (height !== undefined) props.height = height
    setComponentProps(id, props, options)
}

/**
 * Returns active screen id stored in router
 */
export function getActiveScreenId() {
    return store.getState().router.currentScreenId
}

/**
 * Return active screen properties
 */
export function getActiveScreen() {
    const state = store.getState()
    if (state.router.currentScreenId) {
        return state.router.screens[state.router.currentScreenId]
    }
    return null
}

/**
 * Helper function
 *
 * @param {*} path
 * @param {*} state
 * @param {*} action
 */
function fetchHashlist(state, path, actionType) {
    const fetchResult = getPropertiesBySelector(state, path)
    if (fetchResult.length === 0) {
        throw new Error(`Remix: no properties were found "${path}" for this action "${actionType}"`)
    }
    if (fetchResult.length > 1) {
        throw new Error(
            `Remix: you may not perform this action "${actionType}" only with one property, but ${fetchResult.length} were found in ${path}`,
        )
    }
    return fetchResult[0].value
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

/**
 * Deep cloning of all dynamic properties
 *
 * @param {object} state
 * @return {object} new state
 */
function _cloneState(state) {
    const json = serialize(state)
    // important to clone all embedded objects in path, ex. "app" and "size" in ""app.size.width"
    const newState = JSON.parse(JSON.stringify(state))
    // then assign all dynamic properties. because we must instantiate Hashlist with hashlist func constructor (not "object", when clonning JSON.parse - JSON.stringify)
    // TODO ideally you may write custom clone algorythm
    _doUpdate(newState, JSON.parse(json))
    return newState
}

/**
 * Serialize dynamic store properties
 * We use array to order properties. From more common props to specific ones
 *
 * @returns {string} example - '{"quiz.questions":{"_orderedIds":["54bwai","5lokro"],"54bwai":{"text":"Input your question"},"5lokro":{"text":"Input your question num2"}},"app.size.width":400,"app.size.height":400,"quiz.questions.54bwai.text":"Input your question","quiz.questions.5lokro.text":"Input your question num2"}'
 * You can see duplicate values ('Input your question'), It's OK when hashlist is serilized
 */
export function serialize(state) {
    // по схеме выбрать все пассы и сохранить их в объект
    const res = []
    const st = state || store.getState()
    schema.selectorsInProcessOrder.forEach(selector => {
        const propsToSerialize = getPropertiesBySelector(st, selector)
        propsToSerialize.forEach(prop => {
            res.push({ path: prop.path, value: prop.value })
        })
    })
    return JSON.stringify(res)
}

/**
 *
 * @param options.serializeAll - сериализовать все свойства схема. даже те которые помечены как несериализуемые
 * для операция undo/redo это важно. Пример currentScreen важно при редактировании. А при обычном сохранении проекта в апи - не нужно сохранять
 *
 * @result {string} json tree, only dynamic properties are included in this tree.
 * "app": {
 *      "size": {
 *          "width": 120,
 *          "height": 200
 *      }
 * },
 * "quiz": {
 *      "questions": {
 *          "54bwai": {
 *              text: 'Question title'
 *          },
 *          "ret67q": {
 *
 *          }
 *      }
 * }
 *
 * In this algorithm there is no duplicate values. Good for micro Editor. Moreover it is shorter.
 */
export function serialize2(state, options = {}) {
    const res = {}
    let st = state
    if (!st) {
        if (store) st = store.getState()
        else return
    }
    schema.selectorsInProcessOrder.forEach(selector => {
        const desc = schema.getDescription(selector)
        if (options.serializeAll || desc.serialize !== false) {
            const propsToSerialize = getPropertiesBySelector(st, selector)
            propsToSerialize.forEach(prop => {
                if (isHashlistInstance(prop.value)) {
                    let shallowValue = {}
                    // Prepare hashlist with empty items (only keys and orders)
                    // quiz
                    //  questions:
                    //    "54bwai": {},
                    //    "ret67q": {}
                    Object.keys(prop.value).forEach(k => (shallowValue[k] = {}))
                    assignByPropertyString(res, prop.path, {
                        ...shallowValue,
                        _orderedIds: prop.value._orderedIds,
                    })
                } else {
                    let v = prop.value
                    if (typeof v === 'string') {
                        v = htmlEncode(v)
                    }
                    assignByPropertyString(res, prop.path, v)
                }
            })
        }
    })
    return JSON.stringify(res)
}

/**
 * Deserialize dynamic store properties
 * You can put string got from serialize method
 *
 * @param {string} json
 */
export function deserialize(json) {
    if (typeof json === 'string') {
        remix.setData(JSON.parse(json))
    } else {
        throw new Error('Remix: json string expected')
    }
}

/**
 *
 * @param {string} json
 */
export function deserialize2(json) {
    if (typeof json === 'string') {
        const st = JSON.parse(json)
        const data = {}
        schema.selectorsInProcessOrder.forEach(selector => {
            const props = getPropertiesBySelector(st, selector, {
                typeCheckers: {
                    HashList: obj => obj.hasOwnProperty('_orderedIds'),
                },
            })
            props.forEach(p => {
                let v = p.value
                if (typeof v === 'string') {
                    v = htmlDecode(v)
                }
                data[p.path] = v
            })
        })
        log('deserialize2:', data)
        remix.setData(data)
    } else {
        throw new Error('Remix: json string expected')
    }
}

/**
 * Helper method
 * Get some screens by criteria
 *
 * @param {string} filter.tag
 * @param {boolean} filter.includeDisabled
 */
function getScreens(filter = {}) {
    return store
        .getState()
        .router.screens.toArray()
        .filter(s => {
            if (s.disabled && !filter.includeDisabled) {
                return false
            }
            return filter.tag ? s.tags && s.tags.indexOf(filter.tag) >= 0 : true
        })
}

/**
 * Helper method
 * Get some components by its display name and tag
 *
 * @param {string} filter.displayName
 * @param {string} filter.tags
 */
export function getComponents(filter = {}) {
    const components = []
    store
        .getState()
        .router.screens.toArray()
        .filter(scr => (filter.tags ? scr.tags.indexOf(filter.tags) > 0 : true))
        .forEach(scr => {
            scr.components.toArray().forEach(c => (c.displayName === filter.displayName ? components.push(c) : null))
        })
    return components
}

/**
 * Returns all dynamic properties with additional information from this remix app
 * Additional information: screenId, componentId if relevant
 * Example: property 'router.screens.8wruuz.components.zbnkhy.fontShadow' has relevant 'screenId' and 'componentId'
 *      but property 'router.screens.f5n509.tags' only 'screenId'
 *
 * @return {Array}
 */
function getProperties() {
    const res = [],
        st = store.getState()
    if (!st) {
        return
    }
    schema.selectorsInProcessOrder.forEach(selector => {
        const propsToSerialize = getPropertiesBySelector(st, selector)
        propsToSerialize.forEach(prop => {
            // Also try to detect 'screenId', 'componentId' which holds this property. It's an additional data for filtering in external services, like editors, etc..
            res.push({
                path: prop.path,
                value: prop.value,
                screenId: getScreenIdFromPath(prop.path),
                componentId: getComponentIdFromPath(prop.path),
            })
        })
    })
    return res
}

/**
 * Сохранить текущий стейт в историю операций
 */
function putStateHistory() {
    if (stateHistoryIndex < stateHistory.length - 1) {
        // это значит были произведены undo операции ранее, а теперь новое редактирование
        // с созданием новой версии, изменения который были "впереди" удаляются насовсем. Им нельзя сделать redo
        stateHistory.splice(stateHistoryIndex + 1, stateHistory.length)
    }
    stateHistory.push(store.getState())
    stateHistoryIndex = stateHistory.length - 1
}

/**
 * Отменить предыдущую операцию
 */
export function undo() {
    if (stateHistoryIndex > 0) {
        --stateHistoryIndex
        deserialize2(serialize2(stateHistory[stateHistoryIndex], { serializeAll: true }))
    }
}

/**
 * Повторить отмененную операцию
 */
export function redo() {
    if (stateHistoryIndex < stateHistory.length - 1) {
        ++stateHistoryIndex
        deserialize2(serialize2(stateHistory[stateHistoryIndex], { serializeAll: true }))
    }
}

/**
 * Add new properties descriptions to app schema
 * Plugins may use this method
 */
function extendSchema(schm) {
    schema = schema.extend(schm)
    normalizer = new Normalizer(schema)
}

/**
 * App and plugin authors can declare function to use in applications, triggers etc..
 * Call by name later..
 */
function addCustomFunction(fnName, fn) {
    customFunctions[fnName] = fn
}

/**
 * Call the declared custom function
 */
function callCustomFunction(fnName) {
    if (customFunctions[fnName]) {
        return customFunctions[fnName].call(remix)
    }
    throw new Error(`custom function not found ${fnName}`)
}

/**
 * Helper method.
 * Add component from the screen
 *
 * @param {string} screenId
 * @param {object} props, example
    {
        displayName: 'Progress',
        id: COMPONENT_ID,
        left: 20,
        top: 20,
        step: i + 1,
        max: scrs.length,
        color: '#fff'
    }
 *
 */
function addScreenComponent(screenId, componentProps) {
    let path = `router.screens.${screenId}.components`
    this.addHashlistElement(path, undefined, { newElement: componentProps })
}
/**
 * Helper method.
 * Delete component from the screen
 */
function deleteScreenComponent(screenId, componentId) {
    let path = `router.screens.${screenId}.components`
    this.deleteHashlistElement(path, { elementId: componentId })
}
/**
 * Helper method
 * Set existing component props
 *
 * @param {string} componentId
 * @param {object} props
 * @param {boolean} options.putStateHistory
 */
export function setComponentProps(componentId, props, options) {
    const state = store.getState(),
        editingCustomWidth =
            state.session.mode === 'edit' &&
            state.session.size.width > 0 &&
            state.app.size.width > 0 &&
            state.app.size.width !== state.session.size.width

    if (!_componentIdToScreenId[componentId]) {
        calcComponentIdScreenIdHash(state.router.screens)
    }
    const screenId = _componentIdToScreenId[componentId]
    if (screenId) {
        let path = `router.screens.${screenId}.components.${componentId}.`
        const data = {},
            adaptedData = {}
        Object.keys(props).forEach(prop => {
            const propDescription = schema.getDescription(path + prop)
            if (editingCustomWidth && propDescription && propDescription.adaptedForCustomWidth) {
                // если ширина кастомная и свойство помечено как адаптивное то сохраняем его отдельно в адаптацию
                adaptedData[prop] = props[prop]
            } else {
                data[path + prop] = props[prop]
            }
        })
        setData(data)
        if (editingCustomWidth && Object.keys(adaptedData).length > 0) {
            // если было сделано хотя бы одно изменение пользователем компонентов при нестандартной ширине, то сохраняем как отдельную адаптацию
            saveAdaptedProps(componentId, adaptedData)
        }
    }
    if (options && options.putStateHistory === true) {
        putStateHistory()
    }
}

/**
 *
 * @param {*} componentId
 * @param {*} props
 */
function saveAdaptedProps(componentId, props) {
    const state = store.getState(),
        sessionWidth = state.session.size.width
    if (!(state.app.adaptedui && state.app.adaptedui[sessionWidth]) && state.session.adaptedui[sessionWidth]) {
        // если такая адаптация еще не существует, создать на основе сессии
        // state.session.adaptedui уже к этому моменту была вычислена автоматически
        setData({ [`app.adaptedui.${sessionWidth}`]: state.session.adaptedui[sessionWidth] })
    }
    // сохраняем некоторые свойства, если они были изменены при другой ширине приложения
    // например: геометрические свойства (top, left, width, height) сохраняем для мобильной версии приложения
    //assignByPropertyString(state, `app.adaptedui.${state.session.size.width}.${componentId}.${adaptedProp}`, value)
    setData({ [`app.adaptedui.${state.session.size.width}.${componentId}.${adaptedProp}`]: value })
    // для сессии также надо сохранить новые значения
    // экраны берут адаптированные значения именно из session.adaptedui, в то время как в app.adaptedui они хранятся для сериализации
    //assignByPropertyString(state, `session.adaptedui.${state.session.size.width}.${componentId}.${adaptedProp}`, value)
    //setData(state, `session.adaptedui.${state.session.size.width}.${componentId}.${adaptedProp}`, value)
}

function calcComponentIdScreenIdHash(screens) {
    _componentIdToScreenId = {}
    screens.toArray().forEach(scr => {
        scr.components.toArray().forEach(cmp => {
            _componentIdToScreenId[cmp.hashlistId] = scr.hashlistId
        })
    })
}

export function getState() {
    return store.getState()
}

export function getProperty(path) {
    const r = getPropertiesBySelector(store.getState(), path)
    if (r.length > 0) {
        return r[0].value
    }
    return undefined
}

const remix = {
    // public methods
    init,
    extendSchema,
    addCustomFunction,
    callCustomFunction,
    addScreenComponent,
    deleteScreenComponent,
    setData,
    setSize,
    getScreens,
    getComponents,
    addHashlistElement,
    changePositionInHashlist,
    deleteHashlistElement,
    serialize,
    serialize2,
    deserialize,
    deserialize2,
    dispatchAction,
    addTrigger,
    registerTriggerAction,
    addMessageListener,
    setMode,
    getMode,
    fireEvent,
    setCurrentScreen,
    clearTriggersAndEvents,
    getProperties,
    setStore,
    setComponentProps,
    undo,
    redo,
    postMessage,

    // for debug
    _setScreenEvents,
    _triggerActions,
    _getSchema: () => schema,
    getState: () => store.getState(),
    _putOuterEventInQueue,
    _sendOuterEvents,
    _getStateHistory: () => stateHistory,
}

export default remix

window.Remix = remix // for debug
