/**
 * Плагин отслеживает установку кода счетчика app.facebook.trackingId и встраивает код facebook аналитики
 */
export default function initFacebookAnalytics(options = {}) {
    let trackingCodeEmbedded = false
    const remix = options.remix

    /**
     *
     * @param {string} trackingId example '1571456766228982'
     */
    function embedCode(trackingId) {
        // https://www.facebook.com/business/help/952192354843755?id=1205376682832142
        !(function (f, b, e, v, n, t, s) {
            if (f.fbq) return
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            }
            if (!f._fbq) f._fbq = n
            n.push = n
            n.loaded = !0
            n.version = '2.0'
            n.queue = []
            t = b.createElement(e)
            t.async = !0
            t.src = v
            s = b.getElementsByTagName(e)[0]
            s.parentNode.insertBefore(t, s)
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
        fbq('init', trackingId)
        fbq('track', 'PageView')
    }

    remix.extendSchema({
        'app.facebook.trackingId': {
            type: 'string',
            default: '',
        },
    })

    remix.registerTriggerAction('fb:embed_code', event => {
        if (remix.getMode() === 'published') {
            if (!trackingCodeEmbedded) {
                const trackingId = event.remix.getProperty('app.facebook.trackingId')
                if (trackingId) {
                    embedCode(trackingId)
                    trackingCodeEmbedded = true
                }
            }
        }
    })

    remix.addTrigger({
        when: { eventType: 'remix_inited' },
        then: { actionType: 'fb:embed_code' },
    })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: { prop: 'path', clause: 'EQUALS', value: 'app.facebook.trackingId' },
        },
        then: { actionType: 'fb:embed_code' },
    })
}
