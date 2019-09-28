import Remix, {remixReducer} from '../remix.js';
import DataSchema from '../schema.js';
import eventSaga from '../remix/sagas/triggerExecutor.js'

const sagaMiddleware = ReduxSaga.default();
const reducer = remixReducer({
    reducers: {},
    dataSchema: new DataSchema({})
});
const store = Redux.createStore(reducer, Redux.applyMiddleware(sagaMiddleware));
sagaMiddleware.run(eventSaga);
window.store = store; // for debug: inspect storage state in browser console

Remix.init({
    appStore: store,
    container: document.getElementById('root')
});

describe('Remix', function() {

    describe('#fireEvents', function() {
        it('fire 2 events', function() {

            // //TODO bind data to trigger on option click
            // Remix.addTrigger({
            //     when: {type: 'beforescreenshow'},
            //     execute: { CustomActions.calcResult }
            // });
            // for test purposes we are able to initiate any event intentionally

            Remix.fireEvent('dumb_event', {datazz: '123'});
            Remix.fireEvent('other_dumb_event', {variable: 987});
            chai.assert.equal(store.getState().events.history.length, 2);

            Remix.clearEventsHistory()
            chai.assert.equal(store.getState().events.history.length, 0);
            // Remix.addTrigger({
            //     when: {type: 'afterscreenshow'},
            //     execute: {delay: 2000, type: 'sendData'}
            // });

        });
    })

    describe('#addTrigger', function() {
        Remix.clearEventsHistory();

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
                    chai.assert.equal(store.getState().events.history.length, 5);
                    done();
                }
            }, 80)
        });

        it('trigger with condition CONTAINS', function(done) {
            Remix.clearEventsHistory();

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
                    chai.assert.equal(store.getState().events.history.length, 4);
                    done();
                }
            }, 80)

        });
    })

    // describe('#macro', function() {

    //     it('macro', function() {
    //         // question randomization before launch ?
    //     });

    //     it('macro', function() {
    //         // default linear routing

    //         when start click
    //         execute
    //         var questionScreens = screens.get('question');
    //         for each screen
    //             add next trigger
    //                 i = i + 1
    //     });

    // })
});

var CustomAction = {};
CustomAction['calcResult'] = () => {
    const optionSelects = trigger.history.get({byTag: 'option'});
    //TODO get data from each click??
}