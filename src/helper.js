import store from './store'

export function getOption(questionsHL, optionId) {
  var qarr = questionsHL.toArray()
  for (let i = 0; i < qarr.length; i++) {
    if (qarr[i].options.hasOwnProperty(optionId)) {
      return qarr[i].options[optionId]
    }
  }
  return null
}

export function getQuestionIdByOption(questionsHL, optionId) {
  var qarr = questionsHL.toArray()
  for (let i = 0; i < qarr.length; i++) {
    if (qarr[i].options.hasOwnProperty(optionId)) {
      return questionsHL.getId(i)
    }
  }
  return null
}

export function calcResult(questions, results, points) {
  return getResultPointsAllocation(questions, results)[points]
}

/**
 * returns object:
 * <pointsCount>: <resultId>
 *
 * {
 * 0: 'result1',
 * 1: 'result1',
 * 2: 'result2',
 * ...}
 *
 */
export function getResultPointsAllocation(questions, results) {
  const resultsArr = results.toArray()
  const qArr = questions.toArray()
  const maxPoints = qArr.length // считаем по логике этого проекта, что только одна опция верна в одном вопросе

  const result = {}
  var resGap = Math.floor(qArr.length / resultsArr.length) // длина промежутка на шкале распределения, которая приходится на один результат
  if (resGap < 1) {
    resGap = 1
  }
  var g = 1
  var resIndex = resultsArr.length - 1 // начинаем распределять с конца
  if (resIndex >= 0) {
    var currentResultId = results.getId(resIndex)
    for (var i = maxPoints; i >= 0; i--) {
      // >= важно!
      result[i] = currentResultId
      g++
      if (g > resGap) {
        g = 1
        if (resIndex) {
          resIndex--
          currentResultId = results.getId(resIndex)
        }
      }
    }
  }
  return result
}
