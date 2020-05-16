const FACEBOOK_BUTTON = 'FACEBOOK_BUTTON'
const FACEBOOK_TAG = 'facebook'

const initButtonBehavior = ({ remix }) => {
    remix.registerTriggerAction(FACEBOOK_BUTTON, event => {
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
            condition: { prop: 'tags', clause: 'CONTAINS', value: FACEBOOK_TAG },
        },
        then: { actionType: FACEBOOK_BUTTON },
    })
}

export default initButtonBehavior
