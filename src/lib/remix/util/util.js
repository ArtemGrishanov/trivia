export function getUniqueId() {
    var firstPart = (Math.random() * 46656) | 0
    var secondPart = (Math.random() * 46656) | 0
    firstPart = ('000' + firstPart.toString(36)).slice(-3)
    secondPart = ('000' + secondPart.toString(36)).slice(-3)
    return firstPart + secondPart
}

export function isHashlistInstance(obj) {
    return obj && obj._orderedIds && obj._orderedIds.length >= 0
    //return obj.constructor && typeof obj.constructor.name === "string" && obj.constructor.name.toLowerCase() === "hashlist";
}

/**
 * Parses property path and returns screen id
 *
 * @param {string} path, property path, example 'router.screens.8wruuz.components.zbnkhy.fontShadow'
 * @return {string} screenId, example 8wruuz
 */
export function getScreenIdFromPath(path) {
    const regex = /^router\.screens\.([A-z0-9]+)/g,
        m = regex.exec(path)
    return m && m[0] && m[1] ? m[1] : null
}

/**
 * Parses property path and returns component id
 *
 * @param {string} path, property path, example 'router.screens.8wruuz.components.zbnkhy.fontShadow'
 * @return {string} screenId, example zbnkhy
 */
export function getComponentIdFromPath(path) {
    const regex = /^router\.screens\.[A-z0-9]+.components\.([A-z0-9]+)/g,
        m = regex.exec(path)
    return m && m[0] && m[1] ? m[1] : null
}

/**
 * From https://github.com/reduxjs/redux/blob/master/src/combineReducers.js
 * TODO import normally
 * This function for automated tests
 *
 * @param {*} reducers
 */
export function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers)
    const finalReducers = {}
    for (let i = 0; i < reducerKeys.length; i++) {
        const key = reducerKeys[i]

        if (typeof reducers[key] === 'function') {
            finalReducers[key] = reducers[key]
        }
    }
    const finalReducerKeys = Object.keys(finalReducers)

    return function combination(state = {}, action) {
        let hasChanged = false
        const nextState = {}
        for (let i = 0; i < finalReducerKeys.length; i++) {
            const key = finalReducerKeys[i]
            const reducer = finalReducers[key]
            const previousStateForKey = state[key]
            const nextStateForKey = reducer(previousStateForKey, action)
            if (typeof nextStateForKey === 'undefined') {
                const errorMessage = getUndefinedStateErrorMessage(key, action)
                throw new Error(errorMessage)
            }
            nextState[key] = nextStateForKey
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey
        }
        hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length
        return hasChanged ? nextState : state
    }
}

/**
 * Flattens object and returns property path object. Example below
 *
 * Input:
 * {
 *     prop: 'val',
 *     app: {
 *          other: 123
 *     }
 * }
 *
 * Output:
 * {
 *      'prop': 'val',
 *      'app.other': 123
 * }
 *
 * @param {*} obj
 */
export function flattenProperties(obj = {}, path = '', result = {}) {
    path = path.length > 0 ? path + '.' : path
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object') {
            flattenProperties(obj[k], path + k, result)
        } else {
            result[path + k] = obj[k]
        }
    })
    return result
}

export function debounce(func, wait, immediate) {
    let timeout
    return function () {
        let context = this,
            args = arguments
        let later = function () {
            timeout = null
            if (!immediate) {
                func.apply(context, args)
            }
        }
        let callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) {
            func.apply(context, args)
        }
    }
}

export function callOncePerTime(func, wait) {
    let timeout = null
    return function (...args) {
        if (timeout === null) {
            func.apply(this, args)

            timeout = setTimeout(() => (timeout = null), wait)
        }
    }
}
