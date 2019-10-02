//import { select, put, takeLatest } from 'redux-saga/effects'
const { select, put, takeLatest } = ReduxSaga.effects;
import { REMIX_EVENT_FIRED, REMIX_MARK_AS_EXECUTED } from '../../remix.js'
import { getUniqueId } from '../util/util.js'

const executedTransactionIds = [];
const processedEventIds = {};

/**
 * Saga worker
 *
 * @param {Object} action
 */
function* runTriggers(action) {
    console.log('Saga triggers. start');
    const state = yield select();
    const eventsToProcess = [];
    // get unprocessed events from the history
    for (let i = state.session.events.length - 1; i >= 0; i--) {
        const evt = state.session.events[i];
        if (processedEventIds[evt.id]) {
            break;
        }
        else {
            processedEventIds[evt.id] = 1;
            eventsToProcess.push(evt);
        }
    }
    // reverse - process early events first of all
    eventsToProcess.reverse().forEach( (evt) => {
        const texec = getTriggersToExecute(state.session.triggers, evt);
        if (texec.length > 0) {
            executeTriggers(texec);
        }
    })
    console.log('/Saga triggers. end');
}

function executeTriggers(toExecute) {
    toExecute.forEach( (ex) => {
        if (executedTransactionIds[ex.transactionId]) {
            console.warn('Trigger already executed.');
        }
        else {
            executedTransactionIds[ex.transactionId] = ex;
            console.log('Execute', ex.t.then.actionType);
            if (typeof ex.t.then.actionType === 'string') {
                if (typeof Remix._triggerActions[ex.t.then.actionType] === 'function') {
                    Remix._triggerActions[ex.t.then.actionType]({
                        remix: Remix,
                        trigger: ex.t,
                        eventData: ex.e.eventData
                    });
                    // put({
                    //     type: REMIX_MARK_AS_EXECUTED,
                    //     transactionIds: [ex.transactionId]
                    // });
                }
                else {
                    throw new Error(`Unregistered action type ${ex.t.then}. Use registerTriggerAction() to register it`);
                }
            }
            else {
                throw new Error('\'then.actionType\' must be a string');
            }
        }
    });
}

/**
 * Checks triggers and runs them
 *
 * @return {array} array of activated triggers
 */
function getTriggersToExecute(triggers, event) {
    const toExec = [];
    // recent triggers have more priority
    for (let i = triggers.length-1; i >= 0; i--) {
        const t = triggers[i];
        if (event.order < t.order) {
            // event occured earlier then trigger was setup, skip it
            return;
        }
        if (event.eventType === t.when.eventType && !toExec.includes(t) && conditionWorks(event, t)) {
            // do not execute the same trigger twice
            toExec.push({t, e:event, transactionId: getUniqueId()});
        }
    }
    return toExec;
}

const validClauses = ['contains', 'equals'];

function conditionWorks(event, trigger) {
    const c = trigger.when.condition;
    if (c) {
        if (c.clause && c.clause.toLowerCase() === 'none') {
            return true;
        }
        if (event.eventData) {
            if (validClauses.includes(c.clause.toLowerCase())) {
                switch(event.eventType) {
                    case 'property_updated': {
                        return _conditionPropertyUpdated(event, c);
                    }
                    default: {
                        // default checking for all actions
                        return _condition(event, c);
                    }
                }
            }
            else {
                throw new Error(`${c.clause} clause not supported`);
            }
        }
        return false
    }
    return true;
}

/**
 * Common condition trigger/event checking
 *
 * @param {*} event
 * @param {*} triggerCondition
 */
function _condition(event, triggerCondition) {
    if (triggerCondition.clause.toLowerCase() === 'contains') {
        return event.eventData[triggerCondition.prop].toString().indexOf(triggerCondition.value) >= 0;
    }
    else if (triggerCondition.clause.toLowerCase() === 'equals') {
        return event.eventData[triggerCondition.prop] === triggerCondition.value;
    }
    return false;
}

/**
 * Custom condtiditon checking for specific event
 *
 * @param {*} event
 * @param {*} triggerCondition
 */
function _conditionPropertyUpdated(event, triggerCondition) {
    if (triggerCondition.clause.toLowerCase() === 'equals') {
        //TODO diff.deleted - can not be deleted
        return !!event.eventData.diff.changed.find( (p) => p.path == triggerCondition.value) || !!event.eventData.diff.added.find( (p) => p.path == triggerCondition.value);
    }
    return false;
}

/**
 * Starts trigger execution when event happens
 *
 */
function* eventSaga() {
    yield takeLatest(REMIX_EVENT_FIRED, runTriggers);
}

export default eventSaga;