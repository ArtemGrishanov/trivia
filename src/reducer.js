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
    },
    style: {

    },
    session: {
        questionIds: [],
        currentQuestionIndex: 0,
        answers: {
            // <questionId>: <points>,
            // "werq123": 1,
            // ""
            // calc current step
            // calc result in the end
        },
        result: null // result: <resultId>
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
        //TODO ON add new questions...

        //TODO ON delete questions...

        case actions.SET_CORRECT_OPTION: {
            // action.questionIndex, action.optionIndex
            const qid = state.questions.getId(action.questionIndex);
            const options = state.questions[qid].options;
            options.toArray().forEach( (o, i) => {
                // only one option is correct
                o.points = (i === action.optionIndex) ? 1: 0;
            });
            return {
                ...state
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

function session(state = initialState.session, action) {
    switch(action.type) {
        case actions.INIT: {
            // подготовить вопросы, перемешать вопросы например
            return {
                ...state,
                answers: {},
                currentQuestionIndex: 0,
                questionIds: action.questions.toArray().map((q, i) => {
                    //return {...q, id: action.questions.getId(i)}
                    return action.questions.getId(i);
                    //TODO shuffle option
                }),
                result: null
            }
        }
        case actions.ANSWER: {
            // action.optionId
            const points = getOption(action.questions, action.optionId).points;
            const questionId = getQuestionIdByOption(action.questions, action.optionId);
            const answers = {
                ...state.answers,
                [questionId]: points
            };
            let resultId = null;
            if (Object.keys(answers).length === state.questionIds.length) {
                // ответили на все вопросы, можно подсчитать результат
                resultId = calcResult(action.questions, action.results, Object.values(answers).reduce((a,b) => a+b) );
            }
            return {
                ...state,
                answers: answers,
                result: resultId,
                currentQuestionIndex: state.currentQuestionIndex + 1
            }
        }
        default:
            return state;
    }
}

const reducer = remixReducer(combineReducers({app, quiz, style, session}), schema);

export default reducer