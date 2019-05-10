const actions = {
    ANSWER: 'ANSWER',
    INIT: 'INIT',
    SET_CORRECT_OPTION: 'SET_CORRECT_OPTION' // we may use this action externally to set correct option in question
};
export default actions;

export function answer(optionId) {
    return {
        type: actions.ANSWER,
        optionId: optionId
    }
}

export function init() {
    return {
        type: actions.INIT
    }
}