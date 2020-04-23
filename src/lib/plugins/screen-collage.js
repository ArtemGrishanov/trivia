/**
 * Плагин добавляет экран Cover в приложение. Который будет стартовым экраном
 *
 * @param {array} options.screenTag
 */
export default function initScreenCollage(options = { remix: null, screenTag: null, startBtnTag: null }) {
    console.log('init collage plugin')

    const collageId = '__plugin__screenCollage',
        screenTag = options.screenTag || '',
        remix = options.remix

    /**
     * Add new properties to app schema for additional plugin functionality
     * These properties will be added to the app state and normalized
     */
    remix.extendSchema({
        'app.collage.enable': {
            type: 'boolean',
            default: true,
        },
    })

    Remix.registerTriggerAction('screenCollage:update_collage_screen', event => {
        const state = event.remix.getState(),
            enable = state.app.collage.enable,
            [finalScreen] = event.remix.getScreens({ tag: 'final' })

        const collage = getCollageComponent(finalScreen)
        console.log(enable, collage, 'COLLAGE DATA')
        if (enable) {
            if (finalScreen && !collage) {
                const [finalScreen] = event.remix.getScreens().filter(x => x.tags === 'screen final')
                if (!finalScreen) {
                    return
                }
                event.remix.addHashlistElement(`router.screens.${finalScreen.hashlistId}.components`, undefined, {
                    newElement: {
                        id: collageId,
                        displayName: `Collage`,
                        top: 20,
                        left: 200,
                        width: 400,
                        height: 350,
                        tags: `collage photostoryitem`,
                    },
                })
            }
        } else {
            if (collage) {
                event.remix.deleteScreenComponent(finalScreen.hashlistId, collage.hashlistId)
            }
        }
    })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: { prop: 'path', clause: 'EQUALS', value: 'app.collage.enable' },
        },
        then: { actionType: 'screenCollage:update_collage_screen' },
    })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: { prop: 'path', clause: 'MATCH', value: 'router.[screens HashList]./^[0-9a-z]+$/.disabled' },
        },
        then: { actionType: 'screenCollage:update_collage_screen' },
    })

    function getCollageComponent(screen) {
        return screen.components.toArray().find(c => c.id === collageId)
    }
}
