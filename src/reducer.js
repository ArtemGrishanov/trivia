import { combineReducers } from 'redux'
import { remixReducer } from './lib/remix'
import schema from './appStoreDataSchema'
import HashList from './lib/hashlist'

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
        // questions: {

        // }
    },
    style: {}
}

function app(state = initialState.app, action) {
    switch(action.type) {
        default:
            return state;
    }
}

function quiz(state = initialState.quiz, action) {
    switch(action.type) {
        // add new questions...

        // delete questions...

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

const reducer = remixReducer(combineReducers({app, quiz, style}), schema);

export default reducer

// const initialState = {
//     quiz: {
//         questions: [
//             {
//                 options: [
//                     {text: 'Option1', points: 1},
//                     {text: 'Option2', points: 0}
//                 ]
//             }
//         ],
//         randomizeQuestions: false
//     }
// };

// function quiz(action) {
//     switch (action.event) {
//         case "SET_CORRECT_OPTION": {
//             // этот экшн разрешен в DataSchema проекта
//             // action.optionId - передается ид опции, которая считается верным ответом

//             break;
//         }
//         case "DELETE_OPTION": {
//             // action.optionId - передается ид опции, которую необходимо удалить из вопроса

//             //TODO при удалении ответа, если он был корректным, надо сделать верным другой ближайший ответ
            
//             //TODO обратно должно инициироваться обновление стейта наружу
//             break
//         }
//     }
// }