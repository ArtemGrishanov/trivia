import { Selector } from '../object-path'
import { getComponentIdFromPath, getScreenIdFromPath } from '../../lib/remix/util/util'

const INIT = 'INIT'
const FACEBOOK_SHARE = 'FACEBOOK_SHARE'
const FACEBOOK_SHARE_TAG = 'facebook'
const VK_SHARE = 'VK_SHARE'
const VK_SHARE_TAG = 'vkontakte'
const WHATSAPP_CHAT = 'WHATSAPP_CHAT'
const WHATSAPP_CHAT_TAG = 'whatsapp-chat'

const WHATSAPP_SELECTOR_TEL = `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ tags=~${WHATSAPP_CHAT_TAG}].tel`
const WHATSAPP_SELECTOR_MSG = `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ tags=~${WHATSAPP_CHAT_TAG}].msg`

const collectDiffByComponentId = diff => {
    return diff.reduce((store, { componentId, value, propName, screenId }) => {
        if (componentId in store) {
            store[componentId][propName] = value
        } else {
            store[componentId] = { [propName]: value, screenId }
        }

        return store
    }, {})
}

const buildWhatsappLink = ({ tel, msg }) => {
    let url = 'https://wa.me'

    if (tel) {
        url += `/${tel}`
        if (msg) url += `?text=${encodeURI(msg)}`
    }

    return url
}

const initButtonBehavior = ({ remix }) => {
    remix.extendSchema({
        [WHATSAPP_SELECTOR_TEL]: {
            type: 'string',
            minLength: 0,
            maxLength: 64,
            default: '',
        },
        [WHATSAPP_SELECTOR_MSG]: {
            type: 'string',
            minLength: 0,
            maxLength: 512,
            default: '',
        },
    })

    remix.registerTriggerAction(FACEBOOK_SHARE, event => {
        try {
            const state = event.remix.getState(),
                id = event.eventData.id,
                entity = state.app.share.entities.toArray().find(e => e.componentId === id)

            if (entity && entity.href) {
                window.FB.ui(
                    {
                        method: 'share',
                        href: entity.href,
                    },
                    response => {},
                )
                Remix.fireEvent('fb_share_requested')
            } else {
                console.error('Share entity not found or href not set')
            }
        } catch (err) {
            console.error('Share entities not configured properly', err.message)
        }
    })

    remix.addTrigger({
        when: {
            eventType: 'onclick',
            condition: { prop: 'tags', clause: 'CONTAINS', value: FACEBOOK_SHARE_TAG },
        },
        then: { actionType: FACEBOOK_SHARE },
    })

    remix.registerTriggerAction(VK_SHARE, event => {
        try {
            const state = event.remix.getState(),
                id = event.eventData.id,
                entity = state.app.share.entities.toArray().find(e => e.componentId === id)

            if (entity && entity.href) {
                const title = entity.title ? `&title=${entity.title}` : ''
                const imageUrl = entity.imageUrl ? `&image=${entity.imageUrl}` : ''

                window.open(`https://vk.com/share.php?url=${entity.href}${title}${imageUrl}`)

                Remix.fireEvent('vk_share_requested')
            } else {
                console.error('Share entity not found or href not set')
            }
        } catch (err) {
            console.error('Share entities not configured properly', err.message)
        }
    })

    remix.addTrigger({
        when: {
            eventType: 'onclick',
            condition: { prop: 'tags', clause: 'CONTAINS', value: VK_SHARE_TAG },
        },
        then: { actionType: VK_SHARE },
    })
}
const telSelector = new Selector(WHATSAPP_SELECTOR_TEL)
const msgSelector = new Selector(WHATSAPP_SELECTOR_MSG)
remix.registerTriggerAction(WHATSAPP_CHAT, event => {
    const state = event.remix.getState()

    const telAndMsgDiff = [...event.eventData.diff.added, ...event.eventData.diff.changed]
        .filter(({ path }) => {
            return telSelector.match(path, state) || msgSelector.match(path, state)
        })
        .map(datum => {
            if (!datum.componentId) datum.componentId = getComponentIdFromPath(datum.path)
            if (!datum.screenId) datum.screenId = getScreenIdFromPath(datum.path)

            return datum
        })

    const update = Object.fromEntries(
        Object.entries(collectDiffByComponentId(telAndMsgDiff)).map(([componentId, params]) => {
            return [`router.screens.${params.screenId}.components.${componentId}.openUrl`, buildWhatsappLink(params)]
        }),
    )

    remix.setData(update)
})

remix.addTrigger({
    when: {
        eventType: 'property_updated',
        condition: {
            prop: 'path',
            clause: 'MATCH',
            value: `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ tags=~${WHATSAPP_CHAT_TAG}].tel`,
        },
    },
    then: { actionType: WHATSAPP_CHAT },
})

remix.addTrigger({
    when: {
        eventType: 'property_updated',
        condition: {
            prop: 'path',
            clause: 'MATCH',
            value: `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ tags=~${WHATSAPP_CHAT_TAG}].msg`,
        },
    },
    then: { actionType: WHATSAPP_CHAT },
})

export default initButtonBehavior
