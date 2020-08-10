const FACEBOOK_SHARE = 'FACEBOOK_SHARE'
const FACEBOOK_SHARE_TAG = 'facebook'
const VK_SHARE = 'VK_SHARE'
const VK_SHARE_TAG = 'vkontakte'

const initButtonBehavior = ({ remix }) => {
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

export default initButtonBehavior
