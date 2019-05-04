import { getPropertiesBySelector, assignByPropertyString } from './object-path'
import HashList from "./hashlist";

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
    process(state) {
        this.dataSchema.selectorsInProcessOrder.forEach( (selector) => {
            // for each property in dataSchema fetch property value by path, exmaple "property.deep.path.value"
            // in common case there could be many properties for one selector
            const requestResult = getPropertiesBySelector(state, selector);
            if (requestResult.length > 0) {
                requestResult.forEach( (res) => {
                    // normalize that value according dataSchema rules
                    const normValue = this.processValue(res.path, res.value);
                    assignByPropertyString(state, res.path, normValue);
                });
            }
            else { //if (this.dataSchema.props[selector].createIfNotExist !== false)

                // внутри там селектор понимается как пасс хотя это не так всегда
                // --
                // нужно создать по регэкспу сабпроперти ? по идее да
                // создать свойства а потом присвоить?

                // еще ошибка в матчингом - сначала ее рассмотреть
                assignByPropertyString(state, selector, this.processValue(selector, undefined));
            }
        });
        return state;
    }

    processValue(path, value) {
        const propDescription = this.dataSchema.getDescription(path);
        if (!propDescription) {
            throw new Error('Normalizer: "' + path + '" is not find in dataSchema');
        }

        if (value === undefined) {
            return propDescription.default;
        }

        switch(propDescription.type.toLowerCase()) {
            case "number": {
                return this.processNumber(propDescription, value);
            }
            case "hashlist": {
                return this.processHashlist(propDescription, value);
            }
            default:
        }
        
        return value;
        //TODO min max
        //TODO enum
        //TODO type
        //TODO format
    }

    processNumber(info, value) {
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
            if (Array.isArray(value._orderedIds)) {
                // it is maybe a deserialized object
                // try to convert it to HashList
                value = new HashList(value);
            }
            else {
                value = info.default;
            }
        }
        //TODO min, max size of value
        return value;
    }
}