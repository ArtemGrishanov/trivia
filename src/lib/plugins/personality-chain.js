import { Selector } from '../object-path'
import { DYNAMIC_CONTENT_PROP, ContentPropsList, Schemas } from '../engage-ui/DynamicContent'

import { getScreenIdFromPath } from '../remix/util/util'
import { postMessage, getPathByComponentId } from '../remix'

/**
 *
 * @param {{remix: *}} param0
 */
const initPersonalityChain = ({ remix, optionTag = 'option' }) => {
    const CHAIN_MARKER = 'CHAIN_MARKER'
    const BASE_SELECTOR = `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ tags=~${optionTag}]`
    const DYNAMIC_CONTENT_SELECTOR = `${BASE_SELECTOR}.${DYNAMIC_CONTENT_PROP}`

    let ICON_STYLES = {
        icons: {
            personalityChain: {
                name: 'chainOption',
                clickable: true,
                title: 'Set link',
                onClickEvent: 'event_personalityChain',
            },
        },
    }

    remix.extendSchema({
        [DYNAMIC_CONTENT_SELECTOR]: {
            type: 'object',
            default: {},
        },
        ...Object.fromEntries(
            Object.entries(Schemas.iconList._schm).map(([key, node]) => {
                const path = `${DYNAMIC_CONTENT_SELECTOR}.${ContentPropsList.ICON_LIST}.${key}`

                return [path, node]
            }),
        ),
    })

    const baseSelector = new Selector(DYNAMIC_CONTENT_SELECTOR)
    remix.registerTriggerAction(CHAIN_MARKER, event => {
        const state = event.remix.getState()
        const mode = state.session.mode

        const data = [...event.eventData.diff.added, ...event.eventData.diff.changed]
            .filter(({ path }) => {
                return baseSelector.match(path, state)
            })
            .map(({ path }) => {
                const evalPath = path
                    .split('.')
                    .map(part => `['${part}']`)
                    .join('')
                const dynamicContent = eval(`state${evalPath}`)

                if (mode === 'edit') {
                    const update = {
                        ...(dynamicContent || {}),
                        [ContentPropsList.ICON_LIST]: {
                            ...ICON_STYLES,
                            payload: {
                                screen_id: path.split('screens.').pop().split('.components')[0],
                                option_id: path.split('components.').pop().split('.dynamicContent')[0],
                            },
                        },
                    }

                    return [`${path}`, update]
                } else if (dynamicContent !== void 0) {
                    const update = JSON.parse(JSON.stringify(dynamicContent))
                    delete update[ContentPropsList.ICON_LIST]

                    return [`${path}`, update]
                } else {
                    return false
                }
            })
            .filter(data => data !== false)

        remix.setData(Object.fromEntries(data))
    })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: {
                prop: 'path',
                clause: 'MATCH',
                value: DYNAMIC_CONTENT_SELECTOR,
            },
        },
        then: { actionType: CHAIN_MARKER },
    })

    remix.registerTriggerAction('handle_personalityChain', event => {
        const option_id = event.eventData.parentProps.id
        const screen_id = getScreenIdFromPath(getPathByComponentId(option_id))

        postMessage('request_data_layer', { layer_type: 'personality_chain', screen_id, option_id })
    })

    remix.addTrigger({
        when: {
            eventType: `event_personalityChain`,
        },
        then: { actionType: `handle_personalityChain` },
    })
}

export default initPersonalityChain
