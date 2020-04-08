import Remix, { remixReducer } from '../remix.js'
import eventSaga from '../remix/sagas/triggerExecutor.js'
import diffMiddleware from '../remix/middleware/diff.js'
import schema from '../remix/schemas/events.js'
import DataSchema from '../schema.js'
import HashList from '../hashlist.js'

var testSchema = new DataSchema({
  'app.my.property': {
    type: 'number',
    default: 9,
    min: 0,
    max: 9999,
  },
  'app.my.other.property': {
    type: 'number',
    default: 100,
    min: 0,
    max: 9999,
  },
  'app.screens': {
    type: 'hashlist',
    default: new HashList(),
  },
  'app.[screens HashList]./^[0-9a-z]+$/.name': {
    type: 'string',
    default: '',
  },
  'app.[screens HashList]./^[0-9a-z]+$/.tag': {
    type: 'string',
    default: '-',
  },
})
testSchema.extend(schema)

const sagaMiddleware = ReduxSaga.default()
const reducer = remixReducer({
  reducers: {},
  dataSchema: testSchema,
})
const store = Redux.createStore(reducer, Redux.applyMiddleware(sagaMiddleware, diffMiddleware))
sagaMiddleware.run(eventSaga)
window.store = store // for debug: inspect storage state in browser console
Remix.setStore(store)

describe('Remix', function () {
  describe('#fireEvents', function () {
    it('fire 2 events', function () {
      Remix.clearTriggersAndEvents()

      Remix.fireEvent('dumb_event', { datazz: '123' })
      Remix.fireEvent('other_dumb_event', { variable: 987 })
      chai.assert.equal(store.getState().session.events.length, 2)

      Remix.clearTriggersAndEvents()
      chai.assert.equal(store.getState().session.events.length, 0)
    })
  })

  describe('#addTrigger', function () {
    Remix.clearTriggersAndEvents()

    it('add simple trigger', function (done) {
      let c = 0
      let v = 0

      Remix.addTrigger({
        when: { eventType: 'dumb_event52' },
        then: Remix.registerTriggerAction('custom_action_0', evt => {
          chai.assert.equal(evt.trigger.when.eventType === 'dumb_event52', true, 'trigger 52 activated')
          v++
        }),
      })

      Remix.fireEvent('dumb_event32') // execute nothing

      Remix.addTrigger({
        when: { eventType: 'dumb_event32' },
        then: Remix.registerTriggerAction('custom_action_1', evt => {
          chai.assert.equal(evt.trigger.when.eventType === 'dumb_event32', true, 'trigger 32 activated')
          c++
        }),
      })

      Remix.fireEvent('dumb_event32') // 1 c activation
      Remix.fireEvent('dumb_event32') // 2 c activation

      Remix.fireEvent('dumb_event52') // 1 v act

      setTimeout(() => Remix.fireEvent('dumb_event32'), 30) // 3 c activation

      setTimeout(() => {
        if (c === 3 && v === 1) {
          const dumbEventsCount = store
            .getState()
            .session.events.filter(evt => evt.eventType.indexOf('dumb_event') >= 0).length
          chai.assert.equal(dumbEventsCount, 5)
          done()
        }
      }, 80)
    })

    it('trigger with condition CONTAINS', function (done) {
      Remix.clearTriggersAndEvents()

      let c = 0

      Remix.addTrigger({
        when: { eventType: 'on_condition', condition: { prop: 'tags', clause: 'CONTAINS', value: 'option' } },
        then: Remix.registerTriggerAction('custommm', evt => {
          chai.assert.equal(evt.trigger.when.eventType === 'on_condition', true, 'trigger activated')
          c++
        }),
      })

      Remix.fireEvent('on_condition')
      Remix.fireEvent('on_condition', { tags: 'tag1 option tag2' }) // this will work
      Remix.fireEvent('on_condition', { tags: 'tag3' })
      Remix.fireEvent('on_condition9', { tags: 'tag1 option tag2' })

      setTimeout(() => {
        if (c === 1) {
          const condEventsCount = store.getState().session.events.filter(evt => evt.eventType.indexOf('on_cond') >= 0)
            .length
          chai.assert.equal(condEventsCount, 4)
          done()
        }
      }, 80)
    })
  })

  describe('#changeProperty trigger', function () {
    it('property_updated simple trigger', function () {
      Remix.clearTriggersAndEvents()

      var c = 0

      chai.assert.equal(store.getState().session.events.length, 0)

      Remix.addTrigger({
        when: {
          eventType: 'property_updated',
          condition: { prop: 'path', clause: 'EQUALS', value: 'app.my.property' },
        },
        then: Remix.registerTriggerAction('custom', evt => {
          chai.assert.equal(evt.trigger.when.eventType === 'property_updated', true, 'trigger activated')
          c++
        }),
      })

      chai.assert.equal(store.getState().session.events.length, 0)

      Remix.setData({ 'app.my.property': 88 })
      chai.assert.equal(c, 1)

      Remix.setData({ 'app.my.property': 99 })
      chai.assert.equal(c, 2)
    })

    it('2 triggers on the same property_updated', function () {
      Remix.clearTriggersAndEvents()

      var c1 = 0
      var c2 = 0

      chai.assert.equal(store.getState().session.events.length, 0)

      Remix.addTrigger({
        when: {
          eventType: 'property_updated',
          condition: { prop: 'path', clause: 'EQUALS', value: 'app.my.property' },
        },
        then: Remix.registerTriggerAction('custom1', evt => {
          chai.assert.equal(evt.trigger.when.eventType === 'property_updated', true, 'trigger activated')
          c1++
        }),
      })

      Remix.addTrigger({
        when: {
          eventType: 'property_updated',
          condition: { prop: 'path', clause: 'EQUALS', value: 'app.my.property' },
        },
        then: Remix.registerTriggerAction('custom2', evt => {
          chai.assert.equal(evt.trigger.when.eventType === 'property_updated', true, 'trigger activated')
          c2++
        }),
      })

      chai.assert.equal(store.getState().session.events.length, 0)

      Remix.setData({ 'app.my.property': 88 }) // triggers custom1
      Remix.setData({ 'app.my.property': 99 }) // triggers custom2

      chai.assert.equal(c1, 2)
      chai.assert.equal(c2, 2)
    })

    it('property_updated trigger inside other trigger execution', function () {
      Remix.clearTriggersAndEvents()

      var c1 = 0
      var c2 = 0

      chai.assert.equal(store.getState().session.events.length, 0)

      Remix.addTrigger({
        when: {
          eventType: 'property_updated',
          condition: { prop: 'path', clause: 'EQUALS', value: 'app.my.property' },
        },
        then: Remix.registerTriggerAction('custom1', evt => {
          chai.assert.equal(evt.trigger.when.eventType === 'property_updated', true, 'trigger activated')
          c1++
          Remix.setData({ 'app.my.other.property': 234 }) // triggers custom2
        }),
      })

      Remix.addTrigger({
        when: {
          eventType: 'property_updated',
          condition: { prop: 'path', clause: 'EQUALS', value: 'app.my.other.property' },
        },
        then: Remix.registerTriggerAction('custom2', evt => {
          chai.assert.equal(evt.trigger.when.eventType === 'property_updated', true, 'trigger activated')
          c2++
        }),
      })

      chai.assert.equal(store.getState().session.events.length, 0)

      Remix.setData({ 'app.my.property': 88 }) // triggers custom1

      chai.assert.equal(store.getState().session.events.length, 2) // 2 fireEvent
      chai.assert.equal(c1, 1)
      chai.assert.equal(c2, 1)
    })

    it('MATCH clause', function () {
      Remix.clearTriggersAndEvents()

      let c1 = 0

      chai.assert.equal(store.getState().session.events.length, 0)

      Remix.addTrigger({
        when: {
          eventType: 'property_updated',
          condition: { prop: 'path', clause: 'MATCH', value: 'app.[screens HashList]./^[0-9a-z]+$/.name' },
        },
        then: Remix.registerTriggerAction('MATCH_TRIGGER', evt => {
          chai.assert.equal(evt.trigger.when.condition.clause === 'MATCH', true, 'trigger activated')
          chai.assert.equal(
            evt.trigger.when.condition.value === 'app.[screens HashList]./^[0-9a-z]+$/.name',
            true,
            'trigger activated',
          )
          chai.assert.equal(evt.trigger.when.eventType === 'property_updated', true, 'trigger activated')
          c1++
        }),
      })

      chai.assert.equal(store.getState().session.events.length, 0)

      Remix.setData({ 'app.screens': new HashList() })
      Remix.addHashlistElement('app.screens', undefined, { newElement: { name: 'screen1name' } }) // MATCH_TRIGGER new value

      const scrId = Remix.getState().app.screens.getId(0)
      Remix.setData({ [`app.screens.${scrId}.tag`]: 'tagggggs' }) // no trigger
      Remix.setData({ [`app.screens.${scrId}.name`]: 'edited_name' }) // // MATCH_TRIGGER again

      chai.assert.equal(c1, 2, 'Trigger executed two times')
    })
  })
})
