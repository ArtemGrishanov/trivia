import { combineReducers } from 'redux'
import { remixReducer } from './lib/remix'
import schema from './appStoreDataSchema'
import actions from './actions'
import { getOption, getQuestionIdByOption, calcResult } from './helper'
import Trigger from './trigger'

const initialState = {
    // app specific data tree
    // can be different on projects
    // main: {
    //     slides: new HashList([1])
    // },
    app: {
        // size: {
        //     // width: undefined,
        //     // height: undefined
        // }
    },
    // quiz: {
    //     // questions: Hashlist,
    //     // results: Hashlist,
    // },
    // style: {

    // },
    // screens: {
    //     /*
    //     'questionScreen_1': {
    //         'staticElements': [ ], // components wich were added by user
    //         'layout': 'string with layout',
    //         'triggers': [ ]
    //     }
    //     */

    //     /**
    //      * before_screen_show, calcRes
    //      */
    // },
    // triggers: {
    //     history: []
    // },
    // session: {
    //     startClientTime: new Date().getTime(),
    //     questionIds: [],
    //     currentQuestionIndex: 0,
    //     answers: {
    //         // <questionId>: <points>,
    //         // "werq123": 1,
    //         // ""
    //         // calc current step
    //         // calc result in the end
    //     },
    //     result: null // result: <resultId>
    // }
}

// function app(state = initialState.app, action) {
//     switch(action.type) {
//         default:
//             return state;
//     }
// }

// function quiz(state = initialState.quiz, action) {
//     switch(action.type) {
//         //TODO ON add new questions...

//         //TODO ON delete questions...

//         case actions.SET_CORRECT_OPTION: {
//             // action.questionIndex, action.optionIndex
//             const qid = state.questions.getId(action.questionIndex);
//             const options = state.questions[qid].options;
//             options.toArray().forEach( (o, i) => {
//                 // only one option is correct
//                 o.points = (i === action.optionIndex) ? 1: 0;
//             });
//             return {
//                 ...state
//             }
//         }
//         default: {
//             console.log('>>>>> Client reducer code for action: ' + action.type);
//             return state;
//         }
//     }
// }

// function style(state = initialState.style, action) {
//     switch(action.type) {
//         default:
//             return state;
//     }
// }

//test
//store.dispatch({type: 'EVENT', eventType: 'quiz_option_select'})
//TODO move reducer to remix core
// function triggers(state = initialState.triggers, action) {
//     switch(action.type) {
//         case actions.EVENT: {
//             let activatedTrigger = null;

//             //TODO find trigger in screen triggers list
//             //TODO check conditions. Conditions - autotests?
//             if (action.eventType === 'quiz_option_select') {
//                 // trigger found, activate it
//                 activatedTrigger = new Trigger({eventType: action.eventType});
//             }

//             if (activatedTrigger) {
//                 console.log(`Trigger with event type ${activatedTrigger.eventType} activated`);
//                 // put trigger in history
//                 state.history.push({
//                     activatedTrigger,
//                     clientTime: new Date().getTime()
//                 });
//             }

//             //TODO detect 'result' stage
//             // like
//             // if (Object.keys(answers).length === state.questionIds.length) { }
//             //
//             // но в схеме с ветвлением не обязательно прохождение всех вопросов
//             // next trigger with screenId argument?
//             // calcResult action? when?

//             return {
//                 ...state
//             }
//         }
//         default:
//             return state;
//     }
// }

// function session(state = initialState.session, action) {
//     switch(action.type) {
//         case actions.INIT: {
//             // подготовить вопросы, перемешать вопросы например
//             return {
//                 ...state,
//                 answers: {},
//                 currentQuestionIndex: 0,
//                 questionIds: action.questions.toArray().map((q, i) => {
//                     //return {...q, id: action.questions.getId(i)}
//                     return action.questions.getId(i);
//                     //TODO shuffle option
//                 }),
//                 result: null
//             }
//         }
//         case actions.ANSWER: {
//             // action.optionId
//             const points = getOption(action.questions, action.optionId).points;
//             const questionId = getQuestionIdByOption(action.questions, action.optionId);
//             const answers = {
//                 ...state.answers,
//                 [questionId]: points
//             };
//             let resultId = null;
//             if (Object.keys(answers).length === state.questionIds.length) {
//                 // ответили на все вопросы, можно подсчитать результат
//                 resultId = calcResult(action.questions, action.results, Object.values(answers).reduce((a,b) => a+b) );
//             }
//             return {
//                 ...state,
//                 answers: answers,
//                 result: resultId,
//                 currentQuestionIndex: state.currentQuestionIndex + 1
//             }
//         }
//         default:
//             return state;
//     }
// }

const reducer = remixReducer({
    // some client reducers
    reducers: {/*app, quiz, style, session, triggers*/},
    dataSchema: schema
});

export default reducer