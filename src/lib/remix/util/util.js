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
 *
 * @param {string} path
 */
export function isPathToPopupComponent(path) {
    return path.includes('.popup') && path.includes('.components.')
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
    const regex = /^router\.screens\.[A-z0-9]+\.components\.([A-z0-9]+)/g,
        m = regex.exec(path)
    return m && m[0] && m[1] ? m[1] : null
}

/**
 * Parses property path and returns popup id
 *
 * @param {string} path, property path, example 'router.screens.8wruuz.components.zbnkhy.fontShadow'
 * @return {string} screenId, example 8wruuz
 */
export function getPopupIdFromPath(path) {
    const regex = /^router\.screens\.[A-z0-9]+\.popups\.([A-z0-9]+)/g,
        m = regex.exec(path)
    return m && m[0] && m[1] ? m[1] : null
}

export function getPopupComponentIdFromPath(path) {
    const regex = /^router\.screens\.[A-z0-9]+\.popups\.[A-z0-9]+\.components\.([A-z0-9]+)/g,
        m = regex.exec(path)
    return m && m[0] && m[1] ? m[1] : null
}

/**
 * Вернуть имя свойства из строки
 * @param {string} path например 'router.screens.8wruuz.components.zbnkhy.fontShadow'
 * @return {string} 'fontShadow'
 */
export function getPropNameFromPath(path) {
    const regex = /^router\.screens\.[A-z0-9]+\.components\.[A-z0-9]+\.([A-z0-9]+)$/g,
        m = regex.exec(path)
    return m && m[0] && m[1] ? m[1] : null
}

/**
 * метод парсит с=строку свойства компонентов и возвращает объект со свойствами {screenId, componentId, propName}
 */
const _parsedPathes = {}
export function parseComponentPath(path) {
    if (_parsedPathes[path]) {
        return _parsedPathes[path]
    }
    const regex = /^router\.screens\.([A-z0-9]+)\.components\.([A-z0-9]+)\.([A-z0-9]+)$/g,
        m = regex.exec(path)
    if (m && m[1] && m[2] && m[3]) {
        _parsedPathes[path] = {
            screenId: m[1],
            componentId: m[2],
            propName: m[3],
        }
        return _parsedPathes[path]
    }
}

const _parsedCondPathes = {}
export function parseComponentAdapteduiPath(path) {
    if (_parsedCondPathes[path]) {
        return _parsedCondPathes[path]
    }
    const regex = /^router\.screens\.([A-z0-9]+)\.adaptedui\.([A-z0-9]+)\.props.([A-z0-9]+).([A-z0-9]+)$/g,
        m = regex.exec(path)
    if (m && m[1] && m[2] && m[3] && m[4]) {
        _parsedCondPathes[path] = {
            screenId: m[1],
            masterKey: m[2],
            componentId: m[3],
            propName: m[4],
        }
        return _parsedCondPathes[path]
    }
}

const _parsedPopupPathes = {}
export function parsePopupComponentPath(path) {
    if (path in _parsedPopupPathes) return _parsedPopupPathes[path]

    const regex = /^router\.screens\.([A-z0-9]+)\.popups\.([A-z0-9]+)\.components\.([A-z0-9]+)\.([A-z0-9]+)$/g,
        m = regex.exec(path)

    if (m && m[1] && m[2] && m[3] && m[4]) {
        _parsedPopupPathes[path] = {
            screenId: m[1],
            popupId: m[2],
            popupComponentId: m[3],
            propName: m[4],
        }

        return _parsedPopupPathes[path]
    }
}

const _parsedPopupCondPathes = {}
export function parsePopupComponentAdapteduiPath(path) {
    if (_parsedPopupCondPathes[path]) {
        return _parsedPopupCondPathes[path]
    }
    const regex = /^router\.screens\.([A-z0-9]+)\.popups\.([A-z0-9]+)\.adaptedui\.([A-z0-9]+)\.props.([A-z0-9]+).([A-z0-9]+)$/g,
        m = regex.exec(path)
    if (m && m[1] && m[2] && m[3] && m[4] && m[5]) {
        _parsedPopupCondPathes[path] = {
            screenId: m[1],
            popupId: m[2],
            masterKey: m[3],
            popupComponentId: m[4],
            propName: m[5],
        }
        return _parsedPopupCondPathes[path]
    }
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
    let timeout = null

    return function () {
        const [context, args] = [this, arguments]
        const later = function () {
            timeout = null
            if (!immediate) {
                func.apply(context, args)
            }
        }
        const callNow = immediate && !timeout

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)

        if (callNow) {
            func.apply(context, args)
        }
    }
}

export function throttle(callback, wait, immediate = false) {
    let timeout = null
    let initialCall = true

    return function () {
        const callNow = immediate && initialCall
        const next = () => {
            callback.apply(this, arguments)
            timeout = null
        }

        if (callNow) {
            initialCall = false
            next()
        }

        if (!timeout) {
            timeout = setTimeout(next, wait)
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

const encodeChars = [`\n`, `\r`, `\``, `'`, `"`, `<`, `>`]

export function htmlEncode(html) {
    encodeChars.forEach(char => {
        const reg = new RegExp(char, 'g')
        html = html.replace(reg, `U+${char.charCodeAt(0)};`)
    })
    return html
}

export function htmlDecode(str) {
    encodeChars.forEach(char => {
        const reg = new RegExp(`U\\+${char.charCodeAt(0)};`, 'g')
        str = str.replace(reg, char)
    })
    return str
}

/**
 * Получить простое превью экрана в виде html строки
 * Берется фон экрана и один текст на нем.
 *
 * @param {Screen} screen
 * @param {string} defaultTitle
 */
export function getScreenHTMLPreview({ screen, defaultTitle }) {
    const FB_SHARE_WIDTH = 1200, // поддерживаем пока один фикс размер шаринг картинки
        FB_SHARE_HEIGHT = 630,
        mainTextCmp = screen.components.toArray().find(c => c.displayName === 'Text'),
        backStyle = `width:${FB_SHARE_WIDTH}px;
            height:${FB_SHARE_HEIGHT}px;
            padding:100px;
            box-sizing:border-box;
            text-align:center;
            background-image:url(${screen.backgroundImage});
            background-size:cover;
            background-position:center;
            background-color:#2990fb;
            font-family:Arial,sans-serif;
            color:#fff;
            font-size:48px;
            display:flex;
            justify-content:center;
            align-items:center;`

    let mainText = mainTextCmp ? mainTextCmp.text.replace(/<[^>]+>/g, '') : null

    if (!mainText) {
        mainText = defaultTitle
    }

    return `<div style="${backStyle}">
                ${mainText}
            </div>`
}

export function intersectRect(r1, r2) {
    return !(
        r2.left > r1.left + r1.width ||
        r2.left + r2.width < r1.left ||
        r2.top > r1.top + r1.height ||
        r2.top + r2.height < r1.top
    )
}

export function tryToMagnet(left, width, id, propMagnetsVertical) {
    // trying to find an appropriate magnet to align 'left'
    // магнит тип edge - за эти линии компонент может зацепляться только левым или правым краем. Для середины существует тип center
    const MAGNET_DISTANCE = 5 // px
    let magnets = null
    if (propMagnetsVertical) {
        const magnet = propMagnetsVertical.find(mv => {
            if (id !== mv.componentId) {
                if (mv.type === 'center' && Math.abs(mv.left - (left + width / 2)) < MAGNET_DISTANCE) {
                    left = mv.left - width / 2
                    return mv
                } else if (mv.type === 'edge') {
                    if (Math.abs(mv.left - left) < MAGNET_DISTANCE) {
                        // компонент левым краем зацепился за магнит типа edge
                        left = mv.left
                        return mv
                    } else if (Math.abs(mv.left - (left + width)) < MAGNET_DISTANCE) {
                        // компонент правым краем зацепился за магнит типа edge
                        left = mv.left - width
                        return mv
                    }
                }
            }
        })
        if (magnet) {
            // сделано с заделом на несколько магнитов, возможно будем отобразать несколько - добавятся горизонтальные
            magnets = [magnet]
        }
    }
    return { left, magnets }
}

/**
 * Из первого объекта удалить свойства которые есть во втором и вернуть новый объект
 *
 * @param {*} obj1
 * @param {*} obj2
 */
export function objectMinus(obj1 = {}, obj2 = {}) {
    const result = { ...obj1 }
    Object.keys(obj2).forEach(key => {
        if (result.hasOwnProperty(key)) {
            delete result[key]
        }
    })
    return result
}

/**
 *
 * @param {HTMLElement} element
 * @returns {string}
 */
export function elementToHtml(element) {
    const tmp = document.createElement('div')
    tmp.appendChild(element)
    return tmp.innerHTML
}

/**
 * Удаляет ненужные для превью элементы редактора (артефакты)
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
export function cutTextEditor(element) {
    const rmxTextEditorList = element.querySelectorAll('.rmx-text-editor')

    for (let i = 0; i < rmxTextEditorList.length; i++) {
        const qlEditor = rmxTextEditorList[i].querySelector('.ql-editor').cloneNode(true)
        rmxTextEditorList[i].innerHTML = `
            <div class="ql-container ql-snow ql-disabled">
                ${elementToHtml(qlEditor)}
            </div>
        `
    }
    return element
}

/**
 * Удаляет рамки которые появляются при наведении/нажатии на элемент
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
export function cutRmxEditingBorders(element) {
    const rmxLayoutItemSelectionCntList = element.querySelectorAll('.rmx-layout_item_selection_cnt')

    for (let i = 0; i < rmxLayoutItemSelectionCntList.length; i++) {
        const item = rmxLayoutItemSelectionCntList[i]
        item.parentNode.removeChild(item)
    }

    return element
}

/**
 * Удаляет TextEditor и ненужные для превью Remix элементы
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
export function removeUnnecessaryItemsFromScreen(element) {
    const SELECTORS = ['.rmx-text-editor', '.rmx-layout_item_selection_cnt']
    const isNeedCopy = SELECTORS.some(s => !!element.querySelector(s))

    if (!isNeedCopy) {
        return element
    }

    let copyOfElement = element.cloneNode(true)
    copyOfElement = cutTextEditor(copyOfElement)
    copyOfElement = cutRmxEditingBorders(copyOfElement)

    return copyOfElement
}

export function isObject(v) {
    return typeof v === 'object' && v !== null
}

/**
 * From https://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects/16788517#16788517
 * @param {*} x
 * @param {*} y
 */
export function objectEquals(x, y) {
    if (x === null || x === undefined || y === null || y === undefined) {
        return x === y
    }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) {
        return false
    }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) {
        return x === y
    }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) {
        return x === y
    }
    if (x === y || x.valueOf() === y.valueOf()) {
        return true
    }
    if (Array.isArray(x) && x.length !== y.length) {
        return false
    }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) {
        return false
    }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) {
        return false
    }
    if (!(y instanceof Object)) {
        return false
    }

    // recursive object equality check
    var p = Object.keys(x)
    return (
        Object.keys(y).every(function (i) {
            return p.indexOf(i) !== -1
        }) &&
        p.every(function (i) {
            return objectEquals(x[i], y[i])
        })
    )
}
