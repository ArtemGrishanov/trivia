import HashList from '../hashlist.js'

describe('HashList', function () {
    const list = new HashList([11, 22, 33])

    describe('#_getUniqueId', function () {
        it('Returns unique id', function () {
            chai.assert.equal(list._getUniqueId() == list._getUniqueId(), false)
        })
    })

    describe('#constructor', function () {
        it('Create new instance and get elements', function () {
            chai.assert.equal(list.length, 3)
            chai.assert.equal(list.toArray().length, 3)
            chai.assert.equal(!!list._orderedIds, true)
            list._orderedIds.forEach(id => {
                chai.assert.equal(!!list[id], true)
            })
        })
    })

    describe('#getId', function () {
        it('Returns id on position', function () {
            chai.assert.equal(list.getId(0), list._orderedIds[0])
            chai.assert.equal(list.getId(1), list._orderedIds[1])
            chai.assert.equal(list.getId(2), list._orderedIds[2])
            chai.assert.equal(list.getId(3), undefined)
        })
    })

    describe('#getIndex', function () {
        it('Get position', function () {
            chai.assert.equal(list.getIndex(list._orderedIds[0]), 0)
            chai.assert.equal(list.getIndex('unknown_id'), -1)
        })
    })

    describe('#addElement', function () {
        const list = new HashList([11, 22, 33])

        it('add element on different positions', function () {
            chai.assert.equal(list.length, 3)
            list.addElement('new1')
            chai.assert.equal(list.length, 4)
            chai.assert.equal(list.toArray()[3], 'new1')

            list.addElement('new2', 1)
            chai.assert.equal(list.length, 5)
            chai.assert.equal(list.toArray()[1], 'new2')
            chai.assert.equal(list.toArray()[4], 'new1')

            list.addElement('new3', 0, 'custom_id')
            chai.assert.equal(list.length, 6)
            chai.assert.equal(list.toArray()[0], 'new3')
            chai.assert.equal(list.getId(0), 'custom_id')
            chai.assert.equal(list.toArray()[2], 'new2')
            chai.assert.equal(list.toArray()[5], 'new1')
        })
    })

    describe('#changePosition', function () {
        const list = new HashList([11, 22, 33])

        it('change position', function () {
            list.changePosition(0, 1)
            chai.assert.equal(list.toArray()[0], 22)
            chai.assert.equal(list.toArray()[1], 11)
            chai.assert.equal(list.toArray()[2], 33)
            list.changePosition(2, 0)
            chai.assert.equal(list.toArray()[0], 33)
            chai.assert.equal(list.toArray()[1], 22)
            chai.assert.equal(list.toArray()[2], 11)
        })
    })

    describe('#shuffle', function () {
        const list = new HashList([11, 22, 33, 44, 55, 66, 77, 88, 99, 100, 101, 102])

        it('shuffle', function () {
            list.shuffle()
            const arr = list.toArray()
            chai.assert.equal(arr[0] === 11 && arr[1] === 22 && arr[2] === 33, false)
        })
    })

    describe('#toArray', function () {
        it('Retuns new array each time', function () {
            chai.assert.equal(list.toArray() !== list.toArray(), true)
        })

        it('Retuns new array with right length', function () {
            chai.assert.equal(list.toArray().length, 3)
        })
    })

    describe('#deleteElement', function () {
        const list = new HashList([11, 22, 33])

        it('Deleting all elements one by one', function () {
            const deleted1 = list.deleteElement(1)
            chai.assert.equal(deleted1, 22)
            chai.assert.equal(list.length, 2)
            chai.assert.equal(list.toArray()[0], 11)
            chai.assert.equal(list.toArray()[1], 33)

            const deleted2 = list.deleteElement(0)
            chai.assert.equal(deleted2, 11)
            chai.assert.equal(list.length, 1)
            chai.assert.equal(list.toArray()[0], 33)

            const deleted3 = list.deleteElement(0)
            chai.assert.equal(deleted3, 33)
            chai.assert.equal(list.length, 0)
        })
    })

    describe('#deleteElementById', function () {
        const list = new HashList([11, 22, 33])

        it('Deleting', function () {
            const deleted1 = list.deleteElementById(list.getId(1))
            chai.assert.equal(deleted1, 22)
            chai.assert.equal(list.length, 2)
            chai.assert.equal(list.toArray()[0], 11)
            chai.assert.equal(list.toArray()[1], 33)
        })
    })

    describe('#getElementCopy', function () {
        it('Make copy of primitive', function () {
            const list = new HashList([11, 22, 33])
            const cloned = list.getElementCopy(1)
            chai.assert.equal(cloned == 22, true)
        })

        it('Make copy of object', function () {
            const elem = {
                data1: 'value1',
                data2: false,
                data3: {},
            }
            const list = new HashList([11, elem])
            const cloned = list.getElementCopy(1)
            chai.assert.equal(cloned == elem, false)
            chai.assert.equal(cloned == list[list.getId(1)], false)
            chai.assert.equal(cloned.data1 === 'value1', true)
            chai.assert.equal(cloned.data2 === false, true)
            chai.assert.equal(elem.data3 !== cloned.data3, true)
        })

        it('deep clone child hashlist elements', function () {
            const components = new HashList([
                { name: 'Component1', data: '12345' },
                { name: 'Component2', data: '09876' },
            ])
            const screens = new HashList([
                {
                    backgroundColor: '#000',
                    components,
                },
            ])
            const copy = screens.getElementCopy(0, { cloneChildHashlists: true })

            const origin = screens.getByIndex(0)
            chai.assert.equal(copy == origin, false)
            chai.assert.equal(copy.backgroundColor === origin.backgroundColor, true)

            chai.assert.equal(origin.components.length === 2, true)
            chai.assert.equal(copy.components.length === 2, true)

            chai.assert.equal(copy.components.getByIndex(0).name === 'Component1', true)
            chai.assert.equal(origin.components.getByIndex(0).name === 'Component1', true)

            chai.assert.equal(copy.components.getByIndex(1).name === 'Component2', true)
            chai.assert.equal(origin.components.getByIndex(1).name === 'Component2', true)

            chai.assert.equal(copy.components.getByIndex(0) == origin.components.getByIndex(0), false)
            chai.assert.equal(copy.components.getByIndex(1) == origin.components.getByIndex(1), false)

            chai.assert.equal(copy.components.getId(0).length > 1, true)
            chai.assert.equal(copy.components.getId(1).length > 1, true)

            chai.assert.equal(copy.components.getId(0) == origin.components.getId(0), false)
            chai.assert.equal(copy.components.getId(1) == origin.components.getId(1), false)
        })
    })

    describe('#list empty', function () {
        const listEmpty = new HashList([])

        it('Can be created', function () {
            chai.assert.equal(listEmpty.length == 0, true)
            chai.assert.equal(listEmpty._orderedIds.length == 0, true)
        })
    })

    describe('#filter', function () {
        const list = new HashList([-1, 2, -3])
        const listObj = new HashList([{ disabled: false }, { disabled: false }, { disabled: true }])

        it('Filter', function () {
            const f1 = list.filter(e => e > 0)
            chai.assert.equal(!!f1._orderedIds, true)
            chai.assert.equal(list !== f1, true)
            chai.assert.equal(f1.length, 1)
            chai.assert.equal(f1.getByIndex(0), 2)

            // empty hashlist as a result
            chai.assert.equal(list.filter(e => e > 100).length, 0)

            const f2 = listObj.filter(e => !e.disabled)
            chai.assert.equal(listObj !== f2, true)
            chai.assert.equal(f2.length, 2)
        })
    })
})
