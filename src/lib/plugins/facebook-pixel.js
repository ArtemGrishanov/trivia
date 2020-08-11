const maxBy = (values, mapFn) => {
    const mapedValues = values.map(mapFn)

    const max = Math.max(...mapedValues)

    const i = mapedValues.indexOf(max)

    return i !== -1 ? values[i] : values[0]
}

const getTitleFromComponents = components => {
    const textComponents = Object.values(components).filter(
        component => typeof component === 'object' && component.displayName === 'Text' && component.text !== void 0,
    )

    const [_, mainComponentText] = maxBy(
        textComponents.map(component => {
            let score = 0

            component.text.includes('-huge') && ++score
            component.text.includes('-center') && ++score

            return [score, component.text]
        }),
        ([score]) => score,
    )

    const texts = mainComponentText.match(/[^<>]+(?=[<])/g) || [mainComponentText]

    return texts.join(' ')
}

const getCurrentScreen = remix => {
    const state = remix.getState()

    return state.router.screens[state.router.currentScreenId] || state.router.screens.toArray()[0]
}

const getCurrentScreenTitle = remix => {
    return getTitleFromComponents(getCurrentScreen(remix).components)
}

/**
 * Плагин отслеживает установку кода счетчика app.facebook.trackingId и встраивает код facebook аналитики
 */
export default function initFacebookAnalytics(options = {}) {
    let trackingCodeEmbedded = false
    const remix = options.remix
    const { startBtnTag = 'coverStartBtn', resultScreenTag = 'result', questionScreenTag = 'question' } = options

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

                    fbq('track', 'interacty-start', {
                        projectType: process.env.PROJECT_TYPE,
                        title: getCurrentScreenTitle(event.remix),
                    })
                }
            }
        }
    })

    remix.registerTriggerAction('fb:startquiz', event => {
        if (trackingCodeEmbedded) {
            fbq('track', 'interacty-startquiz', {
                projectType: process.env.PROJECT_TYPE,
                title: getCurrentScreenTitle(event.remix),
            })
        }
    })

    remix.registerTriggerAction('fb:stepN', event => {
        if (trackingCodeEmbedded) {
            const state = event.remix.getState()
            const { screens, currentScreenId } = state.router
            const taggedScreens = screens.filter(({ tags }) => tags.indexOf(questionScreenTag) !== -1)

            const current = taggedScreens.getIndex(currentScreenId) + 1
            if (!current) return

            fbq('track', `interacty-step${current}`, {
                projectType: process.env.PROJECT_TYPE,
                question: getCurrentScreenTitle(event.remix),
                step: current,
            })
        }
    })

    remix.registerTriggerAction('fb:form', event => {
        if (trackingCodeEmbedded) {
            fbq('track', 'interacty-form', {
                projectType: process.env.PROJECT_TYPE,
                title: getTitleFromComponents(event.remix.getState().router.screens.toArray()[0].components),
            })
        }
    })

    remix.registerTriggerAction('fb:result', event => {
        if (trackingCodeEmbedded) {
            fbq('track', 'interacty-result', {
                projectType: process.env.PROJECT_TYPE,
                title: getCurrentScreenTitle(event.remix),
            })
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

    remix.addTrigger({
        when: {
            eventType: 'onclick',
            condition: { prop: 'tags', clause: 'CONTAINS', value: startBtnTag },
        },
        then: { actionType: 'fb:startquiz' },
    })

    remix.addTrigger({
        when: {
            eventType: 'remix-routing:next_screen',
            condition: { prop: 'tags', clause: 'CONTAINS', value: questionScreenTag },
        },
        then: { actionType: 'fb:stepN' },
    })

    remix.addTrigger({
        when: {
            eventType: 'form_data_sent',
        },
        then: { actionType: 'fb:form' },
    })

    remix.addTrigger({
        when: {
            eventType: 'remix-routing:next_screen',
            condition: { prop: 'tags', clause: 'CONTAINS', value: resultScreenTag },
        },
        then: { actionType: 'fb:result' },
    })
}
