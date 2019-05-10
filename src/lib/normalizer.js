import { getPropertiesBySelector, assignByPropertyString, getPathes } from './object-path.js'
import HashList from "./hashlist.js";

export default class Normalizer {

    /**
     * 
     * @param {DataSchema} dataSchema 
     */
    constructor(dataSchema) {
        this.dataSchema = dataSchema;
    }

    /**
     * Normalize state object according to schema
     * 
     * @param {object} state 
     */
    process(state = {}) {
        // check al selectors in application schema
        this.dataSchema.selectorsInProcessOrder.forEach( (selector) => {
            // get all possible pathes in state for this selector
            // it maybe resolved or unresolved pathes (which are not exist)
            // what "resolved" or "unresolved" pathes means - see docs.
            const pathes = getPathes(state, selector);
            pathes.forEach((path) => {
                const requestResult = getPropertiesBySelector(state, path);
                if (requestResult.length > 0) {
                    // this path for current selector exists, check its value and normalize
                    requestResult.forEach( (res) => {
                        // normalize that value according dataSchema rules
                        const normValue = this.processValue(res.path, res.value);
                        assignByPropertyString(state, res.path, normValue);
                    });
                }
                else {
                    // unresolved path, we must assign it
                    const normValue = this.processValue(path, undefined); // "undefined" - we have not any specific value, processValue function will determine default value
                    assignByPropertyString(state, path, normValue)
                }
            });
        });
        return state;
    }
    // process(state) {
    //     this.dataSchema.selectorsInProcessOrder.forEach( (selector) => {
            
    //         // for each property in dataSchema fetch property value by path, exmaple "property.deep.path.value"
    //         // in common case there could be many properties for one selector
    //         const requestResult = getPropertiesBySelector(state, selector);
    //         if (requestResult.length > 0) {
    //             requestResult.forEach( (res) => {
    //                 // normalize that value according dataSchema rules
    //                 const normValue = this.processValue(res.path, res.value);
    //                 assignByPropertyString(state, res.path, normValue);
    //             });
    //         }
    //         else {
    //             // no properties were found, we must create new pathes and values

    //             // нужно создать по регэкспу сабпроперти ? по идее да это второй вариант ниже который описан
    //             // иначе это присвоение одного и тоже значения (а не копий) в разные ветви стейта
    //             // создать свойства а потом присвоить?
    //             //assignByPropertyString(state, selector, this.processValue(selector, undefined));

    //             // 2.
    //             const pathes = getPathes(state, selector)
    //             pathes.forEach((path) => {
    //                 const normValue = this.processValue(path, undefined); // важно: делаем это каждый раз, так как нам нужен новый инстанс значения в каждый path стейта
    //                 assignByPropertyString(state, path, normValue)
    //             });
    //         }
    //     });
    //     return state;
    // }

    /**
     * 
     * @param {string} path 
     * @param {*} value 
     */
    processValue(path, value) {
        const propDescription = this.dataSchema.getDescription(path);
        if (!propDescription) {
            throw new Error('Normalizer: "' + path + '" is not find in dataSchema');
        }

        switch(propDescription.type.toLowerCase()) {
            case "number": {
                return this.processNumber(propDescription, value);
            }
            case "hashlist": {
                return this.processHashlist(propDescription, value);
            }
            default: {
                if (value === undefined) {
                    return propDescription.default;
                }
            }
        }
        
        return value;
        //TODO min max
        //TODO enum
        //TODO type
        //TODO format
    }

    processNumber(info, value) {
        if (value === undefined) {
            value = info.default;
        }
        if (value < info.min) {
            value = info.min;
        }
        else if (value > info.max) {
            value = info.max;
        }
        return value;
    }

    /**
     * 
     * @param {object} info 
     * @param {HashList | object} value 
     */
    processHashlist(info, value) {
        if (value instanceof HashList === false) {
            if (value && Array.isArray(value._orderedIds)) {
                // it is maybe a deserialized object
                // try to convert it to HashList
                value = new HashList(value);
            }
            else {
                value = info.default.clone();
            }
        }
        //TODO min, max size of value
        return value;
    }
}