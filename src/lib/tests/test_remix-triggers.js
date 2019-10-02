import Remix, {remixReducer} from '../remix.js';
import eventSaga from '../remix/sagas/triggerExecutor.js'
import diffMiddleware from '../remix/middleware/diff.js'
import schema from '../remix/schemas/events.js'
import DataSchema from '../schema.js';
//TODO define remix common schema not trivia specific

var testSchema = new DataSchema({
    'app.my.property': {
        type: 'number',
        default: 9,
        min: 0,
        max: 9999
    },
    'app.my.other.property': {
        type: 'number',
        default: 100,
        min: 0,
        max: 9999
    },
})
testSchema.extend(schema);

const sagaMiddleware = ReduxSaga.default();
const reducer = remixReducer({
    reducers: {},
    dataSchema: testSchema
});
const store = Redux.createStore(
    reducer,
    Redux.applyMiddleware(
        sagaMiddleware,
        diffMiddleware
    )
);
sagaMiddleware.run(eventSaga);
window.store = store; // for debug: inspect storage state in browser console

Remix.init({
    appStore: store,
    container: document.getElementById('root')
});

describe('Remix', function() {

    describe('#fireEvents', function() {

        it('fire 2 events', function() {
            Remix.clearTriggersAndEvents()

            Remix.fireEvent('dumb_event', {datazz: '123'});
            Remix.fireEvent('other_dumb_event', {variable: 987});
            chai.assert.equal(store.getState().events.history.length, 2);

            Remix.clearTriggersAndEvents()
            chai.assert.equal(store.getState().events.history.length, 0);
        });
    })

    describe('#addTrigger', function() {
        Remix.clearTriggersAndEvents();

        it('add simple trigger', function(done) {
            let c = 0;
            let v = 0;

            Remix.addTrigger({
                when: {eventType: 'dumb_event52'},
                then: Remix.registerTriggerAction('custom_action_0', (evt) => {
                    chai.assert.equal(evt.trigger.when.eventType === 'dumb_event52', true, 'trigger 52 activated');
                    v++;
                })
            });

            Remix.fireEvent('dumb_event32'); // execute nothing

            Remix.addTrigger({
                when: {eventType: 'dumb_event32'},
                then: Remix.registerTriggerAction('custom_action_1', (evt) => {
                    chai.assert.equal(evt.trigger.when.eventType === 'dumb_event32', true, 'trigger 32 activated');
                    c++;
                })
            });

            Remix.fireEvent('dumb_event32'); // 1 c activation
            Remix.fireEvent('dumb_event32'); // 2 c activation

            Remix.fireEvent('dumb_event52'); // 1 v act

            setTimeout( () => Remix.fireEvent('dumb_event32'), 30) // 3 c activation

            setTimeout( () => {
                if (c === 3 && v === 1) {
                    const dumbEventsCount = store.getState().events.history.filter( (evt) => evt.eventType.indexOf('dumb_event') >= 0 ).length;
                    chai.assert.equal(dumbEventsCount, 5);
                    done();
                }
            }, 80)
        });


        it('trigger with condition CONTAINS', function(done) {
            Remix.clearTriggersAndEvents();

            let c = 0;

            Remix.addTrigger({
                when: {eventType: 'on_condition', condition: { prop: 'tags', clause: 'CONTAINS', value: 'option' }},
                then: Remix.registerTriggerAction('custommm', (evt) => {
                    chai.assert.equal(evt.trigger.when.eventType === 'on_condition', true, 'trigger activated');
                    c++;
                })
            });

            Remix.fireEvent('on_condition');
            Remix.fireEvent('on_condition', { tags: 'tag1 option tag2' } ); // this will work
            Remix.fireEvent('on_condition', { tags: 'tag3'});
            Remix.fireEvent('on_condition9', { tags: 'tag1 option tag2' } );

            setTimeout( () => {
                if (c === 1) {
                    const condEventsCount = store.getState().events.history.filter( (evt) => evt.eventType.indexOf('on_cond') >= 0 ).length;
                    chai.assert.equal(condEventsCount, 4);
                    done();
                }
            }, 80)

        });
    })


    describe('#changeProperty trigger', function() {

        it('property_updated simple trigger', function() {
            Remix.clearTriggersAndEvents();

            var c = 0;

            chai.assert.equal(store.getState().events.history.length, 0);

            Remix.addTrigger({
                when: { eventType: 'property_updated', condition: {prop: 'path', clause: 'EQUALS', value: 'app.my.property'} },
                then: Remix.registerTriggerAction('custom', (evt) => {
                    chai.assert.equal(evt.trigger.when.eventType === 'property_updated', true, 'trigger activated');
                    c++;
                })
            });

            chai.assert.equal(store.getState().events.history.length, 1);

            Remix.setData({'app.my.property': 88});
            chai.assert.equal(c, 1);

            Remix.setData({'app.my.property': 99});
            chai.assert.equal(c, 2);
        });


        it('2 triggers on the same property_updated', function() {
            Remix.clearTriggersAndEvents();

            var c1 = 0;
            var c2 = 0;

            chai.assert.equal(store.getState().events.history.length, 0);

            Remix.addTrigger({
                when: { eventType: 'property_updated', condition: {prop: 'path', clause: 'EQUALS', value: 'app.my.property'} },
                then: Remix.registerTriggerAction('custom1', (evt) => {
                    chai.assert.equal(evt.trigger.when.eventType === 'property_updated', true, 'trigger activated');
                    c1++;
                })
            });

            Remix.addTrigger({
                when: { eventType: 'property_updated', condition: {prop: 'path', clause: 'EQUALS', value: 'app.my.property'} },
                then: Remix.registerTriggerAction('custom2', (evt) => {
                    chai.assert.equal(evt.trigger.when.eventType === 'property_updated', true, 'trigger activated');
                    c2++;
                })
            });

            chai.assert.equal(store.getState().events.history.length, 2);

            Remix.setData({'app.my.property': 88}); // triggers custom1
            Remix.setData({'app.my.property': 99}); // triggers custom2

            chai.assert.equal(c1, 2);
            chai.assert.equal(c2, 2);
        });


        it('property_updated trigger inside other trigger execution', function() {
            Remix.clearTriggersAndEvents();

            var c1 = 0;
            var c2 = 0;

            chai.assert.equal(store.getState().events.history.length, 0);

            Remix.addTrigger({
                when: { eventType: 'property_updated', condition: {prop: 'path', clause: 'EQUALS', value: 'app.my.property'} },
                then: Remix.registerTriggerAction('custom1', (evt) => {
                    chai.assert.equal(evt.trigger.when.eventType === 'property_updated', true, 'trigger activated');
                    c1++;
                    Remix.setData({'app.my.other.property': 234}); // triggers custom2
                })
            });

            Remix.addTrigger({
                when: { eventType: 'property_updated', condition: {prop: 'path', clause: 'EQUALS', value: 'app.my.other.property'} },
                then: Remix.registerTriggerAction('custom2', (evt) => {
                    chai.assert.equal(evt.trigger.when.eventType === 'property_updated', true, 'trigger activated');
                    c2++;
                })
            });

            chai.assert.equal(store.getState().events.history.length, 2);

            Remix.setData({'app.my.property': 88}); // triggers custom1

            chai.assert.equal(store.getState().events.history.length, 4); // 2 addTrigger + 2 fireEvent
            chai.assert.equal(c1, 1);
            chai.assert.equal(c2, 1);
        });

        it('property_updated diff.add', function() {
            Remix.clearTriggersAndEvents();

            //tests with diff.add

            //невозможно подписаться не создание так как оно происходит сразу же до всего??
            //может и не надо этого

            //и удаление не надо делать
        });

    });

});