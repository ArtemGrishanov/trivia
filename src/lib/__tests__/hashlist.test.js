import HashList from '../hashlist.js'

describe('HashList', () => {
    let list = []

    beforeEach(() => {
        list = new HashList([11, 22, 33])
    })

    describe('#_getUniqueId', function () {
        it('should returns not unique id', () => {
            expect(list._getUniqueId()).not.toEqual(list._getUniqueId())
        })
    })

    describe('#constructor', function () {
        it('should creates new instance and get elements', () => {
            expect(list).toHaveLength(3)
            expect(list.toArray()).toHaveLength(3)
            expect(!!list._orderedIds).toBeTruthy()
            list._orderedIds.forEach(id => {
                expect(!!list[id]).toBeTruthy()
            })
        })
    })

    describe('#getId', function () {
        it('should returns id on position', function () {
            expect(list.getId(0)).toEqual(list._orderedIds[0])
            expect(list.getId(1)).toEqual(list._orderedIds[1])
            expect(list.getId(2)).toEqual(list._orderedIds[2])
            expect(list.getId(3)).toEqual(undefined)
        })
    })

    describe('#getIndex', () => {
        it('Get position', () => {
            expect(list.getIndex(list._orderedIds[0])).toEqual(0)
            expect(list.getIndex('unknown_id')).toEqual(-1)
        })
    })

    describe('#addElement', () => {
        it('should adds element on different positions', () => {
            expect(list.length).toEqual(3)
            list.addElement('new1')
            expect(list.length).toEqual(4)
            expect(list.toArray()[3]).toEqual('new1')

            list.addElement('new2', 1)
            expect(list).toHaveLength(5)
            expect(list.toArray()[1]).toEqual('new2')
            expect(list.toArray()[4]).toEqual('new1')

            list.addElement('new3', 0, 'custom_id')
            expect(list).toHaveLength(6)
            expect(list.toArray()[0]).toEqual('new3')
            expect(list.getId(0)).toEqual('custom_id')
            expect(list.toArray()[2]).toEqual('new2')
            expect(list.toArray()[5]).toEqual('new1')
        })
    })

    describe('#changePosition', () => {
        it('should changes position', () => {
            list.changePosition(0, 1)
            expect(list.toArray()[0]).toEqual(22)
            expect(list.toArray()[1]).toEqual(11)
            expect(list.toArray()[2]).toEqual(33)
            list.changePosition(2, 0)
            expect(list.toArray()[0]).toEqual(33)
            expect(list.toArray()[1]).toEqual(22)
            expect(list.toArray()[2]).toEqual(11)
        })
    })

    describe('#toArray', () => {
        it('sould return new array each time', () => {
            expect(list.toArray()).not.toBe(list.toArray())
        })

        it('should return new array with right length', () => {
            expect(list.toArray()).toHaveLength(3)
        })
    })

    describe('#deleteElement', () => {
        list = new HashList([11, 22, 33])

        it('Deleting all elements one by one', () => {
            const deleted1 = list.deleteElement(1)
            expect(deleted1).toEqual(22)
            expect(list).toHaveLength(2)
            expect(list.toArray()[0]).toEqual(11)
            expect(list.toArray()[1]).toEqual(33)

            const deleted2 = list.deleteElement(0)
            expect(deleted2).toEqual(11)
            expect(list).toHaveLength(1)
            expect(list.toArray()[0]).toEqual(33)

            const deleted3 = list.deleteElement(0)
            expect(deleted3).toEqual(33)
            expect(list).toHaveLength(0)
        })
    })

    describe('#deleteElementById', () => {
        list = new HashList([11, 22, 33])

        it('Deleting', () => {
            const deleted1 = list.deleteElementById(list.getId(1))
            expect(deleted1).toEqual(22)
            expect(list).toHaveLength(2)
            expect(list.toArray()[0]).toEqual(11)
            expect(list.toArray()[1]).toEqual(33)
        })
    })

    describe('#getElementCopy', () => {
        it('Make copy of primitive', () => {
            list = new HashList([11, 22, 33])
            const cloned = list.getElementCopy(1)
            expect(cloned).toEqual(22)
        })

        it('Make copy of object', () => {
            const elem = {
                data1: 'value1',
                data2: false,
                data3: {},
            }
            list = new HashList([11, elem])
            const cloned = list.getElementCopy(1)
            expect(cloned).toEqual(elem)
            expect(cloned).toEqual(list[list.getId(1)])
            expect(cloned.data1).toEqual('value1')
            expect(cloned.data2).toEqual(false)
            expect(elem.data3).not.toBe(cloned.data3)
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
            expect(copy).not.toEqual(origin)
            expect(copy.backgroundColor).toEqual(origin.backgroundColor)

            expect(origin.components).toHaveLength(2)
            expect(copy.components).toHaveLength(2)

            expect(copy.components.getByIndex(0).name).toEqual('Component1')
            expect(origin.components.getByIndex(0).name).toEqual('Component1')

            expect(copy.components.getByIndex(1).name).toEqual('Component2')
            expect(origin.components.getByIndex(1).name).toEqual('Component2')

            expect(copy.components.getByIndex(0)).not.toBe(origin.components.getByIndex(0))
            expect(copy.components.getByIndex(1)).not.toBe(origin.components.getByIndex(1))

            expect(copy.components.getId(0).length).toBeGreaterThan(1)
            expect(copy.components.getId(1).length).toBeGreaterThan(1)

            expect(copy.components.getId(0)).not.toBe(origin.components.getId(0))
            expect(copy.components.getId(1)).not.toBe(origin.components.getId(1))
        })
    })

    describe('#list empty', function () {
        const listEmpty = new HashList([])

        it('Can be created', function () {
            expect(listEmpty).toHaveLength(0)
            expect(listEmpty._orderedIds).toHaveLength(0)
        })
    })

    describe('#filter', function () {
        const list = new HashList([-1, 2, -3])
        const listObj = new HashList([{ disabled: false }, { disabled: false }, { disabled: true }])

        it('Filter', function () {
            const f1 = list.filter(e => e > 0)
            expect(!!f1._orderedIds).toBeTruthy()
            expect(list).not.toEqual(f1)
            expect(f1).toHaveLength(1)
            expect(f1.getByIndex(0)).toEqual(2)

            // empty hashlist as a result
            expect(list.filter(e => e > 100)).toHaveLength(0)

            const f2 = listObj.filter(e => !e.disabled)
            expect(listObj).not.toEqual(f2)
            expect(f2).toHaveLength(2)
        })
    })
})
