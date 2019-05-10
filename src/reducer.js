import { combineReducers } from 'redux'
import { remixReducer } from './lib/remix'
import schema from './appStoreDataSchema'
import actions from './actions'
import { getOption, getQuestionIdByOption, calcResult } from './helper'

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
    quiz: {
        // questions: Hashlist,
        // results: Hashlist,
        answers: {
            // <questionId>: <points>,
            // "werq123": 1,
            // ""
            // calc current step
            // calc result in the end
        },
        result: null // result: <resultId>
    },
    style: {

    }
}

function app(state = initialState.app, action) {
    switch(action.type) {
        default:
            return state;
    }
}

function quiz(state = initialState.quiz, action) {
    switch(action.type) {
        // ON add new questions...
        // ON delete questions...
        case actions.ANSWER: {
            // action.optionId
            const points = getOption(state.questions, action.optionId).points;
            const questionId = getQuestionIdByOption(state.questions, action.optionId);
            const answers = {
                ...state.answers,
                [questionId]: points
            };
            let resultId = null;
            if (Object.keys(answers).length === state.results.toArray().length) {
                // ответили на все вопросы, можно подсчитать результат
                resultId = calcResult(state.questions, state.results, Object.values(answers).reduce((a,b) => a+b) );
            }
            return {
                ...state,
                answers: answers,
                result: resultId
            }
        }
        case actions.INIT: {
            return {
                ...state,
                answers: {},
                result: null
            }
        }
        default: {
            console.log('>>>>> Client reducer code for action: ' + action.type);
            return state;
        }
    }
}

function style(state = initialState.style, action) {
    switch(action.type) {
        default:
            return state;
    }
}

// function user(state = initialState.user, action) {
//     switch(action.type) {
        
//         default: {
//             return state;
//         }
//     }
// }

const reducer = remixReducer(combineReducers({app, quiz, style}), schema);

export default reducer