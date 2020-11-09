const getCartesianProduct = function* (iterables) {
    if (!Array.isArray(iterables)) {
        return throwValidation()
    }

    if (iterables.length === 0) {
        return
    }

    const iteratorFuncs = iterables.map(getIteratorFuncs)

    yield* getResults(iteratorFuncs)
}

const getIteratorFuncs = function (input) {
    if (typeof input[Symbol.iterator] === 'function') {
        return input[Symbol.iterator].bind(input)
    }

    if (typeof input !== 'function') {
        return throwValidation()
    }

    return input
}

const getResults = function* (iteratorFuncs) {
    const iterators = iteratorFuncs.map(getIterator)
    const results = iterators.map(getInitialValue)

    if (hasEmptyIterators(results)) {
        return
    }

    const result = results.map(getValue)

    // eslint-disable-next-line fp/no-loops
    do {
        yield result.slice()
    } while (!getResult(iteratorFuncs, iterators, result))
}

const getIterator = function (iteratorFunc) {
    const iterator = iteratorFunc()

    if (!isIterator(iterator)) {
        return throwValidation()
    }

    return iterator
}

const throwValidation = function () {
    throw new TypeError('Argument must be an array of arrays or generators')
}

const isIterator = function (value) {
    return typeof value === 'object' && value !== null && typeof value.next === 'function'
}

const getInitialValue = function (iterator) {
    return iterator.next()
}

const hasEmptyIterators = function (results) {
    return results.some(isEmptyIterator)
}

const isEmptyIterator = function ({ done }) {
    return done
}

const getValue = function ({ value }) {
    return value
}

const getResult = function (iteratorFuncs, iterators, result) {
    let reset = false
    let index = iterators.length - 1

    do {
        const iterator = iterators[index]

        const { done, value } = iterator.next()

        result[index] = value

        if (reset) {
            reset = false
            index--

            if (index === -1) {
                return true
            }
        } else if (done) {
            reset = true
            iterators[index] = iteratorFuncs[index]()
        } else {
            break
        }
    } while (true)
}

module.exports = getCartesianProduct
