import { getProp } from './ui-methods'

/**
 * Проверить что компонент отцентрован
 *
 * @param {*} containerWidth
 * @param {*} screenId
 * @param {*} componentId
 */
export function isCentered(containerWidth, screenId, componentId) {
    const l = getProp(screenId, componentId, 'left')
    const w = getProp(screenId, componentId, 'width')
    return Math.round((containerWidth - w) / 2) === Math.round(l)
}

/**
 * Проверить что компонент в пределах экрана
 *
 * @param {*} containerWidth
 * @param {*} screenId
 * @param {*} componentId
 */
export function isHere(containerWidth, screenId, componentId) {
    const l = getProp(screenId, componentId, 'left')
    const w = getProp(screenId, componentId, 'width')
    return l > 0 && l + w < containerWidth
}
