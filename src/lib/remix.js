import DataSchema from './schema.js'
import Normalizer from './normalizer.js'
import { assignByPropertyString, getPropertiesBySelector, getPathes } from './object-path.js'
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
    throttle,
    parseComponentPath,
    parseComponentAdapteduiPath,
    getPopupIdFromPath,
    getPopupComponentIdFromPath,
    isPathToPopupComponent,
    parsePopupComponentPath,
    parsePopupComponentAdapteduiPath,
} from './remix/util/util.js'
import { updateWindowSize, updateAppHeight, getContainerSize, checkScreensAdaptation } from './remix/layout/helpers'

export const REMIX_UPDATE_ACTION = '__Remix_update_action__'
export const REMIX_RESET_STATE = '__Remix_reset_state__'
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
    _onPostMessage = null,
    store = null,
    schema = null,
    _masters = {},
    customFunctions = {},
    normalizer = null,
    extActions = null,
    stateHistoryIndex = 0,
    stateHistory = [],
    _outerEvents = [],
    _orderCounter = 0,
    _triggerActions = {},
    _componentIdToScreenId = {},
    _componentIdToPath = {},
    _externalListeners = {}

let copyPasteData = {
    selectedComponentIds: [],
    screenId: void 0,
    popupId: void 0,
    copyFromPopup: false,
}

export const getScreenIdByComponentId = (componentId, state) => {
    state = state || store.getState()

    if (!_componentIdToScreenId[componentId]) {
        calcComponentIdScreenIdHash(state.router.screens)
    }

    return _componentIdToScreenId[componentId]
}

export const getPathByComponentId = (componentId, state) => {
    state = state || store.getState()

    if (typeof _componentIdToPath[componentId] !== 'string') {
        calcComponentIdStatePath(state.router, 'router')
    }

    return _componentIdToPath[componentId]
}

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
            } else if (e.ctrlKey) {
                if (k === 'C') {
                    const state = store.getState()
                    const selectedComponentIds = state.session.selectedComponentIds

                    if (Array.isArray(selectedComponentIds) && selectedComponentIds.length) {
                        copyPasteData = {
                            selectedComponentIds,
                            screenId: state.router.currentScreenId,
                            popupId: state.router.activePopupId,
                            copyFromPopup: state.router.showPopup,
                        }
                    }
                }

                if (k === 'V') {
                    const { selectedComponentIds, screenId, popupId, copyFromPopup } = copyPasteData

                    if (selectedComponentIds.length) {
                        const state = store.getState()

                        const toScreenId = state.router.currentScreenId
                        const copyToPopup = state.router.showPopup
                        const toPopupId = state.router.activePopupId

                        const pathToComponentsSource = `router.screens.${screenId}${
                            copyFromPopup ? `.popups.${popupId}` : ''
                        }.components`
                        const sourceHashlist = getProperty(pathToComponentsSource, state)
                        if (!sourceHashlist) {
                            throw new Error('could not get hashlist components')
                        }

                        const pathToComponentsDist = `router.screens.${toScreenId}${
                            copyToPopup ? `.popups.${toPopupId}` : ''
                        }.components`

                        const needShift = copyFromPopup && copyToPopup ? popupId === toPopupId : screenId === toScreenId

                        selectedComponentIds.forEach(componentId => {
                            const index = sourceHashlist.getIndex(componentId)
                            const newElement = sourceHashlist.getElementCopy(index, {
                                cloneChildHashlists: true,
                                replaceObjectIds: true,
                            })

                            if (newElement.data) {
                                newElement.data.copyPopupId = newElement.data.popupId
                                newElement.data.popupId = ''
                            }

                            if (needShift) {
                                newElement.top += 15
                                newElement.left += 15
                            }

                            addHashlistElement(pathToComponentsDist, void 0, { newElement })
                        })
                    }
                }
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
        setData(data.data, data.forceFeedback, data.immediate, data.calcConditions)
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
    }
    if (data.method === 'addhashlistelement') {
        addHashlistElement(data.propertyPath, data.index, { newElement: data.newElement })
        putStateHistory()
    }
    if (data.method === 'insertafterhashlistelement') {
        insertAfterHashlistElement(data.propertyPath, data.beforeId, { newElement: data.newElement })
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
        if (data.size.width > 0) {
            root.style.width = data.size.width + 'px'
        }
        if (data.size.height > 0) {
            root.style.height = data.size.height + 'px'
        }
        updateWindowSize(root)
    }
}

function onWindowResize() {
    updateWindowSize(root)
}

/**
 * Assign new property values to store
 *
 * @param {object} data, example {'path.to.the.property': 'newvalue'}
 */
let __data = {}
export function setData(data, forceFeedback = false, immediate = false, calcConditions = true) {
    if (typeof data !== 'object') {
        throw new Error(`You must pass data object as first argument, example {'path.to.the.property': 123}`)
    }
    const state = store.getState()

    if (calcConditions) {
        data = { ...data, ...calcConditionalProperties(state, data) }
    }

    if (immediate) {
        store.dispatch({
            type: REMIX_UPDATE_ACTION,
            data,
            forceFeedback,
        })
    } else {
        __data = { ...__data, ...data }
        __callSetData(forceFeedback)
    }
}

const __callSetData = throttle(forceFeedback => {
    store.dispatch({
        type: REMIX_UPDATE_ACTION,
        data: __data,
        forceFeedback,
    })
    __data = {}
}, 100)

function setCurrentScreen(screenId) {
    store.dispatch({
        type: REMIX_SET_CURRENT_SCREEN,
        screenId,
    })
}

/**
 *
 * @param {*} state текущий стейт
 * @param {*} data данные которые будут установлены в setState
 */
function calcConditionalProperties(state, data) {
    let conditionalData = {}

    // меняется мастер свойство
    // несколько свойств зависят от этого мастер-свойства и их надо пересчитать
    Object.keys(data).forEach(path => {
        if (_masters[path]) {
            _masters[path].forEach(mp => {
                const slaveProperties = getPropertiesBySelector(state, mp.selector)

                slaveProperties.forEach(slave => {
                    if (isPathToPopupComponent(slave.path)) {
                        const { screenId, popupId, popupComponentId, propName } = parsePopupComponentPath(slave.path),
                            condSlaveSelector = mp.condition.popupConditionPath({
                                screenId,
                                popupId,
                                popupComponentId,
                                propName,
                            }),
                            savedValues = {}

                        getPathes(state, condSlaveSelector).forEach(condPath => {
                            const k = mp.condition.parseKeyInPopup(condPath),
                                v = getProperty(condPath)
                            if (k !== undefined && v !== undefined) {
                                savedValues[k] = v
                            }
                        })

                        const dd = mp.condition.onMasterChanged({
                            masterValue: data[path],
                            savedValues,
                        })

                        if (dd) {
                            if (dd.key === undefined || dd.value === undefined) {
                                throw new Error(`"onMasterChanged" must return key-value object. Path: ${path}`)
                            }
                            // console.log(
                            //     `Master property "${path}" changed to "${data[path]}". And slave property changed: "router.screens.${screenId}.components.${componentId}.${propName}" to "${dd.value}"`,
                            // )
                            conditionalData = {
                                ...conditionalData,
                                [`router.screens.${screenId}.popups.${popupId}.components.${popupComponentId}.${propName}`]: dd.value,
                            }
                        }
                    } else {
                        const { screenId, componentId, propName } = parseComponentPath(slave.path),
                            condSlaveSelector = mp.condition.conditionPath({ screenId, componentId, propName }),
                            savedValues = {}

                        getPathes(state, condSlaveSelector).forEach(condPath => {
                            const k = mp.condition.parseKey(condPath),
                                v = getProperty(condPath)
                            if (k !== undefined && v !== undefined) {
                                savedValues[k] = v
                            }
                        })

                        const dd = mp.condition.onMasterChanged({
                            masterValue: data[path],
                            savedValues,
                        })
                        if (dd) {
                            if (dd.key === undefined || dd.value === undefined) {
                                throw new Error(`"onMasterChanged" must return key-value object. Path: ${path}`)
                            }
                            // console.log(
                            //     `Master property "${path}" changed to "${data[path]}". And slave property changed: "router.screens.${screenId}.components.${componentId}.${propName}" to "${dd.value}"`,
                            // )
                            conditionalData = {
                                ...conditionalData,
                                [`router.screens.${screenId}.components.${componentId}.${propName}`]: dd.value,
                            }
                        }
                    }
                })
            })
        }
    })

    // устанавливаем условное свойство, надо сохранить adaptedui свойства
    Object.keys(data).forEach(path => {
        const d = schema.getDescription(path)
        if (d && d.condition) {
            if (!d.condition.onSave || !d.condition.onMasterChanged) {
                throw new Error(`You must set "onSave" and "onMasterChanged" function for conditonal property ${path}`)
            }

            if (isPathToPopupComponent(path)) {
                const { screenId, popupId, popupComponentId, propName } = parsePopupComponentPath(path)

                if (!screenId || !popupId || !popupComponentId || !propName) {
                    throw new Error(
                        `Only component conditional properties are supported now, example: "router.screens.123.popups.123.components.123.propname"`,
                    )
                }

                const masterValue = data[d.condition.master] || getProperty(d.condition.master, state)
                const dt = d.condition.onSave({ masterValue, path, data })
                if (dt) {
                    Object.keys(dt).forEach(key => {
                        // Условные значения будут сохранены в экране: например  router.screens.${screenId}.adaptedui.320.props.${componentId}.left
                        conditionalData = {
                            ...conditionalData,
                            [d.condition.popupConditionPath({
                                screenId,
                                popupId,
                                popupComponentId,
                                key,
                            })]: dt[key],
                        }
                    })
                }
            } else {
                const { screenId, componentId, propName } = parseComponentPath(path)

                if (!screenId || !componentId || !propName) {
                    throw new Error(
                        `Only component conditional properties are supported now, example: "router.screens.123.components.123.propname"`,
                    )
                }

                const masterValue = data[d.condition.master] || getProperty(d.condition.master, state)
                const dt = d.condition.onSave({ masterValue, path, data, state, screenId, componentId })
                if (dt) {
                    Object.keys(dt).forEach(key => {
                        // Условные значения будут сохранены в экране: например  router.screens.${screenId}.adaptedui.320.props.${componentId}.left
                        conditionalData = {
                            ...conditionalData,
                            [d.condition.conditionPath({ screenId, componentId, key })]: dt[key],
                        }
                    })
                }
            }
        }
    })

    // сохраняем условие, и надо проверить стоит ли обновить текущее значение свойства
    // пример: после расчета адаптации. Ведь адаптационных алгоритм обновляет только adapted свойство и не ставит текущие напрямую
    Object.keys(data).forEach(path => {
        // если path подходит под conditionPath
        const condDesc = schema.getDescription(path)
        if (condDesc.conditionOf) {
            if (path.includes('popups')) {
                const { screenId, popupId, masterKey, popupComponentId, propName } = parsePopupComponentAdapteduiPath(
                    path,
                )
                if (screenId && popupId && masterKey && popupComponentId && propName) {
                    const mainPath = condDesc.conditionOf({ screenId, popupId, popupComponentId, propName })
                    const d = schema.getDescription(mainPath)
                    if (d) {
                        const masterValue = data[d.condition.master] || getProperty(d.condition.master, state)
                        if (masterKey == masterValue) {
                            conditionalData = {
                                ...conditionalData,
                                [mainPath]: data[path],
                            }
                        }
                    } else {
                        throw new Error(`Condition path not found for ${path}`)
                    }
                } else {
                    throw new Error(`This conditional ${path} not supported`)
                }
            } else {
                const { screenId, masterKey, componentId, propName } = parseComponentAdapteduiPath(path)

                if (screenId && masterKey && componentId && propName) {
                    const mainPath = condDesc.conditionOf({ screenId, componentId, propName })
                    const d = schema.getDescription(mainPath)
                    if (d) {
                        const masterValue = data[d.condition.master] || getProperty(d.condition.master, state)
                        if (masterKey == masterValue) {
                            conditionalData = {
                                ...conditionalData,
                                [mainPath]: data[path],
                            }
                        }
                    } else {
                        throw new Error(`Condition path not found for ${path}`)
                    }
                } else {
                    throw new Error(`This conditional ${path} not supported`)
                }
            }
        }
    })

    return conditionalData
}

/**
 * Пройти по всем условным свойствам и установить их значения при текущем мастере
 * Во-первых это нужно после добавления новых экранов/компонентов, при появлении новых свойств
 * Во-вторых при открытии шаблона в котором нет adaptedui
 *
 * Похоже на 'calcConditionalProperties' но делаем это для всех условных свойств
 */
function normalizeConditionalProperties() {
    const state = getState(),
        masterValues = {}
    let conditionalData = {}

    Object.keys(schema._schm).forEach(selector => {
        const desc = schema._schm[selector]
        if (desc.condition && desc.condition.master) {
            if (!masterValues[desc.condition.master]) {
                masterValues[desc.condition.master] = getProperty(desc.condition.master, state)
            }

            const masterValue = masterValues[desc.condition.master],
                pathes = getPropertiesBySelector(state, selector)

            pathes.forEach(prop => {
                try {
                    const path = prop.path
                    if (isPathToPopupComponent(path)) {
                        const { screenId, popupId, popupComponentId, propName } = parsePopupComponentPath(path)

                        if (!screenId || !popupId || !popupComponentId || !propName) {
                            throw new Error(
                                `Only component conditional properties are supported now, example: "router.screens.123.popups.123.components.123.propname"`,
                            )
                        }

                        const data = { [prop.path]: prop.value }
                        const dt = desc.condition.onSave({ masterValue, path, data })
                        if (dt) {
                            Object.keys(dt).forEach(key => {
                                const condPath = desc.condition.popupConditionPath({
                                    screenId,
                                    popupId,
                                    popupComponentId,
                                    key,
                                })
                                if (!getProperty(condPath, state)) {
                                    // Условные значения будут сохранены в экране: например  router.screens.${screenId}.adaptedui.320.props.${componentId}.left
                                    conditionalData = {
                                        ...conditionalData,
                                        [condPath]: dt[key],
                                    }
                                }
                            })
                        }
                    } else {
                        const { screenId, componentId, propName } = parseComponentPath(path)

                        if (!screenId || !componentId || !propName) {
                            throw new Error(
                                `Only component conditional properties are supported now, example: "router.screens.123.components.123.propname"`,
                            )
                        }

                        const data = { [prop.path]: prop.value }
                        const dt = desc.condition.onSave({ masterValue, path, data, state, screenId, componentId })
                        if (dt) {
                            Object.keys(dt).forEach(key => {
                                const condPath = desc.condition.conditionPath({ screenId, componentId, key })
                                if (!getProperty(condPath, state)) {
                                    // Условные значения будут сохранены в экране: например  router.screens.${screenId}.adaptedui.320.props.${componentId}.left
                                    conditionalData = {
                                        ...conditionalData,
                                        [condPath]: dt[key],
                                    }
                                }
                            })
                        }
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        }
    })
    if (Object.keys(conditionalData).length > 0) {
        setData(conditionalData, false, true)
    }
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
export function fireEvent(eventType, eventData) {
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
    if (hashlistPropPath === 'router.screens') {
        checkScreensAdaptation()
    }
    // так как появились новые свойства, то для них надо запустить проверку условных свойств
    normalizeConditionalProperties()
}

/**
 *
 * @param {string} hashlistPropPath
 * @param {string} beforeId
 * @param {*} elementData.newElement
 * @param {number} elementData.prototypeIndex
 */
function insertAfterHashlistElement(hashlistPropPath, beforeId, elementData = {}) {
    if (hashlistPropPath === undefined) {
        throw new Error('Remix.addElement: hashlistPropPath is not specified')
    }
    if (!schema.getDescription(hashlistPropPath)) {
        throw new Error(`Remix.addElement: ${hashlistPropPath} is not described in schema`)
    }
    const index = fetchHashlist(getState(), hashlistPropPath).getIndex(beforeId) + 1
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
    if (hashlistPropPath === 'router.screens') {
        checkScreensAdaptation()
    }
    normalizeConditionalProperties()
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
    const newElement = hl.getElementCopy(index, { cloneChildHashlists: true, replaceObjectIds: true })
    addHashlistElement(hashlistPropPath, index + 1, { newElement })
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
function init({
    externalActions = [],
    container = null,
    mode = 'none',
    defaultProperties = '',
    origin,
    source,
    log,
    onPostMessage,
}) {
    root = container
    containerOrigin = origin
    containerWindow = source
    _onPostMessage = onPostMessage
    logging = typeof log === 'boolean' ? log : LOG_BY_DEFAULT
    extActions = externalActions || []
    const additionalData = {}
    if (defaultProperties) {
        // calcConditions: false - условия рассчитаем позже, при услановке размера контейнера.
        // если сразу устанавливать то функция calcConditionalProperties не может обработать эту ситуацию
        deserialize2(defaultProperties, { additionalData, calcConditions: false })
    } else if (window.__REMIX_DEFAULT_PROPERTIES__) {
        try {
            // один из способов передать свойства для запуска приложения. Используется при публикации
            deserialize2(window.__REMIX_DEFAULT_PROPERTIES__, { additionalData, calcConditions: false })
        } catch (err) {
            console.error('Cannot deserialize __REMIX_DEFAULT_PROPERTIES__ ', err.message)
        }
    }
    // mode устанавливаем после десериализации. Чтобы во время десериализации не рассылать события об изменении свойств
    // это произойдет потом единым событием
    setMode(mode)
    updateWindowSize(root)
    if (mode === 'edit') {
        // при открытии шаблона в котором может еще не быть adaptedui надо сделать запись условных свойств
        normalizeConditionalProperties()
    }
    window.addEventListener('resize', debounce(onWindowResize, 500), false)
    stateHistory = []
    putStateHistory()
    Remix.fireEvent('remix_inited')
}

function reset() {
    store.dispatch({
        type: REMIX_RESET_STATE,
    })
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
    cacheMasterProperties(schema)
    normalizer = new Normalizer(schema)
    // clients reducers + standart remix reducers
    const reducer = combineReducers({ ...reducers, app, router, session })
    log('data schema added. Selectors count ' + Object.keys(schema).length)

    return (state, action) => {
        log(`remixReducer: action.type="${action.type}" state=`, state)
        let nextState = null

        if (action.type === REMIX_RESET_STATE) {
            nextState = undefined
        } else if (action.type === REMIX_UPDATE_ACTION) {
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
        } else if (action.type === REMIX_HASHLIST_CHANGE_POSITION_ACTION) {
            nextState = _cloneState(state)
            const targetHashlist = fetchHashlist(nextState, action.path, action.type)
            targetHashlist.changePosition(action.elementIndex, action.newElementIndex)
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
        _sendOuterEvents()
        return nextState
    }
}

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
    const pathesValues = Array.isArray(data) ? Object.fromEntries(data.map(elem => [elem.path, elem.value])) : data
    pathesArr.forEach(path => {
        const propDescription = schema.getDescription(path)
        if (!propDescription) {
            throw new Error(`Remix: can not find description for path "${path}" in schema`)
        }
        //Artem: 07.05.2020 зачем была сделана эта проверка? для нового типа object это не подходит
        //const propResult = getPropertiesBySelector(state, path)
        //if (propResult.length === 0) {
        //TODO experiment
        // при асинхронное работе setState такая ситуация теперь возможна, начиная с 26.05.2020
        //throw new Error(`Remix: there is no such property ${path} in state`)
        //} else {
        const value = normalizer.processValue(path, pathesValues[path])
        assignByPropertyString(state, path, value)
        //}
    })
}

function _putOuterEventInQueue(method, data, eventIndex) {
    if (eventIndex !== undefined) {
        _outerEvents.splice(eventIndex, 0, { method: method, data: data })
    } else {
        _outerEvents.push({ method: method, data: data })
    }
    if (_onPostMessage) {
        _onPostMessage({ method: method, data: data })
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

export function getSchema() {
    return schema
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
    // important to clone all embedded objects in path, ex. "app" and "size" in "app.size.width"
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
export function deserialize2(json, options = {}) {
    if (typeof options.calcConditions !== 'boolean') {
        options.calcConditions = true
    }
    if (typeof json === 'string') {
        const st = JSON.parse(json)
        let data = {}
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
        if (options.additionalData) {
            data = { ...data, ...options.additionalData }
        }
        log('deserialize2:', data)
        remix.setData(data, false, true, options.calcConditions)
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
export function getScreens(filter = {}) {
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
 * @param {string} filter.screenTag
 * @param {string} filter.tag
 */
export function getComponents(filter = {}) {
    const components = []
    store
        .getState()
        .router.screens.toArray()
        .filter(scr => (filter.screenTag ? scr.tags.indexOf(filter.screenTag) >= 0 : true))
        .forEach(scr => {
            scr.components
                .toArray()
                .forEach(c =>
                    (!filter.displayName || c.displayName === filter.displayName) &&
                    (!filter.tag || c.tags.indexOf(filter.tag) >= 0)
                        ? components.push({ ...c, screen: scr })
                        : null,
                )
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
                popupId: getPopupIdFromPath(prop.path),
                popupComponentId: getPopupComponentIdFromPath(prop.path),
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
export function extendSchema(schm) {
    schema = schema.extend(schm)
    cacheMasterProperties(schema)
    normalizer = new Normalizer(schema)
}

function cacheMasterProperties(schm) {
    _masters = {}
    Object.keys(schm._schm).forEach(selector => {
        const desc = schm._schm[selector]
        if (desc.condition && desc.condition.master) {
            if (!_masters[desc.condition.master]) {
                // несколько селекторов могут зависеть от одного мастера
                _masters[desc.condition.master] = []
            }
            if (typeof desc.condition.master !== 'string') {
                throw new Error(`"master" must be a string. ${selector}`)
            }
            _masters[desc.condition.master].push({
                condition: desc.condition,
                selector,
            })
        }
    })
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
 * @param {object || Array} props
 * @param {boolean} options.putStateHistory
 * @param {boolean} options.immediate
 */
export function setComponentProps(newProps, options = {}) {
    newProps = !Array.isArray(newProps) ? [newProps] : newProps

    const data = {},
        state = store.getState()

    newProps.forEach(newp => {
        if (!newp.id) {
            throw new Error('You must setsetData a component id in new props')
        }

        const pathToComponent = getPathByComponentId(newp.id, state)
        if (typeof pathToComponent === 'string') {
            const path = `${_componentIdToPath[newp.id]}.${newp.id}.`
            Object.keys(newp).forEach(key => {
                data[path + key] = newp[key]
            })
        }
    })
    if (Object.keys(data).length > 0) {
        setData(data, false, options.immediate)
        if (options && options.putStateHistory === true) {
            putStateHistory()
        }
    }
}

function calcComponentIdScreenIdHash(screens) {
    _componentIdToScreenId = {}
    screens.toArray().forEach(scr => {
        scr.components.toArray().forEach(cmp => {
            _componentIdToScreenId[cmp.hashlistId] = scr.hashlistId
        })
    })
}

function calcComponentIdStatePath(state, pathToState = '') {
    _componentIdToPath = {}

    const recursive = (obj, pathToObj) => {
        for (const key of Object.keys(obj)) {
            const newPath = pathToObj.length ? `${pathToObj}.${key}` : key

            if (key === 'components') {
                obj[key].toArray().forEach(cmp => {
                    _componentIdToPath[cmp.hashlistId] = newPath
                })
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                recursive(obj[key], newPath)
            }
        }
    }

    if (state) recursive(state, pathToState)
}

export function getState() {
    return store.getState()
}

export function getStore() {
    return store
}

export function getRoot() {
    return root
}

export function getProperty(path, state) {
    state = state || store.getState()
    const r = getPropertiesBySelector(state, path)
    if (r.length > 0) {
        return r[0].value
    }
    return undefined
}

export function updateHeight() {
    updateAppHeight()
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
    getScreens,
    getComponents,
    addHashlistElement,
    cloneHashlistElement,
    insertAfterHashlistElement,
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
    getSchema,
    getProperty,
    getRoot,
    updateHeight,
    reset,

    // for debug
    _setScreenEvents,
    _triggerActions,
    getState: () => store.getState(),
    _putOuterEventInQueue,
    _sendOuterEvents,
    _getStateHistory: () => stateHistory,
    _receiveMessage: receiveMessage,
}

export default remix

window.Remix = remix // for debug
