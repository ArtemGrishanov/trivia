import DataSchema from './schema.js'
import Normalizer from './normalizer.js'
import HashList from './hashlist.js'
import {
    assignByPropertyString,
    getPropertiesBySelector
} from './object-path.js'

export const REMIX_UPDATE_ACTION = '__Remix_update_action__';
//export const REMIX_INIT_ACTION = '__Remix_init_action__'; redux standart init action is used
export const REMIX_HASHLIST_ADD_ACTION = '__Remix_hashlist_update_action__';
export const REMIX_HASHLIST_CHANGE_POSITION_ACTION = '__Remix_hashlist_change_position_action__'
export const REMIX_HASHLIST_DELETE_ACTION = '__Remix_hashlist_delete_action__';
export const REMIX_EVENT_FIRED = '__Remix_event_fired__';
export const REMIX_EVENTS_CLEAR = '__Remix_events_clear__'
export const REMIX_ADD_TRIGGER = '__Remix_add_trigger__'
export const REMIX_MARK_AS_EXECUTED = '__REMIX_MARK_AS_EXECUTED__'
export const REMIX_SET_CURRENT_SCREEN = '__Remix_set_current_screen__'

const remix = {};

//TODO specify origin during publishing?
//const containerOrigin = "http://localhost:8080";
const EXPECTED_CONTAINER_ORIGIN = null;
const MODE_SET = new Set(['edit', 'preview', 'published']);
const LOG_BY_DEFAULT = false;

let logging = LOG_BY_DEFAULT;
let containerOrigin = null;
let containerWindow = null;
let store = null;
let schema = null;
let customFunctions = {};
let normalizer = null;
let extActions = null;
let root = null;
let initialSize = null;
let mode = 'none'; // edit | preview | published
let _lastUpdDiff = null;
let _outerEvents = [];
let _orderCounter = 0;
let _triggerActions = {};

// establish communication with RContainer
window.addEventListener("message", receiveMessage, false);

/**
 * Получить и обработать сообщение
 * @param {Object} event
 */
function receiveMessage({origin = null, data = {}, source = null}) {
    if (data.method) {
        log(data.method + ' message received');
    }
    if (EXPECTED_CONTAINER_ORIGIN && origin !== EXPECTED_CONTAINER_ORIGIN) {
        return;
    }
    if (data.method === 'init') {
        containerOrigin = origin;
        containerWindow = source;
        if (MODE_SET.has(data.mode)) {
            mode = data.mode;
        }
        logging = typeof data.log === "boolean" ? data.log: LOG_BY_DEFAULT;
        initialSize = data.initialSize;
        if (root) {
            root.style.maxWidth = initialSize.width+'px';
            root.style.width = '100%';
            root.style.minHeight = initialSize.height+'px';
            root.style.position = 'relative';
            root.style.overflow = 'hidden';
        }
        _putOuterEventInQueue('inited', {schema: schema, css: "TODO: pass css string from project to container."}, 0);
        // before this 'init' we may already have some events in queue
        _sendOuterEvents();
    }
    else if (data.method === 'run') {
        // Container can set size only
        // Size from embed code (ex: data-width="620")
        // if (data.initialSize) {
        //     let size = null;
        //     if (isNumeric(data.initialSize.width) === true) {
        //         size = size || {};
        //         size.width = data.initialSize.width;
        //     }
        //     if (isNumeric(data.initialSize.height) === true) {
        //         size = size || {};
        //         size.height = data.initialSize.height;
        //     }
            // if (size) {
            //     setSize(size);
            // }
        // }

        setData(data.properties, data.forceFeedback);

        //TODO start ?
        //window.start();
    }
    if (data.method === 'setdata') {
        setData(data.data, data.forceFeedback);
    }
    if (data.method === 'serialize') {
        _putOuterEventInQueue('serialized', {state: serialize2()});
        _sendOuterEvents();
    }
    if (data.method === 'setsize') {
        setSize(data.width, data.height);
    }
    if (data.method === 'addhashlistelement') {
        addHashlistElement(data.propertyPath, data.index, data.prototypeId);
    }
    if (data.method === 'changepositioninhashlist') {
        changePositionInHashlist(data.propertyPath, data.elementIndex, data.newElementIndex);
    }
    if (data.method === 'deletehashlistelement') {
        deleteHashlistElement(data.propertyPath, {
            elementId: data.elementId,
            index: data.index
        });
    }
}

/**
* Assign new property values to store
*
* @param {object} data
*/
function setData(data, forceFeedback) {
    store.dispatch({
        type: REMIX_UPDATE_ACTION,
        data,
        forceFeedback
    });
}

function setCurrentScreen(screenId) {
    store.dispatch({
        type: REMIX_SET_CURRENT_SCREEN,
        screenId
    });
}



/**
 * Sets application width and height
 * Value sill be set if not "undefined"
 *
 * @param {number} width
 * @param {number} height
 */
function setSize(width, height) {
    // find propertes in schema responsible for width and height
    const data = {};
    if (width !== undefined) {
        const wprop = schema.getDescriptionsWithAttribute('appWidthProperty');
        if (wprop && wprop.length > 0) {
            if (wprop.length === 1) {
                data[wprop[0].selector] = width;
            }
            else {
                throw new Error(`Remix: found more than one selectors with "appWidthProperty" attribute`);
            }
        }
    }
    if (height !== undefined) {
        const hprop = schema.getDescriptionsWithAttribute('appHeightProperty');
        if (hprop && hprop.length > 0) {
            if (hprop.length === 1) {
                data[hprop[0].selector] = height;
            }
            else {
                throw new Error(`Remix: found more than one selectors with "appHeightProperty" attribute`);
            }
        }
    }
    if (Object.keys(data).length > 0) {
        setData(data);
    }
}

function registerTriggerAction(name, fn) {
    _triggerActions[name] = fn;
    return { actionType: name }
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
    const actInfo = extActions.find( (act) => type === act.type);
    if (actInfo) {
        param = new Normalizer(actInfo.paramSchema).process(param);
        store.dispatch({
            ...param,
            type: type
        });
    }
    else {
        throw new Error(`Remix: this action ${type} is not defined. Use Remix.init() to define some external actions.`);
    }
}

/**
 *
 * @param {object} trigger
 */
function addTrigger({when = {}, then = null}) {
    store.dispatch({
        type: REMIX_ADD_TRIGGER,
        trigger: {when, then, order: ++_orderCounter}
    });
}

/**
 * Mark some triggers as executed
 *
 * @param {string} transactionIds
 */
function markAsExecuted(transactionIds) {
    store.dispatch({
        type: REMIX_MARK_AS_EXECUTED,
        transactionIds: transactionIds
    });
}

/**
 * Event happend in Remix app
 *
 * @param {string} eventType
 * @param {object} eventData
 */
function fireEvent(eventType, eventData) {
    if (eventType === undefined) {
        throw new Error('Remix.fireEvent: eventType is not specified');
    }
    if (store) {
        //TODO с помощью этой проверки в начале старта приложения создаются свойствва и мы теряем эти события получается.. reducer создается и запускается а store еще не создан
        store.dispatch({
            type: REMIX_EVENT_FIRED,
            eventType: eventType,
            eventData: eventData
        });
    }
}

function clearEventsHistory() {
    store.dispatch({
        type: REMIX_EVENTS_CLEAR
    });
}

/**
 *
 * @param {string} hashlistPropPath
 * @param {number} index
 * @param {*} elementData.newElement
 * @param {number} elementData.prototypeIndex
 */
function addHashlistElement(hashlistPropPath, index, elementData = {}) {
    index = parseInt(index);
    if (hashlistPropPath === undefined) {
        throw new Error('Remix.addElement: hashlistPropPath is not specified');
    }
    if (!schema.getDescription(hashlistPropPath)) {
        throw new Error(`Remix.addElement: ${hashlistPropPath} is not described in schema`);
    }
    const d = {
        type: REMIX_HASHLIST_ADD_ACTION,
        path: hashlistPropPath,
        index: index
    };
    if (elementData.hasOwnProperty('newElement')) {
        d.newElement = elementData.newElement;
    }
    if (elementData.hasOwnProperty('prototypeIndex')) {
        d.prototypeIndex = elementData.prototypeIndex;
    }
    store.dispatch(d);
}

/**
 *
 * @param {number} elementIndex
 * @param {number} newElementIndex
 */
function changePositionInHashlist(hashlistPropPath, elementIndex, newElementIndex) {
    elementIndex = parseInt(elementIndex);
    newElementIndex = parseInt(newElementIndex);
    if (Number.isInteger(elementIndex) === false || elementIndex < 0) {
        throw new Error('Remix.changePositionInHashlist: Illegal elementIndex param');
    }
    if (Number.isInteger(newElementIndex) === false || newElementIndex < 0) {
        throw new Error('Remix.changePositionInHashlist: Illegal newElementIndex param');
    }
    if (!schema.getDescription(hashlistPropPath)) {
        throw new Error(`Remix.changePositionInHashlist: ${hashlistPropPath} is not described in schema`);
    }
    store.dispatch({
        type: REMIX_HASHLIST_CHANGE_POSITION_ACTION,
        path: hashlistPropPath,
        elementIndex: elementIndex,
        newElementIndex: newElementIndex
    });
}

/**
 *
 * @param {string} hashlistPropPath
 * @param {object} targetElement - specify targetElement.elementId or targetElement.index
 */
function deleteHashlistElement(hashlistPropPath, targetElement) {
    if (hashlistPropPath === undefined) {
        throw new Error('Remix.deleteElement: hashlistPropPath is not specified');
    }
    if (!schema.getDescription(hashlistPropPath)) {
        throw new Error(`Remix.deleteElement: ${hashlistPropPath} is not described in schema`);
    }
    store.dispatch({
        type: REMIX_HASHLIST_DELETE_ACTION,
        path: hashlistPropPath,
        ...targetElement
    });
}

/**
* @param {Object} schema
*/
function init({appStore = null, externalActions = [], container = null}) {
    store = appStore;
    root = container;
    extActions = externalActions || [];
    // store.dispatch({
    //     type: REMIX_INIT_ACTION
    // });
}

/**
 * Конвертация rgba(126,0,255,100) -> #7e00ff
 * @param {string} rgb
 * @returns {string}
 */
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#"+hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

/**
 * Проверить подходит ли строка под формат rgba(126,0,255,100)
 * @param {string} str
 * @return {boolean}
 */
function isRgb(str) {
    if (str) {
        str = str.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        return !!str && !!str[1] && !!str[2] && !!str[3];
    }
    return false;
}

/**
*
* @param {*} n
*/
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function log(...msg) {
    if (logging) {
        console.log('Remix:', ...msg);
    }
}

/**
* Interval
*/
function eventEmitterTick() {
    // send events from queue
    // -- return new getState()
    // -- return changed properties pathes
}

/**
* High Order Reducer:
* - data normalization
*/
export function remixReducer({reducers, dataSchema}) {

    if (!dataSchema) {
        throw new  Error('Remix: schema is not defined');;
    }
    if (dataSchema instanceof DataSchema === false) {
        throw new  Error('Remix: schema must be instance of DataSchema class');;
    }
    schema = dataSchema;
    normalizer = new Normalizer(schema);
    // clients reducers + standart remix reducers
    const reducer = combineReducers({...reducers, app, router, events});
    log('data schema added. Selectors count ' + Object.keys(schema).length);

    return (state, action) => {
        log(`remixReducer: action.type="${action.type}" state=`, state);
        let nextState = null;
        // if (action.type === REMIX_INIT_ACTION) {
        //     // empty data action, for data normalization
        //     nextState = {...state};
        // }
        // else
        if (action.type === REMIX_UPDATE_ACTION) {
            if (!action.data) {
                throw new Error('Remix: action.data is not specified');
            }
            nextState = _cloneState(state);
            _doUpdate(nextState, action.data);
        }
        else if (action.type === REMIX_HASHLIST_ADD_ACTION) {
            nextState = _cloneState(state);
            const targetHashlist = fetchHashlist(nextState, action.path, action.type);
            //TODO how to specify prototype id or index
            const protIndex = action.prototypeIndex || 0;
            const newElement = (action.hasOwnProperty('newElement')) ? action.newElement: clone(schema.getDescription(action.path).prototypes[protIndex].data);
            targetHashlist.addElement(newElement, action.index);
            //assignByPropertyString(nextState, action.path, targetHashlist); не обязательно, так мы ранее полностью склонировали стейт и создали новые hashlist в том числе

            //TODO
            //nextState = {...reducer(nextState, {type: "REMIX_HASHLIST_ELEMENT_WAS_ADDED", property: action.path})};
            //клиентской логике приложения возможно надо запустить какую-то свою бизнес-логику
            // - например перераспределить баллы по результатам с появлением нового вопроса
            // - например создать новый экран (хотя это в компонентах может быть)
        }
        else if (action.type === REMIX_HASHLIST_CHANGE_POSITION_ACTION) {
            nextState = _cloneState(state);
            const targetHashlist = fetchHashlist(nextState, action.path, action.type);
            targetHashlist.changePosition(action.elementIndex, action.newElementIndex);
            //assignByPropertyString(nextState, action.path, targetHashlist); не обязательно, так мы ранее полностью склонировали стейт и создали новые hashlist в том числе

            //TODO
            //nextState = {...reducer(nextState, {type: "REMIX_HASHLIST_ELEMENT_POSITION_WAS_CHANGED", property: action.path})};
            //клиентской логике приложения возможно надо запустить какую-то свою бизнес-логику
            // - например перераспределить баллы по результатам с появлением нового вопроса
            // - например создать новый экран (хотя это в компонентах может быть)
        }
        else if (action.type === REMIX_HASHLIST_DELETE_ACTION) {
            nextState = _cloneState(state);
            const targetHashlist = fetchHashlist(nextState, action.path, action.type);
            if (action.elementId) {
                targetHashlist.deleteElementById(action.elementId);
            }
            else if (action.index >= 0) {
                targetHashlist.deleteElement(action.index);
            }
            else {
                throw new Error('Remix: can not delete hashlist element. You must specify "elementId" or "index"');
            }
            //assignByPropertyString(nextState, action.path, targetHashlist); не обязательно, так мы ранее полностью склонировали стейт и создали новые hashlist в том числе

            //TODO
            //nextState = {...reducer(nextState, {type: "REMIX_HASHLIST_ELEMENT_WAS_DELETED", property: action.path})};
            //клиентской логике приложения возможно надо запустить какую-то свою бизнес-логику
            // - например перераспределить баллы по результатам с появлением нового вопроса
            // - например создать новый экран (хотя это в компонентах может быть)
        }
        // else if (action.type === REMIX_EVENT_FIRED) {
        //     nextState = events(state.events, action);
        // }
        else {
            // it maybe @@redux/INITx.x.x.x actions
            // it maybe a regular app action
            nextState = reducer(state, action);
        }
        log('remixReducer: next state: ', nextState);
        // normalize data according to schema
        // in first start it's need to be normalized and store filled with default values
        if (normalizer) {
            nextState = normalizer.process(nextState);
            log('remixReducer: normalized next state: ', nextState);
        }
        _lastUpdDiff = diff(state, nextState);
        const changed = _lastUpdDiff.added.length > 0 || _lastUpdDiff.changed.length > 0 || _lastUpdDiff.deleted.length > 0;
        if (changed) {
            log('Diff', _lastUpdDiff);
            //todo
            //fireEvent('property_updated', {diff: _lastUpdDiff});
        }
        if (action.forceFeedback || changed) {
            _putOuterEventInQueue('properties_changed', {..._lastUpdDiff, state: serialize2(nextState)});
        }
        _sendOuterEvents();
        return nextState;
    }
}

function app(state = {}) {
    return state;
}

function router(state = {}, action) {
    switch(action.type) {
        case REMIX_SET_CURRENT_SCREEN: {
            return {
                ...state,
                currentScreenId: action.screenId
            }
        }
    }
    // state sets by normalizer
    return state;
}

/**
 *
 * @param {*} state
 * @param {*} action
 */
function events(state = { triggers: new HashList(), history: [], activatedTriggers: [], toExecute: [] }, action) {
    switch(action.type) {
        case REMIX_ADD_TRIGGER: {
            const newTriggers = (state.triggers) ? state.triggers.shallowClone().addElement(action.trigger): new HashList([action.trigger]);
            return {
                ...state,
                triggers: newTriggers
            }
        }
        case REMIX_EVENT_FIRED: {
            const event = {
                eventType: action.eventType,
                eventData: action.eventData,
                order: ++_orderCounter
            };
            const texec = getTriggersToExecute(state.triggers.toArray(), event);
            const newActivatedTriggers = [
                ...state.activatedTriggers,
                ...texec
            ];
            const newHistory = [
                ...state.history,
                event
            ];
            const toExecute = [
                ...state.toExecute,
                ...texec
            ]
            return {
                ...state,
                history: newHistory,
                activatedTriggers: newActivatedTriggers,
                toExecute: toExecute
            }
        }
        case REMIX_MARK_AS_EXECUTED: {
            return {
                ...state,
                toExecute: state.toExecute.filter( ({transactionId}) => !action.transactionIds.includes(transactionId) )
            }
        }
        case REMIX_EVENTS_CLEAR: {
            return {
                ...state,
                history: []
            }
        }
        default:
            return state;
    }
}

/**
 * Checks triggers and runs them
 *
 * @return {array} array of activated triggers
 */
function getTriggersToExecute(triggers, event) {
    const toExec = [];
    // recent triggers have more priority
    for (let i = triggers.length-1; i >= 0; i--) {
        const t = triggers[i];
        if (event.order < t.order) {
            // event occured earlier then trigger was setup, skip it
            return;
        }
        if (event.eventType === t.when.eventType && !toExec.includes(t) && conditionWorks(event, t)) {
            // do not execute the same trigger twice
            toExec.push({t, e:event, transactionId: getUniqueId()});
        }
    }
    // now do some actions
    // toExec.forEach( ({t, e}) => {
    //     // if (typeof t.then === 'function') {
    //     //     t.then(t);
    //     // }
    //     // else
    //     if (typeof t.then.actionType === 'string') {
    //         if (typeof _triggerActions[t.then.actionType] === 'function') {
    //             _triggerActions[t.then.actionType]({
    //                 remix: this,
    //                 trigger: t,
    //                 eventData: e.eventData
    //             });
    //         }
    //         else {
    //             throw new Error(`Unregistered action type ${t.then}. Use registerTriggerAction() to register it`);
    //         }
    //     }
    //     else {
    //         throw new Error('\'then.actionType\' must be a string');
    //     }
    // })
    return toExec;
}

function conditionWorks(event, trigger) {
    const c = trigger.when.condition;
    if (c) {
        if (c.clause && c.clause.toLowerCase() === 'none') {
            return true;
        }
        if (event.eventData) {
            if (c.clause.toLowerCase() === 'contains') {
                return event.eventData[c.prop].toString().indexOf(c.value) >= 0;
            }
            else if (c.clause.toLowerCase() === 'equals') {
                return event.eventData[c.prop] === c.value;
            }
            else {
                throw new Error(`${c.clause} clause not supported`);
            }
        }
        return false
    }
    return true;
}

/**
 *
 * @param {object} state
 * @param {array | object} data
 */
function _doUpdate(state, data) {
    const pathesArr = Array.isArray(data) ? data.map((p) => p.path): Object.keys(data);
    const pathesValues = Array.isArray(data) ? data.reduce((res, elem) => { return {...res, [elem.path]: elem.value} }, {}): data;
    pathesArr.forEach( (path) => {
        const propDescription = schema.getDescription(path);
        if (!propDescription) {
            throw new Error(`Remix: can not find description for path "${path}" in schema`);
        }
        const propResult = getPropertiesBySelector(state, path);
        if (propResult.length === 0) {
            throw new Error(`Remix: there is no such property ${path} in state`);
        }
        else {
            const value = normalizer.processValue(path, pathesValues[path]);
            assignByPropertyString(state, path, value);
        }
    });
}

/**
 * Calc a diff netween states
 *
 * @param {*} prevState
 * @param {*} nextState
 */
function diff(prevState = {}, nextState = {}) {
    const result = {
        added: [],
        changed: [],
        deleted: []
    };
    schema.selectorsInProcessOrder.forEach( (selector) => {
        // get all possible pathes in state for this selector
        const psRes = getPropertiesBySelector(prevState, selector);
        const nsRes = getPropertiesBySelector(nextState, selector);
        for (let i = 0; i < nsRes.length; i++) {
            const nsProp = nsRes[i]
            const psProp = (psRes.length > 0) ? _getPropAndDelete(psRes, nsProp.path): null;
            if (psProp) {
                // this property exists in both states, check for modification
                if (_isHashlistInstance(psProp.value) && _isHashlistInstance(nsProp.value)) {
                    // hashlist comparison
                    if (!psProp.value.equal(nsProp.value)) {
                        result.changed.push(nsProp);
                    }
                }
                else if (psProp.value !== nsProp.value) {
                    // default comparison
                    result.changed.push(nsProp);
                }
            }
            else {
                // new property
                result.added.push(nsProp);
            }
        }
        for (let i = 0; i < psRes.length; i++) {
            result.deleted.push(psRes[i]);
        }
    });
    return result;
}

function _isHashlistInstance(obj) {
    return obj && obj._orderedIds && obj._orderedIds.length >= 0;
    //return obj.constructor && typeof obj.constructor.name === "string" && obj.constructor.name.toLowerCase() === "hashlist";
}

function _getPropAndDelete(props, propPath) {
    let index = -1;
    props.find( (p, i) => {
        if (p.path === propPath) {
            index = i;
            return true;
        }
        return false;
    });
    return (index >= 0) ? props.splice(index, 1)[0]: null;
}

function _putOuterEventInQueue(method, data, eventIndex) {
    if (eventIndex !== undefined) {
        _outerEvents.splice(eventIndex, 0, {method: method, data: data});
    }
    else {
        _outerEvents.push({method: method, data: data});
    }
}

//TODO очередь зачем? реализовать отправку по таймеру?
function _sendOuterEvents() {
    // containerWindow.postMessage({method: 'app_size_changed'}, containerOrigin); ?
    // containerWindow.postMessage({method: 'send_data_state'}, containerOrigin); // on 'request_data_state'
    while (containerWindow && containerOrigin && _outerEvents.length > 0) {
        const e = _outerEvents.shift();
        // in postMessage default serialization algorythm is used https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
        // hashlist will be serialized as object
        containerWindow.postMessage({...e.data, method: e.method }, containerOrigin);
    }
}

function _getLastUpdateDiff() {
    return _lastUpdDiff;
}

function _setScreenEvents(updateData) {
    _putOuterEventInQueue('screens_update', updateData);
    _sendOuterEvents();
}

/**
 * Helper function
 *
 * @param {*} path
 * @param {*} state
 * @param {*} action
 */
function fetchHashlist(state, path, actionType) {
    const fetchResult = getPropertiesBySelector(state, path);
    if (fetchResult.length === 0) {
        throw new Error(`Remix: no properties were found "${path}" for this action "${actionType}"`);
    }
    if (fetchResult.length > 1) {
        throw new Error(`Remix: you may not perform this action "${actionType}" only with one property, but ${fetchResult.length} were found in ${path}`);
    }
    return fetchResult[0].value;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Deep cloning of all dynamic properties
 *
 * @param {object} state
 * @return {object} new state
 */
function _cloneState(state) {
    const json = serialize(state);
    // important to clone all embedded objects in path, ex. "app" and "size" in ""app.size.width"
    const newState = JSON.parse(JSON.stringify(state));
    // then assign all dynamic properties. because we must instantiate Hashlist with hashlist func constructor (not "object", when clonning JSON.parse - JSON.stringify)
    // TODO ideally you may write custom clone algorythm
    _doUpdate(newState, JSON.parse(json));
    return newState;
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
    const res = [];
    const st = state || store.getState();
    schema.selectorsInProcessOrder.forEach((selector) => {
        const propsToSerialize = getPropertiesBySelector(st, selector);
        propsToSerialize.forEach((prop) => {
            res.push({path: prop.path, value: prop.value});
        });
    });
    return JSON.stringify(res);
}

/**
 *
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
export function serialize2(state) {
    const res = {};
    let st = state;
    if (!st) {
        if (store)
            st = store.getState();
        else
            return;
    }
    schema.selectorsInProcessOrder.forEach((selector) => {
        const propsToSerialize = getPropertiesBySelector(st, selector);
        propsToSerialize.forEach((prop) => {
            if (_isHashlistInstance(prop.value)) {
                let shallowValue = {};
                // Prepare hashlist with empty items (only keys and orders)
                // quiz
                //  questions:
                //    "54bwai": {},
                //    "ret67q": {}
                Object.keys(prop.value).forEach( (k) => shallowValue[k] = {});
                assignByPropertyString(res, prop.path, {
                    ...shallowValue,
                    _orderedIds: prop.value._orderedIds
                });
            }
            else {
                assignByPropertyString(res, prop.path, prop.value);
            }
        });
    });
    return JSON.stringify(res);
}

/**
 * Deserialize dynamic store properties
 * You can put string got from serialize method
 *
 * @param {string} json
 */
export function deserialize(json) {
    if (typeof json === "string") {
        remix.setData(JSON.parse(json));
    }
    else {
        throw new Error('Remix: json string expected')
    }
}

/**
 *
 * @param {string} json
 */
export function deserialize2(json) {
    if (typeof json === "string") {
        const st = JSON.parse(json);
        const data = {};
        schema.selectorsInProcessOrder.forEach((selector) => {
            const props = getPropertiesBySelector(st, selector, {
                typeCheckers: {
                    'HashList': (obj) => obj.hasOwnProperty('_orderedIds')
                }
            });
            props.forEach((p) => {
                data[p.path] = p.value;
            });
        });
        console.log('deserialize2');
        console.dir(data);
        remix.setData(data);
    }
    else {
        throw new Error('Remix: json string expected')
    }
}

// public methods
remix.init = init;
remix.setData = setData;
remix.setSize = setSize;
remix.addHashlistElement = addHashlistElement;
remix.changePositionInHashlist = changePositionInHashlist;
remix.deleteHashlistElement = deleteHashlistElement;
remix.serialize = serialize;
remix.serialize2 = serialize2;
remix.deserialize = deserialize;
remix.deserialize2 = deserialize2;
remix.dispatchAction = dispatchAction;
remix.addTrigger = addTrigger;
remix.markAsExecuted = markAsExecuted;
remix.fireEvent = fireEvent;
remix.setCurrentScreen = setCurrentScreen;
remix.clearEventsHistory = clearEventsHistory;
remix._getLastUpdateDiff = _getLastUpdateDiff;
remix._setScreenEvents = _setScreenEvents;
remix._triggerActions = _triggerActions;
remix._getSchema = () => schema;
remix._setCss = () => {
    //TODO set project css styles
    // maybe use to-string-loader https://github.com/webpack-contrib/css-loader#tostring
};
remix.registerTriggerAction = registerTriggerAction;
remix.getState = () => store.getState();
/**
 * Add new properties descriptions to app schema
 * Plugins may use this method
 */
remix.extendSchema = (schm) => {
    schema = schema.extend(schm);
    normalizer = new Normalizer(schema);
}
/**
 * App and plugin authors can declare function to use in applications, triggers etc..
 * Call by name later..
 */
remix.addCustomFunction = (fnName, fn) => {
    customFunctions[fnName] = fn;
}
/**
 * Call the declared custom function
 */
remix.callCustomFunction = (fnName) => {
    if (customFunctions[fnName]) {
        return customFunctions[fnName].call(remix);
    }
    throw new Error(`custom function not found ${fnName}`);
}

export default remix
window.Remix = remix; // for debug


/**
 * From https://github.com/reduxjs/redux/blob/master/src/combineReducers.js
 * TODO import normally
 * This function for automated tests
 *
 * @param {*} reducers
 */
function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers)
    const finalReducers = {}
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i]

      if (typeof reducers[key] === 'function') {
        finalReducers[key] = reducers[key]
      }
    }
    const finalReducerKeys = Object.keys(finalReducers)

    return function combination(state = {}, action) {
      let hasChanged = false
      const nextState = {}
      for (let i = 0; i < finalReducerKeys.length; i++) {
        const key = finalReducerKeys[i]
        const reducer = finalReducers[key]
        const previousStateForKey = state[key]
        const nextStateForKey = reducer(previousStateForKey, action)
        if (typeof nextStateForKey === 'undefined') {
          const errorMessage = getUndefinedStateErrorMessage(key, action)
          throw new Error(errorMessage)
        }
        nextState[key] = nextStateForKey
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey
      }
      hasChanged =
        hasChanged || finalReducerKeys.length !== Object.keys(state).length
      return hasChanged ? nextState : state
    }
}

function getUniqueId() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}