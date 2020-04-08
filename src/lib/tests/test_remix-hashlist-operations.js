//import { createStore } from 'redux' //script src in index
import { Selector } from '../object-path.js'
import Remix, { remixReducer } from '../remix.js'
import HashList from '../hashlist.js'
import DataSchema from '../schema.js'

describe('Remix', function () {
  const schema = new DataSchema({
    'quiz.[questions HashList]./^[0-9a-z]+$/.text': {
      //createIfNotExist: false,
      type: 'string',
      default: 'Input your question',
    },
    'quiz.[questions HashList]': {
      type: 'hashlist',
      default: new HashList([{ text: 'Input your question 1' }, { text: 'Input your question 2' }]),
      minLength: 1,
      maxLength: 20,
      // arrays elements to add by clonning
      prototypes: [
        { id: 'text_slide', data: { type: 'text_slide', text: 'New question title' } },
        {
          id: 'text_img_slide',
          data: {
            type: 'text_img_slide',
            text: 'Input your question here',
            img: 'https://p.testix.me/images/stub.jpg',
          },
        },
      ],
    },
    'quiz.[questions HashList]./^[0-9a-z]+$/.options': {
      type: 'hashlist',
      default: new HashList([{ text: 'Option 1' }, { text: 'Option 2' }]),
      minLength: 1,
      maxLength: 9,
      prototypes: [{ id: 'text_option', data: { type: 'text_option', text: 'New option' } }],
    },
    'quiz.[questions HashList]./^[0-9a-z]+$/.options./^[0-9a-z]+$/.text': {
      type: 'string',
      default: 'Option text',
      minLength: 1,
      maxLength: 256,
    },
    emptyList: {
      type: 'hashlist',
      default: new HashList(),
      minLength: 1,
      maxLength: 9,
      prototypes: [{ id: 'foo', data: { type: 'bar', text: 'Text bazz' } }],
    },
  })

  const initialState = {
    quiz: {},
  }

  function quiz(state = initialState.quiz, action) {
    switch (action.type) {
      default:
        return state
    }
  }

  const reducer = remixReducer({
    reducers: { quiz },
    dataSchema: schema,
  })
  const store = Redux.createStore(reducer)
  window.store = store // for debug: inspect storage state in browser console

  Remix.init({
    appStore: store,
    container: document.getElementById('root'),
  })

  function hasDuplicates(array) {
    return new Set(array).size !== array.length
  }

  /**
   * Универсальная проверка стейта
   */
  function checkState({ state = undefined, questionsCount = 2, optionsCount = [2, 2] }) {
    const optionsSumCount = optionsCount.reduce((x, y) => x + y)
    const qhl = state.quiz.questions
    const qarr = qhl.toArray()
    chai.assert.equal(qarr.length, questionsCount)

    // no duplicaties in question haslist, check ids
    const qIds = qarr.map((q, i) => qhl.getId(i))
    chai.assert.equal(hasDuplicates(qIds), false)

    // no duplicaties in question haslist, check values, object instances
    const qValues = qarr.map((q, i) => qhl[qhl.getId(i)])
    chai.assert.equal(hasDuplicates(qValues), false)

    // no duplicaties in options, check instances
    const qOptionsValues = qarr.map((q, i) => qhl[qhl.getId(i)].options)
    chai.assert.equal(hasDuplicates(qOptionsValues), false)
    chai.assert.equal(qOptionsValues.length, questionsCount)

    let allOptionIds = []
    let allOptionInstances = []
    qarr.forEach((q, i) => {
      const opts = qarr[i].options.toArray()
      chai.assert.equal(opts.length, optionsCount[i])
      allOptionIds = allOptionIds.concat(opts.map((o, j) => qarr[i].options.getId(j)))
      allOptionInstances = allOptionInstances.concat(opts)
    })
    // check all option ids are unique
    chai.assert.equal(hasDuplicates(allOptionIds), false)
    chai.assert.equal(allOptionIds.length, optionsSumCount)
    // check all option instances are unique
    chai.assert.equal(hasDuplicates(allOptionInstances), false)
    chai.assert.equal(allOptionInstances.length, optionsSumCount)
  }

  function checkQuestionTitle(state, questionIndex, expectedTitle) {
    const q = store.getState().quiz.questions
    const qid = q.getId(questionIndex)
    chai.assert.equal(q[qid].text, expectedTitle)
  }

  function checkOptionText(state, questionIndex, optionIndex, expectedTitle) {
    const q = store.getState().quiz.questions
    const qid = q.getId(questionIndex)
    const oid = q[qid].options.getId(optionIndex)
    chai.assert.equal(q[qid].options[oid].text, expectedTitle)
  }

  describe('#remix hashlist actions', function () {
    it('store inited successfully by remix', () => {
      checkState({
        state: store.getState(),
        questionsCount: 2,
        optionsCount: [2, 2],
      })
      chai.assert.equal(Remix._getLastUpdateDiff().added.length, 10)
      chai.assert.equal(Remix._getLastUpdateDiff().changed.length, 0)
      chai.assert.equal(Remix._getLastUpdateDiff().deleted.length, 0)
    })

    it('addHashlistElement', () => {
      Remix.addHashlistElement('quiz.questions', 2) // 2 - to the end of hashlist
      checkState({
        state: store.getState(),
        questionsCount: 3, // 2+1 one question was added
        optionsCount: [2, 2, 2], // +2 options by app schema
      })
      checkQuestionTitle(store.getState(), 2, 'New question title')
      checkOptionText(store.getState(), 2, 0, 'Option 1')
      checkOptionText(store.getState(), 2, 1, 'Option 2')
      chai.assert.equal(Remix._getLastUpdateDiff().added.length, 4)
      chai.assert.equal(Remix._getLastUpdateDiff().changed.length, 1)
      chai.assert.equal(Remix._getLastUpdateDiff().deleted.length, 0)

      const newElemId = store.getState().quiz.questions.getId(2)
      Remix.addHashlistElement(`quiz.questions.${newElemId}.options`, 0) // 0 - in the beginning if hashlist
      checkState({
        state: store.getState(),
        questionsCount: 3,
        optionsCount: [2, 2, 3], // +1 option
      })
      checkOptionText(store.getState(), 2, 0, 'New option')
      chai.assert.equal(Remix._getLastUpdateDiff().added.length, 1)
      chai.assert.equal(Remix._getLastUpdateDiff().changed.length, 1)
      chai.assert.equal(Remix._getLastUpdateDiff().deleted.length, 0)
    })

    it('changePositionInHashlist', () => {
      Remix.changePositionInHashlist('quiz.questions', 2, 0) // the last question goes to the beginning
      checkState({
        state: store.getState(),
        questionsCount: 3,
        optionsCount: [3, 2, 2],
      })
      checkQuestionTitle(store.getState(), 0, 'New question title')
      checkQuestionTitle(store.getState(), 1, 'Input your question 1')
      checkQuestionTitle(store.getState(), 2, 'Input your question 2')
      chai.assert.equal(Remix._getLastUpdateDiff().added.length, 0)
      chai.assert.equal(Remix._getLastUpdateDiff().changed.length, 1)
      chai.assert.equal(Remix._getLastUpdateDiff().deleted.length, 0)
    })

    it('deleteHashlistElement', () => {
      Remix.deleteHashlistElement('quiz.questions', { index: 1 }) // delete the second question
      checkState({
        state: store.getState(),
        questionsCount: 2,
        optionsCount: [3, 2],
      })
      checkQuestionTitle(store.getState(), 0, 'New question title')
      checkQuestionTitle(store.getState(), 1, 'Input your question 2')
      chai.assert.equal(Remix._getLastUpdateDiff().added.length, 0)
      chai.assert.equal(Remix._getLastUpdateDiff().changed.length, 1)
      chai.assert.equal(Remix._getLastUpdateDiff().deleted.length, 4)

      const lastQuestionId = store.getState().quiz.questions.getId(1)
      Remix.deleteHashlistElement(`quiz.questions.${lastQuestionId}.options`, { index: 0 })
      checkState({
        state: store.getState(),
        questionsCount: 2,
        optionsCount: [3, 1],
      })
      chai.assert.equal(Remix._getLastUpdateDiff().added.length, 0)
      chai.assert.equal(Remix._getLastUpdateDiff().changed.length, 1)
      chai.assert.equal(Remix._getLastUpdateDiff().deleted.length, 1)
    })
  })
})
