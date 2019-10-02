import DataSchema from '../../schema.js'
import HashList from '../../hashlist.js'

/**
 * Schema describes event/trigger attributes
 *
 */
const schema = new DataSchema({
    // "events.[triggers HashList]": {
    //     type: 'hashlist',
    //     default: new HashList()
    // },
    // "events.[triggers HashList]./^[0-9a-z]+$/.when.eventType": {
    //     type: 'string',
    //     default: ''
    // },
    // "events.[triggers HashList]./^[0-9a-z]+$/.when.condition.prop": {
    //     type: 'string',
    //     default: ''
    // },
    // "events.[triggers HashList]./^[0-9a-z]+$/.when.condition.clause": {
    //     type: 'string',
    //     enum: ['NONE', 'CONTAINS', 'EQUALS'],
    //     default: 'NONE'
    // },
    // "events.[triggers HashList]./^[0-9a-z]+$/.when.condition.value": {
    //     type: 'string',
    //     default: ''
    // },
    // "events.[triggers HashList]./^[0-9a-z]+$/.then.actionType": {
    //     type: 'string',
    //     default: ''
    // },
    // "events.[triggers HashList]./^[0-9a-z]+$/.then.data": {
    //     type: 'string',
    //     default: ''
    // }
});

export default schema;