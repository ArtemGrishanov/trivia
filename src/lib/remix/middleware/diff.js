import { isHashlistInstance } from '../util/util.js'
import { getPropertiesBySelector } from '../../object-path.js'

/**
 * This middleware calcultes a diff between previous and new states
 * and fires events property changes
 *
 */

let lastUpdDiff = null;
let prevState = null;

const diffMiddleware = (store) => (next) => (action) => {
    //TODO с помощью этой проверки в начале старта приложения создаются свойствва и мы теряем эти события получается.. reducer создается и запускается а store еще не создан
    //...

    // console.log('Diff middleware begin');
    const firstDiff = prevState === null;
    prevState = store.getState();
    const result = next(action);
    const nextState = store.getState();
    lastUpdDiff = diff(Remix._getSchema(), firstDiff ? {}: prevState, nextState);
    const changed = lastUpdDiff.added.length > 0 || lastUpdDiff.changed.length > 0 || lastUpdDiff.deleted.length > 0;
    if (changed) {
        console.log('diff', lastUpdDiff);
        Remix.fireEvent('property_updated', { diff: lastUpdDiff });
    }
    // console.log('/Diff middleware end');
    return result
}

/**
 * Calc a diff netween states
 *
 * @param {Schema} schema
 * @param {*} prevState
 * @param {*} nextState
 */
function diff(schema = null, prevState = {}, nextState = {}) {
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
            const psProp = (psRes.length > 0) ? getPropAndDelete(psRes, nsProp.path): null;
            if (psProp) {
                // this property exists in both states, check for modification
                if (isHashlistInstance(psProp.value) && isHashlistInstance(nsProp.value)) {
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

function getPropAndDelete(props, propPath) {
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

export function getLastDiff() {
    return lastUpdDiff;
}

export default diffMiddleware;