/**
 * Плагин добавляет экран Cover в приложение. Который будет стартовым экраном
 *
 * @param {array} options.screenTag
 */
export default function initCoverScreen(options = { remix: null, screenTag: null, startBtnTag: null }) {
    const defScreenTag = '__plugin__coverScreen',
        defStartBtnTag = '__plugin__coverStartBtn',
        screenTag = options.screenTag || '',
        remix = options.remix,
        startBtnTag = options.startBtnTag || ''

    /**
     * Add new properties to app schema for additional plugin functionality
     * These properties will be added to the app state and normalized
     */
    remix.extendSchema({
        'app.coverScreen.enable': {
            type: 'boolean',
            default: true,
        },
    })

    Remix.registerTriggerAction('cover-screen:update_cover_screen', event => {
        const state = event.remix.getState(),
            enable = state.app.coverScreen.enable,
            filteredScrs = event.remix.getScreens({ tag: defScreenTag, includeDisabled: true })
        let scr = filteredScrs.length > 0 ? filteredScrs[0] : null

        if (enable) {
            if (!scr) {
                // cover screen does not exist, let's create with minimal component set
                event.remix.addHashlistElement('router.screens', 0, {
                    newElement: { backgroundColor: '#777', tags: `${defScreenTag} ${screenTag}` },
                })
                scr = event.remix.getScreens({ tag: defScreenTag, includeDisabled: true })[0]
                event.remix.addScreenComponent(scr.hashlistId, {
                    displayName: 'Button',
                    left: 48,
                    top: 30,
                    tags: `${defStartBtnTag} ${startBtnTag}`,
                })
                event.remix.addScreenComponent(scr.hashlistId, {
                    displayName: 'Text',
                    left: 100,
                    top: 30,
                })
            }
            event.remix.setData({ [`router.screens.${scr.hashlistId}.disabled`]: false })
        } else {
            if (scr) {
                // disable existing cover screen
                // but do not delete. User might be able to reenable cover screen with the same design
                event.remix.setData({ [`router.screens.${scr.hashlistId}.disabled`]: true })
            }
        }
    })

    remix.addTrigger({
        when: { eventType: 'property_updated', condition: { prop: 'path', clause: 'EQUALS', value: 'router.screens' } },
        then: { actionType: 'cover-screen:update_cover_screen' },
    })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: { prop: 'path', clause: 'EQUALS', value: 'app.coverScreen.enable' },
        },
        then: { actionType: 'cover-screen:update_cover_screen' },
    })
}
