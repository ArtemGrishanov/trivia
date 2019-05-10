const actions = {
    ANSWER: 'ANSWER',
    INIT: 'INIT'
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