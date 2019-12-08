import { isHashlistInstance } from '../util/util.js'
import { getPropertiesBySelector, deserialize } from '../../object-path.js'
import { init } from '../../../actions.js';

/**
 * This middleware calcultes a diff between previous and new states
 * and fires events property changes
 *
 */

//let lastUpdDiff = null;
//let prevState = null;

const diffMiddleware = (store) => (next) => (action) => {
    //TODO с помощью этой проверки в начале старта приложения создаются свойствва и мы теряем эти события получается.. reducer создается и запускается а store еще не создан
    //...

    // console.log('Diff middleware begin');
    //const firstDiff = prevState === null;
    const prevState = store.getState();
    const result = next(action);
    const nextState = store.getState();
    const lastUpdDiff = diff(Remix._getSchema(), prevState, nextState);
    const changed = lastUpdDiff.added.length > 0 || lastUpdDiff.changed.length > 0 || lastUpdDiff.deleted.length > 0;

    // Важное замечание
    // Даже при самом первом запуске этой функции diff начальный стейт уже содержит нормализованные по схеме свойства, поскольку @@redux/INIT action запускается без middleware
    // Происходит нормализация в remix high order reducer. Получается стейт который содержит все свойства приложения по схеме, но мы еще не разу не оказались в diffMiddleware (здесь)
    // поэтому начальный набор свойств невозможно да и не нужно отправлять как added (добавленные свойства)
    // решил так - при старте приложения отправляются initialProperties в 'inited' сообщении
    if (changed) {
        // in 'edit' mode Remix send out event messages to RemixContainer
        if (Remix.getMode() === 'edit') {
            Remix._putOuterEventInQueue('properties_updated', { diff: lastUpdDiff });
            Remix._sendOuterEvents();
            if (lastUpdDiff.routerScreensUpdates || lastUpdDiff.updatedScreens.length > 0) {
                const screensDiff = diffHashlist(prevState.router.screens, nextState.router.screens);
                Remix._putOuterEventInQueue('screens_updated', {
                    diff: {
                        added: screensDiff.added,
                        updated: lastUpdDiff.updatedScreens,
                        deleted: screensDiff.deleted
                    },
                    screens: Remix.getScreens()
                });
                Remix._sendOuterEvents();
            }
        }
        // это событие может вызвать другие actions а значит и эти diffMiddleware обработчики
        // поэтому вызываем в конце (как при рекурсии)
        Remix.fireEvent('property_updated', { diff: lastUpdDiff });
    }
    // console.log('/Diff middleware end');
    return result
}

/**
 * Returns arrays:
 * 'deleted' - which elements were deleted in prev state
 * 'added' - which elements were added in next state
 *
 * @param {Hashlist} prevHL
 * @param {Hashlist} nextHL
 *
 * @returns {added: Array, deleted: Array} object with two arrays
 */
function diffHashlist(prevHL, nextHL) {
    const result = {
        added: [],
        deleted: []
    }
    nextHL._orderedIds.forEach((id) => {
        if (!prevHL[id]) {
            result.added.push({...nextHL[id], hashlistId: id });
        }
    });
    prevHL._orderedIds.forEach((id) => {
        if (!nextHL[id]) {
            result.deleted.push({...prevHL[id], hashlistId: id });
        }
    });
    return result;
}

/**
 * Calc a diff between two states
 *
 * @param {Schema} schema
 * @param {*} prevState
 * @param {*} nextState
 */
function diff(schema = null, prevState = {}, nextState = {}) {
    const result = {
        added: [],
        changed: [],
        deleted: [],
        routerScreensUpdates: false, // 'router.screens' elements were updated: added, changed, deleted
        updatedScreens: {} // includes screens, if some child properties of the screen were updated. Example: 'router.screens.z6z9sh.components.emeh5f.text' changed, and this array will hold 'z6z9sh' screen id
    };
    const regex = /^router\.screens\.([A-z0-9]+)/g;
    schema.selectorsInProcessOrder.forEach( (selector) => {
        const isRouterScreens = selector === 'router.[screens HashList]';
        // get all possible pathes in state for this selector
        const psRes = getPropertiesBySelector(prevState, selector);
        const nsRes = getPropertiesBySelector(nextState, selector);
        for (let i = 0; i < nsRes.length; i++) {
            const nsProp = nsRes[i]
            const psProp = (psRes.length > 0) ? getPropAndDelete(psRes, nsProp.path): null;
            regex.lastIndex = 0;
            const m = regex.exec(nsProp),
                screenId = (m && m[0] && m[1]) ? m[1]: null;
            if (psProp) {
                // this property exists in both states, check for modification
                if (isHashlistInstance(psProp.value) && isHashlistInstance(nsProp.value)) {
                    // hashlist comparison
                    if (!psProp.value.equal(nsProp.value)) {
                        result.changed.push(nsProp);
                        if (isRouterScreens) result.routerScreensUpdates = true;
                        if (screenId && !result.updatedScreens[screenId]) result.updatedScreens[screenId] = nextState.router.screens[screenId];
                    }
                }
                else if (psProp.value !== nsProp.value) {
                    // default comparison
                    result.changed.push(nsProp);
                    if (isRouterScreens) result.routerScreensUpdates = true;
                    if (screenId && !result.updatedScreens[screenId]) result.updatedScreens[screenId] = nextState.router.screens[screenId];
                }
            }
            else {
                // new property
                result.added.push(nsProp);
                if (isRouterScreens) result.routerScreensUpdates = true;
                if (screenId && !result.updatedScreens[screenId]) result.updatedScreens[screenId] = nextState.router.screens[screenId];
            }
        }
        for (let i = 0; i < psRes.length; i++) {
            regex.lastIndex = 0;
            const m = regex.exec(psRes[i].path),
                screenId = (m && m[0] && m[1]) ? m[1]: null;
            result.deleted.push(psRes[i]);
            if (isRouterScreens) result.routerScreensUpdates = true;
            if (screenId && !result.updatedScreens[screenId]) result.updatedScreens[screenId] = prevState.router.screens[screenId];
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