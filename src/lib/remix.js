import DataSchema from './schema.js'
import Normalizer from './normalizer.js'
import {
    assignByPropertyString,
    getPropertiesBySelector
} from './object-path.js'

const LOG = true;
export const REMIX_UPDATE_ACTION = '__Remix_update_action__';
export const REMIX_INIT_ACTION = '__Remix_init_action__';
export const REMIX_HASHLIST_ADD_ACTION = '__Remix_hashlist_update_action__';
export const REMIX_HASHLIST_CHANGE_POSITION_ACTION = '__Remix_hashlist_change_position_action__'
export const REMIX_HASHLIST_DELETE_ACTION = '__Remix_hashlist_delete_action__';

const remix = {};

//TODO specify origin during publishing?
//const containerOrigin = "http://localhost:8080";
const EXPECTED_CONTAINER_ORIGIN = null;
const MODE_SET = new Set(['edit', 'preview', 'published']);

let containerOrigin = null;
let containerWindow = null;
let store = null;
let schema = null;
let normalizer = null;
let extActions = null;
let root = null;
let initialSize = null;
let mode = 'none'; // edit | preview | published

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
        initialSize = data.initialSize;
        if (root) {
            root.style.maxWidth = initialSize.width+'px';
            root.style.width = '100%';
            root.style.minHeight = initialSize.height+'px';
            root.style.position = 'relative';
            root.style.overflow = 'hidden';
        }
        containerWindow.postMessage({
            schema: schema,
            method: 'inited'
        }, containerOrigin);
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

        setData(data.properties);

        //TODO start ?
        //window.start();
    }
    if (data.method === 'setdata') {
        setData(data.data);
    }
}

// containerWindow.postMessage({method: 'app_size_changed'}, containerOrigin);
// containerWindow.postMessage({method: 'data_created'}, containerOrigin);
// containerWindow.postMessage({method: 'data_changed'}, containerOrigin);
// containerWindow.postMessage({method: 'data_deleted'}, containerOrigin);

// view - на основании событий цикла реакт
// containerWindow.postMessage({method: 'view_created'}, containerOrigin);
// containerWindow.postMessage({method: 'view_rendered'}, containerOrigin);
// containerWindow.postMessage({method: 'view_deleted'}, containerOrigin);
// containerWindow.postMessage({method: 'send_data_state'}, containerOrigin); // on 'request_data_state'

/**
* Assign new property values to store
*
* @param {object} data
*/
function setData(data) {
    store.dispatch({
        type: REMIX_UPDATE_ACTION,
        data: data
    });
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
 * @param {string} hashlistPropPath 
 * @param {number} index 
 */
function addHashlistElement(hashlistPropPath, index, prototypeId) {
    if (hashlistPropPath === undefined) {
        throw new Error('Remix.addElement: hashlistPropPath is not specified');
    }
    if (!schema.getDescription(hashlistPropPath)) {
        throw new Error(`Remix.addElement: ${hashlistPropPath} is not described in schema`);
    }
    store.dispatch({
        type: REMIX_HASHLIST_ADD_ACTION,
        path: hashlistPropPath,
        index: index
    });
}

/**
 * 
 * @param {number} elementIndex 
 * @param {number} newElementIndex 
 */
function changePositionInHashlist(hashlistPropPath, elementIndex, newElementIndex) {
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
 * @param {number} index 
 */
function deleteHashlistElement(hashlistPropPath, index) {
    if (hashlistPropPath === undefined) {
        throw new Error('Remix.deleteElement: hashlistPropPath is not specified');
    }
    if (!schema.getDescription(hashlistPropPath)) {
        throw new Error(`Remix.deleteElement: ${hashlistPropPath} is not described in schema`);
    }
    store.dispatch({
        type: REMIX_HASHLIST_DELETE_ACTION,
        path: hashlistPropPath,
        index: index
    });
}

/**
* @param {Object} schema
*/
function init({appStore = null, externalActions = [], container = null}) {
    store = appStore;
    // if (!dataSchema) {
    //     throw new  Error('Remix: schema is not defined');;
    // }
    //schema = dataSchema;
    root = container;
    extActions = externalActions || [];
    //normalizer = new Normalizer(schema: schema);
    store.dispatch({
        type: REMIX_INIT_ACTION
    });
}

/**
* Специальные доступные форматы.
* Такие как цвет или урл
*/
export const RemixFormat = {
    /**
    * Checks if value represents a color
    * Returns formatted color or null
    *
    * rgb(r,g,b) value will be converted to ##rrggbb format
    * but rgb(r,g,b,a) value will be remained
    * Otherwise returns null if value is invalid color
    *
    * @param {string} value
    */
    // Color: function(value) {
    //     return value;
    // },
    // /**
    // *
    // */
    // Url: function(value) {
    //     return value;
    // }
};

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
    if (LOG) {
        console.log(...msg);
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
export function remixReducer(reducer, dataSchema) {

    if (!dataSchema) {
        throw new  Error('Remix: schema is not defined');;
    }
    if (dataSchema instanceof DataSchema === false) {
        throw new  Error('Remix: schema must be instance of DataSchema class');;
    }
    schema = dataSchema;
    normalizer = new Normalizer(schema);
    log('Remix: data schema added. Selectors count ' + Object.keys(schema).length);

    return (state, action) => {
        log(`Remix.remixReducer: action.type="${action.type}" state=`, state);
        let nextState = null;
        if (action.type === REMIX_INIT_ACTION) {
            // empty data action, for data normalization
            nextState = {...state};
        }
        else if (action.type === REMIX_UPDATE_ACTION) {
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
            const newElement = clone(schema.getDescription(action.path).prototypes[0].data);
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
            targetHashlist.deleteElement(action.index);
            //assignByPropertyString(nextState, action.path, targetHashlist); не обязательно, так мы ранее полностью склонировали стейт и создали новые hashlist в том числе
            
            //TODO
            //nextState = {...reducer(nextState, {type: "REMIX_HASHLIST_ELEMENT_WAS_DELETED", property: action.path})};
            //клиентской логике приложения возможно надо запустить какую-то свою бизнес-логику
            // - например перераспределить баллы по результатам с появлением нового вопроса
            // - например создать новый экран (хотя это в компонентах может быть)
        }
        else {
            // it maybe @@redux/INITx.x.x.x actions 
            // it maybe a regular app action
            nextState = reducer(state, action);
        }
        log('Remix.remixReducer: next state: ', nextState);
        // normalize data according to schema
        // in first start it's need to be normalized and store filled with default values
        if (normalizer) {
            nextState = normalizer.process(nextState);
            log('Remix.remixReducer: normalized next state: ', nextState);
        }
        const d = diff(state, nextState);
        if (d.added.length > 0 || d.changed.length > 0 || d.deleted.length > 0) {
            console.log('Diff', d);
            // history.push(nextState);
        }
        //TODO sendEvents(d);
        return nextState;
    }
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
    return obj.constructor && typeof obj.constructor.name === "string" && obj.constructor.name.toLowerCase() === "hashlist";
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

// public methods
remix.init = init;
remix.setData = setData;
remix.addHashlistElement = addHashlistElement;
remix.changePositionInHashlist = changePositionInHashlist;
remix.deleteHashlistElement = deleteHashlistElement;
remix.serialize = serialize;
remix.deserialize = deserialize
remix.dispatchAction = dispatchAction;

export default remix
window.remix = remix; // for debug
