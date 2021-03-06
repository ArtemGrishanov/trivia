import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import Remix, { remixReducer } from '../remix.js'
import eventSaga from '../remix/sagas/triggerExecutor.js'
import diffMiddleware from '../remix/middleware/diff.js'
import schema from '../remix/schemas/events.js'
import DataSchema from '../schema.js'
import HashList from '../hashlist.js'

// реально триггер сработает около 300+ ms после вызова Remix.setData()
// 1. setData по умолчанию асинхронный и будет 100ms агрегировать данные для пдейта
// 2. Далее diff middleware также срабатывает с задержкой 200ms после чего вызовет Remix.fireEvent('property_updated') на который и запустится trigger executor
// 3. trigger executor запустится в новом цикле event loop
const TIME_GUARANTEED_FOR_TRIGGERS_AND_DIFFS = 400

var testSchema = new DataSchema({
    'app.my.property': {
        type: 'number',
        default: 9,
        min: 0,
        max: 9999,
    },
    'app.my.other.property': {
        type: 'number',
        default: 100,
        min: 0,
        max: 9999,
    },
    'app.screens': {
        type: 'hashlist',
        default: new HashList(),
    },
    'app.[screens HashList]./^[0-9a-z]+$/.name': {
        type: 'string',
        default: '',
    },
    'app.[screens HashList]./^[0-9a-z]+$/.tag': {
        type: 'string',
        default: '-',
    },
})
testSchema.extend(schema)

const sagaMiddleware = createSagaMiddleware()
const reducer = remixReducer({
    reducers: {},
    dataSchema: testSchema,
})
const store = createStore(reducer, applyMiddleware(sagaMiddleware, diffMiddleware))
sagaMiddleware.run(eventSaga)
window.store = store // for debug: inspect storage state in browser console
Remix.setStore(store)

describe('Remix', () => {
    // beforeEach(() => {
    //     jest.useFakeTimers()
    // })
    describe('#fireEvents', () => {
        it('fire 2 events', () => {
            Remix.clearTriggersAndEvents()

            Remix.fireEvent('dumb_event', { datazz: '123' })
            Remix.fireEvent('other_dumb_event', { variable: 987 })
            expect(store.getState().session.events).toHaveLength(2)

            Remix.clearTriggersAndEvents()
            expect(store.getState().session.events).toHaveLength(0)
        })
    })

    describe('#addTrigger', () => {
        Remix.clearTriggersAndEvents()

        it('add simple trigger', done => {
            let c = 0
            let v = 0

            Remix.addTrigger({
                when: { eventType: 'dumb_event52' },
                then: Remix.registerTriggerAction('custom_action_0', evt => {
                    expect(evt.trigger.when.eventType).toEqual('dumb_event52')
                    v++
                }),
            })

            Remix.fireEvent('dumb_event32') // execute nothing

            Remix.addTrigger({
                when: { eventType: 'dumb_event32' },
                then: Remix.registerTriggerAction('custom_action_1', evt => {
                    expect(evt.trigger.when.eventType).toEqual('dumb_event32')
                    c++
                }),
            })

            Remix.fireEvent('dumb_event32') // 1 c activation
            Remix.fireEvent('dumb_event32') // 2 c activation

            Remix.fireEvent('dumb_event52') // 1 v act

            setTimeout(() => Remix.fireEvent('dumb_event32'), 30) // 3 c activation

            setTimeout(() => {
                if (c === 3 && v === 1) {
                    const dumbEventsCount = store
                        .getState()
                        .session.events.filter(evt => evt.eventType.indexOf('dumb_event') >= 0).length
                    expect(dumbEventsCount).toEqual(5)
                    done()
                }
            }, 80)
            // const dumbEventsCount = store
            //     .getState()
            //     .session.events.filter(evt => evt.eventType.indexOf('dumb_event') >= 0).length
            // expect(dumbEventsCount).toEqual(4)
        })

        it('trigger with condition CONTAINS', done => {
            Remix.clearTriggersAndEvents()

            let c = 0

            Remix.addTrigger({
                when: { eventType: 'on_condition', condition: { prop: 'tags', clause: 'CONTAINS', value: 'option' } },
                then: Remix.registerTriggerAction('custommm', evt => {
                    expect(evt.trigger.when.eventType).toEqual('on_condition')
                    c++
                }),
            })

            Remix.fireEvent('on_condition')
            Remix.fireEvent('on_condition', { tags: 'tag1 option tag2' }) // this will work
            Remix.fireEvent('on_condition', { tags: 'tag3' })
            Remix.fireEvent('on_condition9', { tags: 'tag1 option tag2' })

            setTimeout(() => {
                if (c === 1) {
                    const condEventsCount = store
                        .getState()
                        .session.events.filter(evt => evt.eventType.indexOf('on_cond') >= 0).length
                    expect(condEventsCount).toEqual(4)
                    done()
                }
            }, 80)
        })
    })

    describe('#changeProperty trigger', () => {
        it('property_updated simple trigger', done => {
            Remix.clearTriggersAndEvents()

            var c = 0

            expect(store.getState().session.events).toHaveLength(0)

            Remix.addTrigger({
                when: {
                    eventType: 'property_updated',
                    condition: { prop: 'path', clause: 'EQUALS', value: 'app.my.property' },
                },
                then: Remix.registerTriggerAction('custom', evt => {
                    expect(evt.trigger.when.eventType).toEqual('property_updated')
                    c++
                }),
            })

            expect(store.getState().session.events).toHaveLength(0)
            Remix.setData({ 'app.my.property': 88 })

            setTimeout(() => {
                expect(c).toEqual(1)
                Remix.setData({ 'app.my.property': 99 })

                setTimeout(() => {
                    expect(c).toEqual(2)
                    done()
                }, TIME_GUARANTEED_FOR_TRIGGERS_AND_DIFFS)
            }, TIME_GUARANTEED_FOR_TRIGGERS_AND_DIFFS)
        })

        it('2 triggers on the same property_updated', done => {
            Remix.clearTriggersAndEvents()

            var c1 = 0
            var c2 = 0

            expect(store.getState().session.events).toHaveLength(0)

            Remix.addTrigger({
                when: {
                    eventType: 'property_updated',
                    condition: { prop: 'path', clause: 'EQUALS', value: 'app.my.property' },
                },
                then: Remix.registerTriggerAction('custom1', evt => {
                    expect(evt.trigger.when.eventType).toEqual('property_updated')
                    c1++
                }),
            })

            Remix.addTrigger({
                when: {
                    eventType: 'property_updated',
                    condition: { prop: 'path', clause: 'EQUALS', value: 'app.my.property' },
                },
                then: Remix.registerTriggerAction('custom2', evt => {
                    expect(evt.trigger.when.eventType).toEqual('property_updated')
                    c2++
                }),
            })

            expect(store.getState().session.events).toHaveLength(0)

            // реально здесь сработает только 1 вызов, последний. Потому что setData асинхронно агрегируются в один вызов в только после вызывается
            Remix.setData({ 'app.my.property': 88 })
            Remix.setData({ 'app.my.property': 99 })
            Remix.setData({ 'app.my.property': 991 })
            Remix.setData({ 'app.my.property': 992 })
            Remix.setData({ 'app.my.property': 993 })
            Remix.setData({ 'app.my.property': 994 }) // только это значение установится по факту и сработают триггеры в этом тесте 1 раз

            setTimeout(() => {
                expect(c1).toEqual(1)
                expect(c2).toEqual(1)
                expect(store.getState().session.events).toHaveLength(1) // только 1 раз срабатывает триггер
                expect(Remix.getState().app.my.property).toEqual(994)
                done()
            }, TIME_GUARANTEED_FOR_TRIGGERS_AND_DIFFS)
        })

        it('property_updated trigger inside other trigger execution', done => {
            Remix.clearTriggersAndEvents()

            var c1 = 0
            var c2 = 0

            expect(store.getState().session.events).toHaveLength(0)

            Remix.addTrigger({
                when: {
                    eventType: 'property_updated',
                    condition: { prop: 'path', clause: 'EQUALS', value: 'app.my.property' },
                },
                then: Remix.registerTriggerAction('custom1', evt => {
                    expect(evt.trigger.when.eventType).toEqual('property_updated')
                    c1++
                    Remix.setData({ 'app.my.other.property': 234 }) // triggers custom2
                }),
            })

            Remix.addTrigger({
                when: {
                    eventType: 'property_updated',
                    condition: { prop: 'path', clause: 'EQUALS', value: 'app.my.other.property' },
                },
                then: Remix.registerTriggerAction('custom2', evt => {
                    expect(evt.trigger.when.eventType).toEqual('property_updated')
                    c2++
                }),
            })

            expect(store.getState().session.events).toHaveLength(0)

            Remix.setData({ 'app.my.property': 88 }) // triggers custom1

            setTimeout(() => {
                expect(store.getState().session.events).toHaveLength(2) // 2 fireEvent
                expect(c1).toEqual(1)
                expect(c2).toEqual(1)
                done()
            }, TIME_GUARANTEED_FOR_TRIGGERS_AND_DIFFS * 2)
        })

        it('MATCH clause', done => {
            Remix.clearTriggersAndEvents()

            let c1 = 0

            expect(store.getState().session.events).toHaveLength(0)

            Remix.addTrigger({
                when: {
                    eventType: 'property_updated',
                    condition: { prop: 'path', clause: 'MATCH', value: 'app.[screens HashList]./^[0-9a-z]+$/.name' },
                },
                then: Remix.registerTriggerAction('MATCH_TRIGGER', evt => {
                    expect(evt.trigger.when.condition.clause).toEqual('MATCH')
                    expect(evt.trigger.when.condition.value).toEqual('app.[screens HashList]./^[0-9a-z]+$/.name')
                    expect(evt.trigger.when.eventType).toEqual('property_updated')
                    c1++
                }),
            })

            expect(store.getState().session.events).toHaveLength(0)

            Remix.setData({ 'app.screens': new HashList() })
            Remix.addHashlistElement('app.screens', undefined, { newElement: { name: 'screen1name' } }) // MATCH_TRIGGER new value

            const scrId = Remix.getState().app.screens.getId(0)
            Remix.setData({ [`app.screens.${scrId}.tag`]: 'tagggggs' }) // no trigger
            Remix.setData({ [`app.screens.${scrId}.name`]: 'edited_name' }) // // MATCH_TRIGGER again

            setTimeout(() => {
                expect(store.getState().session.events).toHaveLength(1)
                expect(c1).toEqual(1)
                done()
            }, TIME_GUARANTEED_FOR_TRIGGERS_AND_DIFFS)
        })
    })
})
