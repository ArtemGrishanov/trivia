import { Selector } from '../object-path'
import { DYNAMIC_CONTENT_PROP, ContentPropsList, Schemas } from '../engage-ui/DynamicContent'

/**
 *
 * @param {{remix: *}} param0
 */
const initQuizPoints = ({ remix, optionTag = 'option' }) => {
    const CORRECT_OPTION_MARKER = 'CORRECT_OPTION_MARKER'
    const BASE_SELECTOR = `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ tags=~${optionTag}]`
    const POINTS_SELECTOR = `${BASE_SELECTOR}.data.points`
    const DYNAMIC_CONTENT_SELECTOR = `${BASE_SELECTOR}.${DYNAMIC_CONTENT_PROP}`

    const ICON_STYLES = {
        icons: {
            quizCorrectOption: {
                name: 'correctOption',
                clickable: false,
            },
        },
        hAlign: 'right',
        vAlign: 'top',
        vPadding: 5,
        hPadding: 5,
        gap: 5,
    }

    remix.extendSchema({
        [POINTS_SELECTOR]: {
            type: 'number',
            min: 0,
            max: 1,
            default: 0,
        },
        [DYNAMIC_CONTENT_SELECTOR]: {
            type: 'object',
            default: {},
            serialize: false,
        },
        ...Object.fromEntries(
            Object.entries(Schemas.iconList._schm).map(([key, node]) => {
                const path = `${DYNAMIC_CONTENT_SELECTOR}.${ContentPropsList.ICON_LIST}.${key}`

                return [path, node]
            }),
        ),
    })

    const pointsSelector = new Selector(POINTS_SELECTOR)
    remix.registerTriggerAction(CORRECT_OPTION_MARKER, event => {
        const state = event.remix.getState()
        const mode = state.session.mode

        const data = [...event.eventData.diff.added, ...event.eventData.diff.changed]
            .filter(({ path }) => {
                return pointsSelector.match(path, state)
            })
            .map(({ path, value }) => [path.replace('.data.points', ''), !!value])
            .map(([path, needShowIcon]) => {
                const evalPath = path
                    .split('.')
                    .map(part => `['${part}']`)
                    .join('')
                const dynamicContent = eval(`state${evalPath}`)[DYNAMIC_CONTENT_PROP] || {
                    [ContentPropsList.ICON_LIST]: { icons: {} },
                }

                if (needShowIcon && mode === 'edit') {
                    const update = {
                        ...dynamicContent,
                        [ContentPropsList.ICON_LIST]: {
                            ...ICON_STYLES,
                            icons: {
                                ...dynamicContent[ContentPropsList.ICON_LIST].icons,
                                ...ICON_STYLES.icons,
                            },
                        },
                    }

                    return [`${path}.${DYNAMIC_CONTENT_PROP}`, update]
                } else if (dynamicContent !== void 0) {
                    const update = JSON.parse(JSON.stringify(dynamicContent))
                    delete update[ContentPropsList.ICON_LIST].icons.quizCorrectOption

                    return [`${path}.${DYNAMIC_CONTENT_PROP}`, update]
                } else {
                    return false
                }
            })
            .filter(data => data !== false)

        remix.setData(Object.fromEntries(data), false, true)
    })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: {
                prop: 'path',
                clause: 'MATCH',
                value: POINTS_SELECTOR,
            },
        },
        then: { actionType: CORRECT_OPTION_MARKER },
    })
}

export default initQuizPoints
