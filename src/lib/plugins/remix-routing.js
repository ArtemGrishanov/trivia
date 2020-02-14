/**
 * Плагин initRemixRouting строит маршрут по экранам по параметру options.screenRoute.
 * Переход на следующий экран будет осуществлен по options.nextTag, перестроение маршрута по options.restartTag
 *
 * Плагин добавляет специальные возможности в приложение:
 * - параметры в схему данных, в стейте появляется новое свойство state.router.routingMode
 * - добавляется новое действие registerTriggerAction: 'build_route' и 'go_next_screen'
 * - Добавляются триггеры:
 *      на запуск приложения
 *      onclick на элементы с указанным тегом (например на клик на кнопку Начать Заново)
 *      изменение state.router.routingMode
 *      изменение state.router.screens
 *
 * При инициализации плагина можно передать параметры, описанные ниже
 *
 * @param {array} options.screenRoute - screen transition model, see exampple below
 * screenRoute: [
 *      {tag: 'start'}, // show all scrrens with tag in linear order
 *      {tag: 'question', shuffle: true}, // show all scrrens with tag and shuffle them
 *      {id: calcTriviaRes} // show one screenId returned by function 'calcTriviaRes'
 * ]
 * Следующий экран (id) может быть определен функцией. Такие образом для разных типов проектов можно делать вычисляемые переходы
 * (например вычислять результат теста и показывать соответствующий экран результата)
 *
 * @param {string} options.restartTag - клик на тег, при котором будет происходить перестроение маршрута
 */
export default function initRemixRouting(options = {remix: null, screenRoute: []}) {

    const screenRoute = options.screenRoute;
    const remix = options.remix;
    const restartTag = options.restartTag;
    const nextTag = options.nextTag;

    let screenIds = null;

    /**
     * Add new properties to app schema for additional plugin functionality
     * These properties will be added to the app state and normalized
     */
    remix.extendSchema({
        "router.routingMode": {
            type: 'string',
            enum: ['linear', 'linear_random', 'custom'],
            default: 'linear'
        },
        // атрибут экрана, указывает на какой экран переходить дальше
        "router.[screens HashList]./^[0-9a-z]+$/.data.nextScreenId": {
            type: 'string',
            default: ''
            //TODO этот атрибут вообще можно хранить только сессионно а значит не объявлять его в схеме, но как его тогда установить не понятно,, Поэтому объявляем его
        },
        // компонент может быть связан с переходом на следующий экран
        // это позволяет настроить кастомные переходы между экранами (ветвление)
        "router.[screens HashList]./^[0-9a-z]+$/.components./^[0-9a-z]+$/.data.nextScreenId": {
            type: 'string',
            default: ''
        }
    });

    /**
     * Actions will be added to remix
     */
    remix.registerTriggerAction('build_route', (event) => {
        console.log('remix-routing plugin: build_route')
        const state = event.remix.getState();
        const routingMode = state.router.routingMode;
        if (routingMode === 'linear' || routingMode === 'linear_random') {
            screenIds = [];
            screenRoute.forEach((range) => {
                let localIds;
                if (range.tag) {
                    localIds = event.remix.getScreens({tag: range.tag}).map(s => s.hashlistId);
                }
                else if (typeof range.idByFunction === 'string') {
                    // function will be called and return next screen id
                    // save the function name
                    localIds = 'idByFunction:' + range.idByFunction;
                }
                if (routingMode === 'linear_random') {
                    // экраны в рамках одного лиапазона перемешиваются. Но в целом порядок диапазонов созраняется
                    localIds = localIds.shuffle();
                }
                if (localIds) {
                    screenIds = screenIds.concat(localIds);
                }
                else {
                    throw new Error(`Not supported route option ${range.toString()}`);
                }
            })

            // dispatch an action, and attribute data will be extended for Screen component. Saved in state
            let prevScrId = null;
            screenIds.forEach( (scrId) => {
                if (prevScrId) {
                    event.remix.setData({ ['router.screens.' + prevScrId + '.data.nextScreenId']: scrId });
                }
                prevScrId = scrId;
            });
        }
        else if (routingMode === 'custom') {
            // Ничего не делаем
            // Атрибуты nextScreenId могут быть установлены индивидуально для каждого элемента (например каждой опции в квизе)
            // nextScreenId от элемента будет передан в событие и обработан в первую очередь в go_next_screen
        }
    });

    /**
     * Это действие пробует переключить экран на следующий.
     * Следуюший экран задается параметром nextScreenId
     *
     * 1. nextScreenId ищется в eventData
     * 2. nextScreenId ищется в свойстве 'data' у текущего экрана
     * 3. Если id найден, то выполняется показ нового экрана
     */
    Remix.registerTriggerAction('go_next_screen', (event) => {
        let isCustomFunc = false;
        const paramName = 'nextScreenId';
        let nsId = event.eventData ? event.eventData[paramName]: null;
        if (!nsId) {
            const state = event.remix.getState();
            const sid = state.router.currentScreenId;
            if (sid) {
                const scr = state.router.screens[sid];
                if (scr) {
                    nsId = scr.data ? scr.data.nextScreenId: null;
                    if (nsId.indexOf('idByFunction') === 0) {
                        isCustomFunc = true;
                        const fnName = nsId.replace(/idByFunction:/,'');
                        nsId = event.remix.callCustomFunction(fnName);
                    }
                }
                else {
                    console.error(`Action "go_next_screen" says: active scrren "${sid}" not found in screen list`);
                }
            }
        }
        if (nsId) {
            event.remix.setCurrentScreen(nsId);
        }
        else {
            if (isCustomFunc) {
                console.warn('Action "go_next_screen" says: function didn\'t return next screen id. Can not go to next screen.');
            }
            else {
                console.warn('Action "go_next_screen" says: "nextScreenId" not found neither in event.eventData nor in active screen. Can not go to next screen.');
            }
        }
    });

    Remix.registerTriggerAction('restart', (event) => {
        remix.setCurrentScreen(screenIds[0]);
    });

    if (restartTag) {
        remix.addTrigger({
            when: { eventType: 'onclick', condition: {prop: 'tags', clause: 'CONTAINS', value: restartTag} },
            then: { actionType: ['build_route', 'restart']}
        });
    }

    remix.addTrigger({
        when: { eventType: 'property_updated', condition: {prop: 'path', clause: 'EQUALS', value: 'router.routingMode'} },
        then: { actionType: 'build_route'}
    });

    remix.addTrigger({
        when: { eventType: 'property_updated', condition: {prop: 'path', clause: 'EQUALS', value: 'router.screens'} },
        then: { actionType: ['build_route', 'restart']}
    });

    remix.addTrigger({
        when: { eventType: 'property_updated', condition: {prop: 'path', clause: 'MATCH', value: 'router.[screens HashList]./^[0-9a-z]+$/.disabled'} },
        then: { actionType: ['build_route', 'restart']}
    });

    if (nextTag) {
        remix.addTrigger({
            when: { eventType: 'onclick', condition: {prop: 'tags', clause: 'CONTAINS', value: nextTag} },
            then: { actionType: 'go_next_screen'}
        });
    }
}