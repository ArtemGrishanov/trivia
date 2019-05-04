/**
 * 
 * @param {string} selector 
 */
export function getTokens(selector) {
    //TODO do not include \. in regexp
    return selector.split('.');
}

/**
 * Serialize to string all pathes in object which match selectors
 * 
 * @param {object} obj 
 * @param {Array} selectors 
 * 
 * @return {string}
 */
export function serialize(obj, selectors) {

}

export function deserialize(str) {

}

/**
 * Установить свойство используя object path.
 * Свойство более высокого уровня должно перетирать дочерние.
 *
 * var obj = {},
 * assignByPropertyString(obj, "foo.bar.foobar", "Value");
 *
 * @param {object} obj
 * @param {string} prop property path, ex "path.to.deep.property"
 * @param {*} value
 */
export function assignByPropertyString(obj, prop, value) {
    //TODO нельзя присвоить когда регулярное выражение
    const s = new Selector(prop);
    s.assign(obj, value)
}

export class Selector {

    // ex: "quiz.[questions HashList]./^[0-9a-z]+$/.text"
    constructor(str) {
        this._selector = str;
        this._tokens = getTokens(this._selector);
    }

    /**
     * 
     * @param {string} propertyPath 
     * @return {boolean}
     */
    match(propertyPath, startTokenIndex = 0) {
        if (propertyPath === this._selector)
            return true;
        if (propertyPath === "" && startTokenIndex === this._tokens.length)
            // end of recursion
            return true;
        if (!propertyPath || !this._selector) {
            return false;
        }
        try {
            const pathElems = propertyPath.split('.');
            const ppart0 = pathElems[0];
            const ti = this._getSelectorTokenInfo(this._tokens[startTokenIndex]);
            if (ti.name === ppart0) {
                return this.match(pathElems.slice(1).join('.'), startTokenIndex+1);
            }
            // regex check. Expression expected in slashes /.../
            if (this._isRegExpString(ti.name)) {
                const reg = new RegExp(ti.name.substring(1,ti.name.length-1));
                if (reg.exec(ppart0)) {
                    return this.match(pathElems.slice(1).join('.'), startTokenIndex+1);
                }
                return false;
            }
            return false;
            //return this.match(pathElems.slice(1).join('.'), startTokenIndex+1);
        }
        catch(e) {
        }
        return false;
    }

    /**
     * Fetch all properties from the object using current selector
     * 
     * @param {Array} array of results, which match selector 
     */
    fetch(obj) {
        if (obj === undefined || obj === null) {
            throw new Error('Object is not specified');
        }
        const result = [];
        const clb = (next) => {
            if (next.done && next.parentObj.hasOwnProperty(next.propName)) {
                result.push({
                    path: next.path,
                    value: next.value
                })
            }
        };
        this._iterate(obj, clb, this._tokens, '');
        return result;
    }

    assign(obj, value) {
        // if (!this.canAssign()) {
        //     throw new Error('Cannot use this selector for assignment');
        // }
        if (obj === undefined || obj === null) {
            throw new Error('Object is not specified');
        }
        //TODO if selector is property path!
        const clb = (next) => {
            if (next.done) {
                next.parentObj[next.propName] = value;
            }
            else if (next.value === undefined) {
                next.parentObj[next.propName] = {};
            }
        };
        this._iterate(obj, clb, this._tokens, '', true);
    }

    /**
     * Check we may use selector for assignment
     * Obviously I may not use with selectors with regexp? or may we?
     */
    // canAssign() {
    //     //TODO check for regexp
    //     return this._selector.indexOf('/') < 0;
    // }

    _isRegExpString(str) {
        return str.length > 2 && str[0] === "/" && str[str.length-1] === "/";
    }

    /**
     * Makes a sync iterator for processing an object using selector
     * Callback "func" will be called for every step, even if property is not exist
     * 
     * Example 1: "app.size.width", obj: {app:{}}
     * - clb({propName:'app', path:'app', value:{}, parentObj: %linktoobjcet%, done:false})
     * - 
     * 
     * @param {*} obj 
     * @param {Function} func is called on each element
     * @param {Array}
     * @param {string} actualPath 
     * @param {boolean} throwErrorOnTypeMismatch
     */
    _iterate(obj, func, selectorTokens = [], actualPath = '', throwErrorOnTypeMismatch = false) {
        const ti = (selectorTokens.length > 0) ? this._getSelectorTokenInfo(selectorTokens[0]): null;

        let candidates = [];
        // regex check. Expression expected in slashes /.../
        if (this._isRegExpString(ti.name)) {
            const reg = new RegExp(ti.name.substring(1, ti.name.length-1));
            candidates = Object.keys(obj).filter( (key) => reg.exec(key) )
        }
        else if (obj.hasOwnProperty(ti.name)) {
            candidates = [ti.name];
        }
        else if (obj[ti.name] === undefined) {
            func({
                propName: ti.name,
                path: actualPath,
                value: obj[ti.name],
                parentObj: obj,
                done: selectorTokens.length === 1
            });
            if (obj.hasOwnProperty(ti.name)) {
                // property was added in client code
                candidates = [ti.name];
            }
        }
        for (let i = 0; i < candidates.length; i++) {
            const cname = candidates[i];
            // type checkings
            if (typeof ti.type === "string" && obj[cname].constructor.name.toLowerCase() !== ti.type.toLowerCase()) {
                if (throwErrorOnTypeMismatch)
                    // usually this logic is used in assignment. We must know about type mismatch
                    throw new Error(`${ti.name} has type "${obj[cname].constructor.name}", but "${ti.type}" expected`);
                else
                    // here, in fetching type mismatch is OK
                    continue;
            }
            //if (isAssignment) {
                //TODO ?? to callback
                // if (typeof obj[tokenInfo.name] !== "object" && typeof obj[tokenInfo.name] !== "undefined") {
                //     throw new Error(`Normalizer: ${tokenInfo.name} has illegal type to assign`);
                // }
            //}
            const candidatePath = actualPath + ((actualPath.length > 0) ? ".": "") + cname;
            func({
                propName: cname,
                path: candidatePath,
                value: obj[cname],
                parentObj: obj,
                done: selectorTokens.length === 1
            });
            if (selectorTokens.length > 1 && obj[cname] !== undefined && obj[cname] !== null) {
                this._iterate(obj[cname], func, selectorTokens.slice(1), candidatePath, throwErrorOnTypeMismatch);
            }
        }
    }

    /**
     * Parse selector token (a piece of selector between dots
     * 
     * "[questions HashList]" -> {name: questions, type: HashList}
     * "width" -> {name: width, type: undefined}
     * 
     * @param {string} token
     * @return {object} {name, type} token information
     */
    _getSelectorTokenInfo(token) {
        if (token.length > 2 && token[0] === '[' && token[token.length-1] === ']') {
            const pair = token.substring(1,token.length-1).split(' ');
            return {
                name: pair[0],
                type: pair[1]
            }
        }
        return {
            name: token,
            type: undefined
        }
    }
}

/**
 * Проверить в объекте obj, содержит ли он свойства соответствующие selector
 * Например: selector==quiz.{{number}}.text
 * получаем 4-е свойства со своими значениями: quiz.0.text quiz.1.text quiz.2.text quiz.3.text
 *
 * @param obj
 * @param selector
 *
 * @return {Array} result
 */
export function getPropertiesBySelector(obj, selector) {
    const s = new Selector(selector);
    return s.fetch(obj);
}

/**
 * Проверить соответствие между собой селектора например  и строки свойства, например 
 *
 * @param {string} propertyPath "quiz.questions.ugltc7.text"
 * @param {string} selector "quiz.[questions Hashlist].text"
 * 
 * @return {boolean}
 */
export function matchPropertyPath(propertyPath, selector) {
    const s = new Selector(selector);
    return s.match(propertyPath);
    // if (propertyPath === selector) return true;
    // if (!propertyPath || !selector) {
    //     return false;
    // }
    // try {
    //     const pathElems = propertyPath.split('.');
    //     const selectorElems = selector.split('.');
        
    //     const ppart0 = pathElems[0];
    //     const spart0 = selectorElems[0];
    //     if (spart0 === ppart0) {
    //         return matchPropertyPath(pathElems.slice(1).join('.'), selectorElems.slice(1).join('.'));
    //     }
    //     // regex check. Expression expected in slashes /.../
    //     if (spart0[0] === "/" && spart0[spart0.length-1] === "/") {
    //         const reg = new RegExp(spart0.substring(1,spart0.length-1));
    //         if (reg.exec(ppart0)) {
    //             return matchPropertyPath(pathElems.slice(1).join('.'), selectorElems.slice(1).join('.'));
    //         }
    //         return false;
    //     }
    //     if (spart0[0] === "[" && spart0[spart0.length-1] === "]") {
    //         // description with type found: "[myProperty Type]"
    //         const pair = spart0.substring(1,spart0.length-1).split(' ');
    //         const objName = pair[0]; // ex: "questions"
    //         const objType = pair[1]; // ex: "Hashlist"
    //         const ppart1 = pathElems[1]; // ex: "ugltc7"
    //         if (objName === ppart0 && objType === "HashList") {
    //             //TODO тип Hashlist проверить не можем
    //             //TODO как видим пока жестко зашита поддержка одного типа HashList для эксперимента. Подумать, расширить.
    //             return matchPropertyPath(pathElems.slice(1).join('.'), selectorElems.slice(1).join('.'));
    //         }
    //     }
    // }
    // catch(e) {
    // }
    // return false;
}