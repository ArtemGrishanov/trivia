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
let root = null;
let initialSize = null;
let mode = 'none'; // edit | preview | published

window.addEventListener("message", receiveMessage, false);

/**
 * Получить и обработать сообщение
 * @param {Object} event
 */
function receiveMessage({origin = null, data = {}, source = null}) {
    if (EXPECTED_CONTAINER_ORIGIN && origin !== EXPECTED_CONTAINER_ORIGIN) {
        return;
    }
    log(data.method + ' message received');
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
* @param {object | string} data
*/
function setData(data) {
    if (typeof data === "string") {
        data = JSON.parse(data);
    }
    store.dispatch({
        type: REMIX_UPDATE_ACTION,
        data: data
    });
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
function init({appStore = null, container = null}) {
    store = appStore;
    // if (!dataSchema) {
    //     throw new  Error('Remix: schema is not defined');;
    // }
    //schema = dataSchema;
    root = container;
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
* sync editor data and getState()
*/
function syncData() {
    // compare prevData vs curData
    // const diff = schema.getDiff(prevStoreState, currentStoreState);
    // put events in queue based on "diff"
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
    log('Remix: data schema added: properties count ' + Object.keys(schema).length);

    return (state, action) => {
        log(`Remix.remixReducer: action.type="${action.type}" state=`, state);
        let nextState = null;
        if (action.type === REMIX_INIT_ACTION) {
            // empty data action, for data normalization
            nextState = {...state};
        }
        else if (action.type === REMIX_UPDATE_ACTION) {
            // special remix action
            if (!action.data) {
                throw new Error('Remix: action.data is not specified');
            }
            nextState = {...state};
            const pathesArr = Array.isArray(action.data) ? action.data.map((p) => p.path): Object.keys(action.data);
            const pathesValues = Array.isArray(action.data) ? action.data.reduce((res, elem) => { return {...res, [elem.path]: elem.value} }, {}): action.data;
            pathesArr.forEach( (path) => {
                const propDescription = schema.getDescription(path);
                if (!propDescription) {
                    throw new Error(`Remix: can not find description for path "${path}" in schema`);
                }
                const propResult = getPropertiesBySelector(nextState, path);
                if (propResult.length === 0) {
                    throw new Error(`Remix: there is no such property ${path} in state`);
                }
                else {
                    const value = normalizer.processValue(path, pathesValues[path]);
                    assignByPropertyString(nextState, path, value);
                }
            });
        }
        else if (action.type === REMIX_HASHLIST_ADD_ACTION) {
            nextState = state;
            const targetHashlist = fetchHashlist(nextState, action.path, action.type);
            //TODO how to specify prototype id or index
            const newElement = clone(schema.getDescription(action.path).prototypes[0].data);
            targetHashlist.addElement(newElement, action.index);
            // we must set a new value for redux
            //TODO
            //const newhl = targetHashlist.shallowClone();
            assignByPropertyString(nextState, action.path, targetHashlist);
            //клиентской логике приложения возможно надо запустить какую-то свою бизнес-логику
            // - например перераспределить баллы по результатам с появлением нового вопроса
            // - например создать новый экран (хотя это в компонентах может быть)
            nextState = {...reducer(state, {type: "REMIX_HASHLIST_ELEMENT_WAS_ADDED", property: action.path})};
        }
        else if (action.type === REMIX_HASHLIST_CHANGE_POSITION_ACTION) {
            nextState = state;
            const targetHashlist = fetchHashlist(nextState, action.path, action.type);
            targetHashlist.changePosition(action.elementIndex, action.newElementIndex);
            assignByPropertyString(nextState, action.path, targetHashlist);
            //клиентской логике приложения возможно надо запустить какую-то свою бизнес-логику
            // - например перераспределить баллы по результатам с появлением нового вопроса
            // - например создать новый экран (хотя это в компонентах может быть)
            nextState = {...reducer(state, {type: "REMIX_HASHLIST_ELEMENT_POSITION_WAS_CHANGED", property: action.path})};
        }
        else if (action.type === REMIX_HASHLIST_DELETE_ACTION) {
            nextState = state;
            const targetHashlist = fetchHashlist(nextState, action.path, action.type);
            targetHashlist.deleteElement(action.index);
            assignByPropertyString(nextState, action.path, targetHashlist);
            //клиентской логике приложения возможно надо запустить какую-то свою бизнес-логику
            // - например перераспределить баллы по результатам с появлением нового вопроса
            // - например создать новый экран (хотя это в компонентах может быть)
            nextState = {...reducer(state, {type: "REMIX_HASHLIST_ELEMENT_WAS_DELETED", property: action.path})};
        }
        else {
            //TODO actions @@redux/INIT come first
            // check state, based on schema

            //TODO normalize here too !
            
            // regular app action
            nextState = reducer(state, action);
        }
        log('Remix.remixReducer: next state: ', nextState);
        // normalize data according to schema
        // in first start it's need to be normalized and store filled with default values
        if (normalizer) {
            nextState = normalizer.process(nextState);
            log('Remix.remixReducer: normalized next state: ', nextState);
        }
        return nextState;

        //TODO calc diff between states and return "data_create" "data_edit" "data_deleted" events!
    }
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
 * Serialize dynamic store properties
 * We use array to order properties. From more common to specific
 * 
 * @returns {string} example - '{"quiz.questions":{"_orderedIds":["54bwai","5lokro"],"54bwai":{"text":"Input your question"},"5lokro":{"text":"Input your question num2"}},"app.size.width":400,"app.size.height":400,"quiz.questions.54bwai.text":"Input your question","quiz.questions.5lokro.text":"Input your question num2"}'
 * You can see duplicate values ('Input your question'), It's OK when hashlist is serilized
 */
export function serializeStore() {
    // по схеме выбрать все пассы и сохранить их в объект
    const res = [];
    const state = store.getState();
    schema.selectorsInProcessOrder.forEach((selector) => {
        const propsToSerialize = getPropertiesBySelector(state, selector);
        propsToSerialize.forEach((prop) => {
            console.log('serialize: ', prop.path)
            res.push({path: prop.path, value: prop.value});
        });
    });
    return JSON.stringify(res);
}

// public methods
remix.init = init;
remix.setData = setData;
remix.addHashlistElement = addHashlistElement;
remix.changePositionInHashlist = changePositionInHashlist;
remix.deleteHashlistElement = deleteHashlistElement;
remix.serializeStore = serializeStore;

export default remix
window.remix = remix; // for debug
