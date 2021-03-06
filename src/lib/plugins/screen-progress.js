/**
 * Плагин добавляет компонент Progress на экраны указанного типа
 * И компонент будет отображать порядковый номер экрана среди экранов указанного типа
 *
 * @param {array} options.screenTag
 */
export default function initScreenProgress(options = { remix: null, screenTag: null }) {
    const screenTag = options.screenTag,
        remix = options.remix

    /**
     * Add new properties to app schema for additional plugin functionality
     * These properties will be added to the app state and normalized
     */
    remix.extendSchema({
        // add or hide component from all screens
        // Remix.setData({'app.screenProgress.showQuestionProgress': false});
        // Remix.setData({'app.screenProgress.showQuestionProgress': true});
        //
        'app.screenProgress.showQuestionProgress': {
            type: 'boolean',
            default: true,
        },
    })

    Remix.registerTriggerAction('screen-progress:update_progress_components', event => {
        const state = event.remix.getState(),
            showProgress = state.app.screenProgress.showQuestionProgress,
            scrs = event.remix.getScreens({ tag: screenTag })
        scrs.forEach((scr, i) => {
            let pc = getProgressComponent(scr)
            if (showProgress) {
                if (!pc) {
                    // create progress component first time
                    event.remix.addScreenComponent(scr.hashlistId, {
                        displayName: 'Progress',
                        left: 48,
                        top: 30,
                        fontSize: 20,
                        step: i + 1,
                        max: scrs.length,
                        color: '#aaa',
                    })
                    // нужно узнать id нового компонента
                    // добавился новый компонент на экран, надо заново запросить стейт
                    pc = getProgressComponent(event.remix.getState().router.screens[scr.hashlistId])
                }
                //let path = `router.screens.${scr.hashlistId}.components.${pc.hashlistId}.`;
                // set props text or step-max
                event.remix.setComponentProps({
                    id: pc.hashlistId,
                    max: scrs.length,
                    step: i + 1,
                })
            } else {
                if (pc) {
                    // если прогресс добавлен на экран, то удалить его
                    event.remix.deleteScreenComponent(scr.hashlistId, pc.hashlistId)
                }
            }
        })
    })

    remix.addTrigger({
        when: { eventType: 'property_updated', condition: { prop: 'path', clause: 'EQUALS', value: 'router.screens' } },
        then: { actionType: 'screen-progress:update_progress_components' },
    })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: { prop: 'path', clause: 'EQUALS', value: 'app.screenProgress.showQuestionProgress' },
        },
        then: { actionType: 'screen-progress:update_progress_components' },
    })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: { prop: 'path', clause: 'MATCH', value: 'router.[screens HashList]./^[0-9a-z]+$/.disabled' },
        },
        then: { actionType: 'screen-progress:update_progress_components' },
    })

    function getProgressComponent(screen) {
        return screen.components.toArray().find(c => c.displayName === 'Progress')
    }
}
