/**
 * Плагин отслеживает установку кода счетчика app.google.trackingId и встраивает код гугл аналитики
 *
 */
export default function initGoogleAnalytics(options = {}) {
    let trackingCodeEmbedded = false
    const remix = options.remix

    /**
     *
     * @param {string} trackingId
     * example 'UA-88595022-4'
     */
    function embedCode(trackingId) {
        const script = document.createElement('script')
        script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
        script.async = true
        document.body.appendChild(script)
        window.dataLayer = window.dataLayer || []
        function gtag() {
            dataLayer.push(arguments)
        }
        gtag('js', new Date())
        gtag('config', trackingId)
    }

    /**
     * Add new properties to app schema for additional plugin functionality
     * These properties will be added to the app state and normalized
     */
    remix.extendSchema({
        'app.google.trackingId': {
            type: 'string',
            default: '',
        },
    })

    remix.registerTriggerAction('ga:embed_code', event => {
        if (remix.getMode() === 'published') {
            if (!trackingCodeEmbedded) {
                const trackingId = event.remix.getProperty('app.google.trackingId')
                if (trackingId) {
                    embedCode(trackingId)
                    trackingCodeEmbedded = true
                }
            }
        }
    })

    remix.addTrigger({
        when: { eventType: 'remix_inited' },
        then: { actionType: 'ga:embed_code' },
    })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: { prop: 'path', clause: 'EQUALS', value: 'app.google.trackingId' },
        },
        then: { actionType: 'ga:embed_code' },
    })
}
