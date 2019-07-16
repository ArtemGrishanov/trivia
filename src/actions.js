export const actions = {
    ANSWER: 'ANSWER',
    INIT: 'INIT',
    SET_CORRECT_OPTION: 'SET_CORRECT_OPTION' // we may use this action externally to set correct option in question
};
export default actions;

export function answer(optionId, questionHashlist, resultHashlist) {
    return {
        type: actions.ANSWER,
        optionId: optionId,
        questions: questionHashlist,
        results: resultHashlist
    }
}

export function init(questionHashlist) {
    return {
        type: actions.INIT,
        questions: questionHashlist   
    }
}