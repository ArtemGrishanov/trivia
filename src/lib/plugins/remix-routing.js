// Плагин добавляет специальные возможности в приложение:
// - параметры в схему данных, в стейте появляется новое свойство state.router.routingMode
// - добавляется новое действие registerTriggerAction('build_route')
// - Добавляются триггеры на запуск приложения, клик кнопки Начать Заново и изменение state.router.routingMode
//
// при инициализации плагина можно передать параметры. Схему роутинга, в котором будет и функция рассчета результата (своя для каждого типа теста)
// то есть мы переиспользуем логику роутинга но результат определяем по разному.


/**
 *
 * @param {*} options screenRoute - screen transition model
 * screenRoute: [
 *      {tag: 'start'}, // show all scrrens with tag in linear order
 *      {tag: 'question', shuffle: true}, // show all scrrens with tag and shuffle them
 *      {id: calcTriviaRes} // show one screenId returned by function 'calcTriviaRes'
 * ]
 */
export default function initRemixRouting(options = {remix: null, screenRoute: []}) {

    const screenRoute = options.screenRoute;
    const remix = options.remix;

    /**
     * Add new properties to app schema for additional functionality
     * These properties will be added to the app state and normalized
     *
     */
    remix.extendSchema({
        "router.routingMode": {
            type: 'string',
            enum: ['linear', 'linear_random', 'custom'],
            default: 'linear'
        }
    });

    /**
     * Actions will be added to remix
     *
     */
    remix.registerTriggerAction('build_route', (event) => {
        const state = event.remix.getState();
        const routingMode = state.router.routingMode;
        if (routingMode === 'linear' || routingMode === 'linear_random') {
            //TODO use screenRoute option. Not 'question', all types...
            let screens = [];
            screenRoute.forEach((range) => {
                let rangeScreens;
                if (range.tag) {
                    rangeScreens = getScreensByTag(state, range.tag);
                }
                else if (range.id) {
                    //TODO
                    //rangeScreens = getScreensByTag(state, range.tag);
                }

                if (routingMode === 'linear_random') {
                    rangeScreens = rangeScreens.shuffle();
                }
                screens = screens.concat(rangeScreens);
            })

            // dispatch an action, and attribute data will be extended for Screen component. Saved in state
            let prevScr = null;
            screens.forEach( (scr) => {
                //TODO get id
                if (prevScr) {
                    event.remix.setData({ ['router.screens.' + prevScr.id + '.data.nextScreenId']: scr.id });
                }
                prevScr = scr;
            });
            // только сессионно надо устанавливать или перманентно?
            // при custom надо перманентно - но только в компоненте, но смысл тот же - значит перманентный вариант тоже есть
            // data - string сейчас... json? object? Map with primitive values only?

            //TODO set data

            // ...
        }
        else if (routingMode === 'custom') {

        }
    });

    // Build a screen route when app started (including app deserialization)
    remix.addTrigger({
        when: { eventType: 'app_start' },
        then: { actionType: 'build_route'}
    });

    remix.addTrigger({
        //TODO option for button tags
        when: { eventType: 'onclick', condition: {prop: 'tags', clause: 'CONTAINS', value: 'restart'} },
        then: { actionType: 'build_route'}
    });

    remix.addTrigger({
        when: { eventType: 'change_property', condition: {prop: 'path', clause: 'EQUALS', value: 'router.routingMode'} },
        then: { actionType: 'build_route'}
    });

    remix.addTrigger({
        when: { eventType: 'change_property', condition: {prop: 'path', clause: 'EQUALS', value: 'router.screens'} },
        then: { actionType: 'build_route'}
    });

    function getScreensByTag(state, tag) {
        const scrs = state.router.screens.toArray();
        return scrs.filter( (s) => s.tags.indexOf(tag) >= 0 );
    }

}