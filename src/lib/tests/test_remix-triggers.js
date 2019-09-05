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
            //     do: { CustomActions.calcResult }
            // });
            // for test purposes we are able to initiate any event intentionally

            Remix.fireEvent('dumb_event', {datazz: '123'});
            Remix.fireEvent('other_dumb_event', {variable: 987});
            chai.assert.equal(store.getState().events.history.length, 2);

            // Remix.addTrigger({
            //     when: {type: 'afterscreenshow'},
            //     do: {delay: 2000, type: 'sendData'}
            // });

        });
    })

    describe('#addTrigger', function() {
        it('add simple trigger', function(done) {
            Remix.addTrigger({
                when: {eventType: 'dumb_event'},
                do: () => {
                    // you can specify a function as action
                    chai.assert.equal(true, true, 'trigger activated');
                    done();
                }
            });

            Remix.fireEvent('dumb_event');
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