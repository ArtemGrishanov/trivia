import Format from './format.js'
import { getTokens, matchPropertyPath } from './object-path.js';

const types = {
    'string': {
        attributes: ["default","enum","minLength","maxLength"],
        mandatory: ["default"]
    },
    'number': {
        attributes: ["default","min","max","enum","appWidthProperty","appHeightProperty"],
        mandatory: ["default","min","max"]
    },
    'boolean': {
        attributes: ["default"],
        mandatory: ["default"]
    },
    'hashlist': {
        attributes: ["default","minLength","maxLength","elementSchema","prototypes"],
        mandatory: ["default"]
    },
    'url': {
        attributes: ["default"],
        mandatory: ["default"]
    },
    'color': {
        attributes: ["default"],
        mandatory: ["default"]
    }
}

export default class DataSchema {

    constructor(schm) {
        this._validateSchema(schm);
        this._prepareSchema(schm);
        this._schm = schm;
        this._selectorsInProcessOrder = this._getSelectorsInProcessOrder();
    }

    /**
     * 
     * @param {string} path 
     */
    getDescription(path) {
        // _schm содержит массив селекторов (хотя большинство совпадает с name)
        // нужно провести поиск по ним
        const selector = this.findSelectorForPath(path);
        return selector ? this._schm[selector]: null;
    }

    /**
     * example: path=quiz.questions.ugltc7.text, we should find quiz.[questions HashList].text
     * 
     * @param {string} path 
     * @return {string} selector
     */
    findSelectorForPath(path) {
        const seltrs = Object.keys(this._schm)
        for (let i = 0; i < seltrs.length; i++) {
            if (matchPropertyPath(path, seltrs[i]) === true) return seltrs[i]
        }
        return null;
    }

    /**
     * 
     * @returns {Array}
     */
    get selectorsInProcessOrder() {
        return this._selectorsInProcessOrder;
    }

    /**
     * Returns schema selector in priority order
     * It matter how to process the state
     * We must process more common selectors, then more specific.
     * 
     * Compare: 
     * 
     * 1. process "app.quiz.[questions HashList]" // creates HashList if needed
     * ...
     * n. process "app.quiz.[questions HashList]./^0-9a-z$/.text" // uses created HashList instance
     * 
     * @returns {Array}
     */
    _getSelectorsInProcessOrder() {
        return Object.keys(this._schm).sort( (a, b) => getTokens(a).length - getTokens(b).length);
    }

    /**
     * Makes some preparations
     * @param {object} schm 
     */
    _prepareSchema(schm) {
        Object.keys(schm).forEach( (prop) => {
            if (schm[prop].type === 'boolean') {
                schm[prop].enum = ['false','true'];
            }
        });
    }

    _validateSchema(schm) {
        const whitelistTypes = Object.keys(types);
        Object.keys(schm).forEach( (prop) => {
            const type = schm[prop].type;
            if (!type) {
                throw new Error(`DataSchema: type must be specified`);
            }
            if (whitelistTypes.includes(type.toLowerCase()) === false) {
                throw new Error(`DataSchema: unsupported type "${schm[prop][attr]}". Supported typed: ${whitelistTypes.join(',')}`);
            }
            const whitelistAttr = types[type].attributes;
            let mAttrs = types[type].mandatory.slice(0);
            Object.keys(schm[prop]).forEach( (attr) => {
                if (whitelistAttr.includes(attr) === false && attr !== 'type') {
                    throw new Error(`DataSchema: invalid attribute "${attr}". Valid attributes: ${whitelistAttr.join(',')} for type "${type}"`);
                }
                mAttrs = mAttrs.filter( (e) => e !== attr);
            })
            if (mAttrs.length > 0) {
                throw new Error(`DataSchema: attribute "${mAttrs[0]}" is missed in "${prop}"`);
            }
        });
    }

    toString() {
        return JSON.stringify(this._schm);
    }
    /**
    * Prints example with all possible options
    */
    // printHelp() {
    //     const json = JSON.stringify(example);
    //     console.log(json)
    //     return json;
    // }

    /**
     * Gets all descriptions where the attribute presents
     * 
     * @param {string} attrName
     * @returns {Array}
     */
    getDescriptionsWithAttribute(attrName) {
        const result = [];
        Object.keys(this._schm).forEach( (prop) => {
            if (this._schm[prop].hasOwnProperty(attrName)) {
                result.push({
                    selector: prop,
                    value: this._schm[prop]
                });
            }
        });
        return result.length > 0 ? result: null;
    }
}