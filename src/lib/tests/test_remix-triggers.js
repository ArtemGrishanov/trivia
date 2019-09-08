import Remix, {remixReducer} from '../remix.js';
import DataSchema from '../schema.js';

const reducer = remixReducer({
    reducers: {},
    dataSchema: new DataSchema({})
});
const store = Redux.createStore(reducer);
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
                execute: (t) => {
                    chai.assert.equal(t.when.eventType === 'dumb_event52', true, 'trigger activated');
                    v++;
                }
            });

            Remix.fireEvent('dumb_event32'); // execute nothing

            Remix.addTrigger({
                when: {eventType: 'dumb_event32'},
                execute: (t) => {
                    // you can specify a function as action
                    chai.assert.equal(t.when.eventType === 'dumb_event32', true, 'trigger activated');
                    c++;
                }
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
            }, 100)

            //TODO triggers out in state also?
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