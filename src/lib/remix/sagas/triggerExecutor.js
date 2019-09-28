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
    const state = yield select();
    const eventsToProcess = [];
    // get unprocessed events from the history
    for (let i = state.events.history.length - 1; i >= 0; i--) {
        const evt = state.events.history[i];
        if (processedEventIds[evt.id]) {
            break;
        }
        else {
            processedEventIds[evt.id] = 1;
            eventsToProcess.push(evt);
        }
    }
    const triggersArr = state.events.triggers.toArray()
    // reverse - process early events first of all
    eventsToProcess.reverse().forEach( (evt) => {
        const texec = getTriggersToExecute(triggersArr, evt);
        if (texec.length > 0) {
            executeTriggers(texec);
        }
    })
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

function conditionWorks(event, trigger) {
    const c = trigger.when.condition;
    if (c) {
        if (c.clause && c.clause.toLowerCase() === 'none') {
            return true;
        }
        if (event.eventData) {
            if (c.clause.toLowerCase() === 'contains') {
                return event.eventData[c.prop].toString().indexOf(c.value) >= 0;
            }
            else if (c.clause.toLowerCase() === 'equals') {
                return event.eventData[c.prop] === c.value;
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
 * Starts trigger execution when event happens
 *
 */
function* eventSaga() {
    yield takeLatest(REMIX_EVENT_FIRED, runTriggers);
}

export default eventSaga;