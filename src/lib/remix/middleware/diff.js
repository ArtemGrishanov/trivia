import { isHashlistInstance, getScreenIdFromPath, getComponentIdFromPath, debounce } from '../util/util.js'
import { getPropertiesBySelector, deserialize } from '../../object-path.js'

let prevState = null

/**
 * This middleware calcultes a diff between previous and new states
 * and fires events property changes
 *
 */
const diffMiddleware = store => next => action => {
    if (!prevState) {
        prevState = store.getState()
    }
    const result = next(action)
    scheduleDiff()
    return result
}

const scheduleDiff = debounce(() => {
    if (!prevState) {
        return
    }
    const nextState = store.getState()
    const lastUpdDiff = diff(Remix.getSchema(), prevState, nextState)
    const changed = lastUpdDiff.added.length > 0 || lastUpdDiff.changed.length > 0 || lastUpdDiff.deleted.length > 0
    if (changed) {
        // in 'edit' mode Remix send out event messages to RemixContainer
        if (Remix.getMode() === 'edit') {
            Remix._putOuterEventInQueue('properties_updated', { diff: lastUpdDiff, screens: Remix.getScreens() })
            Remix._sendOuterEvents()
            if (lastUpdDiff.routerScreensUpdates || Object.keys(lastUpdDiff.updatedScreens).length > 0) {
                const screensDiff = diffHashlist(prevState.router.screens, nextState.router.screens)
                Remix._putOuterEventInQueue('screens_updated', {
                    diff: {
                        added: screensDiff.added,
                        updated: lastUpdDiff.updatedScreens,
                        deleted: screensDiff.deleted,
                    },
                    screens: Remix.getScreens(),
                })
                Remix._sendOuterEvents()
            }
        }
        // это событие может вызвать другие actions а значит и эти diffMiddleware обработчики
        // поэтому вызываем в конце (как при рекурсии)
        Remix.fireEvent('property_updated', { diff: lastUpdDiff })
    }
    prevState = nextState
}, 200)

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
        deleted: [],
    }
    nextHL._orderedIds.forEach(id => {
        if (!prevHL[id]) {
            result.added.push({ ...nextHL[id], hashlistId: id })
        }
    })
    prevHL._orderedIds.forEach(id => {
        if (!nextHL[id]) {
            result.deleted.push({ ...prevHL[id], hashlistId: id })
        }
    })
    return result
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
        updatedScreens: {}, // includes screens, if some child properties of the screen were updated. Example: 'router.screens.z6z9sh.components.emeh5f.text' changed, and this array will hold 'z6z9sh' screen id
    }
    schema.selectorsInProcessOrder.forEach(selector => {
        const isRouterScreens = selector === 'router.[screens HashList]'
        // get all possible pathes in state for this selector
        const psRes = getPropertiesBySelector(prevState, selector)
        const nsRes = getPropertiesBySelector(nextState, selector)
        for (let i = 0; i < nsRes.length; i++) {
            const nsProp = nsRes[i]
            const psProp = psRes.length > 0 ? getPropAndDelete(psRes, nsProp.path) : null
            const screenId = getScreenIdFromPath(nsProp.path),
                componentId = getComponentIdFromPath(nsProp.path)
            if (psProp) {
                // this property exists in both states, check for modification
                if (isHashlistInstance(psProp.value) && isHashlistInstance(nsProp.value)) {
                    // hashlist comparison
                    if (!psProp.value.equal(nsProp.value)) {
                        result.changed.push(nsProp)
                        if (isRouterScreens) result.routerScreensUpdates = true
                        if (screenId && !result.updatedScreens[screenId])
                            result.updatedScreens[screenId] = nextState.router.screens[screenId]
                    }
                } else if (psProp.value !== nsProp.value) {
                    // default comparison
                    result.changed.push(nsProp)
                    if (isRouterScreens) result.routerScreensUpdates = true
                    if (screenId && !result.updatedScreens[screenId])
                        result.updatedScreens[screenId] = nextState.router.screens[screenId]
                }
            } else {
                // new property
                result.added.push({
                    ...nsProp,
                    componentId,
                    screenId,
                })
                if (isRouterScreens) result.routerScreensUpdates = true
                if (screenId && !result.updatedScreens[screenId])
                    result.updatedScreens[screenId] = nextState.router.screens[screenId]
            }
        }
        for (let i = 0; i < psRes.length; i++) {
            const screenId = getScreenIdFromPath(psRes[i].path)
            result.deleted.push(psRes[i])
            if (isRouterScreens) result.routerScreensUpdates = true
            if (screenId && !result.updatedScreens[screenId])
                result.updatedScreens[screenId] = prevState.router.screens[screenId]
        }
    })
    return result
}

function getPropAndDelete(props, propPath) {
    let index = -1
    props.find((p, i) => {
        if (p.path === propPath) {
            index = i
            return true
        }
        return false
    })
    return index >= 0 ? props.splice(index, 1)[0] : null
}

export function getLastDiff() {
    return lastUpdDiff
}

export default diffMiddleware
