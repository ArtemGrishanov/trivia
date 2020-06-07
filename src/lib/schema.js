import Format from './format.js'
import { getTokens, matchPropertyPath } from './object-path.js'

const types = {
    string: {
        attributes: ['default', 'serialize', 'adaptedForCustomWidth', 'enum', 'minLength', 'maxLength'],
        mandatory: ['default'],
    },
    number: {
        attributes: [
            'default',
            'serialize',
            'adaptedForCustomWidth',
            'min',
            'max',
            'enum',
            'appWidthProperty',
            'appHeightProperty',
        ],
        mandatory: ['default', 'min', 'max'],
    },
    boolean: {
        attributes: ['default', 'serialize', 'adaptedForCustomWidth', 'enum'], // do not need to specify enum ['true', 'false']
        mandatory: ['default'],
    },
    hashlist: {
        attributes: [
            'default',
            'serialize',
            'adaptedForCustomWidth',
            'minLength',
            'maxLength',
            'elementSchema',
            'prototypes',
        ],
        mandatory: ['default'],
    },
    array: {
        attributes: ['default'],
        mandatory: ['default'],
    },
    object: {
        attributes: ['default', 'serialize', 'adaptedForCustomWidth'],
        mandatory: ['default'],
    },
    url: {
        attributes: ['default', 'serialize', 'adaptedForCustomWidth'],
        mandatory: ['default'],
    },
    color: {
        attributes: ['default', 'serialize', 'adaptedForCustomWidth'],
        mandatory: ['default'],
    },
}

export default class DataSchema {
    constructor(schm) {
        this.extend(schm)
    }

    /**
     * Add some new properties to existing schema
     *
     * User may pass plain object or DataSchema instance
     */
    extend(newSchm) {
        if (newSchm && newSchm.hasOwnProperty('_schm')) {
            // DataSchema instance was passed
            newSchm = newSchm._schm
        }
        const schm = { ...this._schm, ...newSchm }
        this._validateSchema(schm)
        this._prepareSchema(schm)
        this._schm = schm
        this._selectorsInProcessOrder = this._getSelectorsInProcessOrder()
        this._selectorForPathCache = {}
        return this
    }

    /**
     *
     * @param {string} path, например 'router.screens.ho3etc.components.x851ma.text'
     * @param {object} filterObject (опционально) объект, на который накладывается path. Помогает подобрать описание если применяюся фильтры
     */
    getDescription(path, filterObject = {}) {
        // _schm содержит массив селекторов (хотя большинство совпадает с name)
        // нужно провести поиск по ним
        const selector = this.findSelectorForPath(path, filterObject)
        return selector ? this._schm[selector] : null
    }

    /**
     * example: path=quiz.questions.ugltc7.text, we should find quiz.[questions HashList].text
     *
     * @param {string} path
     * @param {object} filterObject
     *
     * @return {string} selector
     */
    findSelectorForPath(path, filterObject = {}) {
        if (this._selectorForPathCache[path]) {
            return this._selectorForPathCache[path]
        }
        const seltrs = Object.keys(this._schm)
        for (let i = 0; i < seltrs.length; i++) {
            if (matchPropertyPath(path, seltrs[i], filterObject) === true) {
                this._selectorForPathCache[path] = seltrs[i]
                return seltrs[i]
            }
        }
        return null
    }

    /**
     *
     * @returns {Array}
     */
    get selectorsInProcessOrder() {
        return this._selectorsInProcessOrder
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
        return Object.keys(this._schm).sort((a, b) => getTokens(a).length - getTokens(b).length)
    }

    /**
     * Makes some preparations
     * @param {object} schm
     */
    _prepareSchema(schm) {
        Object.keys(schm).forEach(prop => {
            if (schm[prop].type === 'boolean') {
                schm[prop].enum = ['false', 'true']
            }
        })
    }

    _validateSchema(schm) {
        const whitelistTypes = Object.keys(types)
        Object.keys(schm).forEach(prop => {
            const type = schm[prop].type
            if (!type) {
                throw new Error(`DataSchema: type must be specified`)
            }
            if (whitelistTypes.includes(type.toLowerCase()) === false) {
                throw new Error(`DataSchema: unsupported type "${type}". Supported typed: ${whitelistTypes.join(',')}`)
            }
            const whitelistAttr = types[type].attributes
            let mAttrs = types[type].mandatory.slice(0)
            Object.keys(schm[prop]).forEach(attr => {
                if (whitelistAttr.includes(attr) === false && attr !== 'type') {
                    throw new Error(
                        `DataSchema: invalid attribute "${attr}". Valid attributes: ${whitelistAttr.join(
                            ',',
                        )} for type "${type}"`,
                    )
                }
                mAttrs = mAttrs.filter(e => e !== attr)
            })
            if (mAttrs.length > 0) {
                throw new Error(`DataSchema: attribute "${mAttrs[0]}" is missed in "${prop}"`)
            }
        })
    }

    toString() {
        return JSON.stringify(this._schm)
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
        const result = []
        Object.keys(this._schm).forEach(prop => {
            if (this._schm[prop].hasOwnProperty(attrName)) {
                result.push({
                    selector: prop,
                    value: this._schm[prop],
                })
            }
        })
        return result.length > 0 ? result : null
    }
}
