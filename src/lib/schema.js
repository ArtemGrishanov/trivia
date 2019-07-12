import Format from './format.js'
import { getTokens, matchPropertyPath } from './object-path.js';

export default class DataSchema {

    constructor(schm) {
        this.whitelistAttr = new Set(["type","min","max","default","format","enum","minLength","maxLength","elementSchema","prototypes","appWidthProperty","appHeightProperty"]);
        this.mandatoryAttrs = ["type","default"];
        this.whitelistTypes = new Set(["number","string","boolean","hashlist","url","color"]); // TODO type Color? Url?
        this._validateSchema(schm);
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

    // get props() {
    //     return this._schm;
    // }

    // set schema(schm) {
    //     this._schm = schm;
    // }

    _validateSchema(schm) {
        const self = this;
        Object.keys(schm).forEach( (prop) => {
            let mAttrs = self.mandatoryAttrs.slice(0);
            Object.keys(schm[prop]).forEach( (attr) => {
                if (self.whitelistAttr.has(attr) === false) {
                    throw new Error(`DataSchema: invalid attribute "${attr}". Valid attributes: ${Array.from(self.whitelistAttr).join(',')}`);
                }
                if (attr === "type" && self.whitelistTypes.has(schm[prop][attr].toLowerCase()) === false) {
                    throw new Error(`DataSchema: unsupported type "${schm[prop][attr]}". Supported typed: ${Array.from(self.whitelistTypes).join(',')}`);
                }
                mAttrs = mAttrs.filter( (e) => e !== attr);
            })
            if (mAttrs.length > 0) {
                throw new Error(`DataSchema: attribute "${mAttrs[0]}" is missed in "${prop}"`);
            }
        });

        //valid types only! hashlist

        //_validateSchema recursive

        // default attr is mandatory

        // check min < default < max
        // set min max defaul anyway
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