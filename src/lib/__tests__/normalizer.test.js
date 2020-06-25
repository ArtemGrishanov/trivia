import DataSchema from '../schema.js'
import Normalizer from '../normalizer.js'

describe('Selector', function () {
    describe('#String', function () {
        it('Normalization', function () {
            const s = new DataSchema({
                oneString: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 10,
                    default: 'abc',
                },
            })
            const n = new Normalizer(s)

            let o = n.process({ oneString: null })
            expect(o.oneString).toEqual('abc')

            o = n.process({ oneString: 'verylongstring_verylongstring' })
            expect(o.oneString).toEqual('verylongst')

            o = n.process({ oneString: '' })
            expect(o.oneString).toEqual('abc')
        })

        it('String enum', function () {
            const s = new DataSchema({
                enstr: {
                    type: 'string',
                    enum: ['left', 'center', 'right'],
                    default: 'center',
                },
            })
            const n = new Normalizer(s)

            let o = n.process({})
            expect(o.enstr).toEqual('center')

            o = n.process({ enstr: 'illegal' })
            expect(o.enstr).toEqual('center')

            o = n.process({ enstr: 'right' })
            expect(o.enstr).toEqual('right')

            const s2 = new DataSchema({
                enstr: {
                    type: 'string',
                    enum: ['true', 'false', '42'],
                    default: 'true',
                },
            })
            const n2 = new Normalizer(s2)

            let o2 = n2.process({ enstr: 42 })
            expect(o2.enstr).toEqual('42')

            o2 = n2.process({ enstr: false })
            expect(o2.enstr).toEqual('false')
        })

        it('Schema validation', function () {
            expect(() => {
                new DataSchema({
                    oneString: {
                        type: 'string',
                        min: 1, // illegal attribute
                        max: 10, // illegal attribute
                        default: 'norm',
                    },
                })
            }).toThrowError(
                `DataSchema: invalid attribute "min". Valid attributes: default,serialize,condition,enum,minLength,maxLength,canBeUndefined,conditionOf for type "string`,
            )

            expect(() => {
                new DataSchema({
                    oneString: {
                        type: 'string',
                        // no default attr
                    },
                })
            }).toThrowError('DataSchema: attribute "default" is missed in "oneString"')
        })
    })

    describe('#Boolean', function () {
        it('Normalization', function () {
            const s = new DataSchema({
                boo: {
                    type: 'boolean',
                    default: true,
                },
            })
            const n = new Normalizer(s)

            let o = n.process({ boo: undefined })
            expect(o.boo).toBeTruthy()

            o = n.process({ boo: null })
            expect(o.boo).toBeFalsy()

            o = n.process({ boo: false })
            expect(o.boo).toBeFalsy()

            o = n.process({ boo: 'false' }) // special case string 'false' must be considered as boolean false
            expect(o.boo).toBeFalsy()

            const s2 = new DataSchema({
                boo: {
                    type: 'boolean',
                    default: 'parsed as true',
                },
            })
            const n2 = new Normalizer(s2)
            let o2 = n2.process({})
            expect(o2.boo).toBeTruthy()
        })

        it('Schema validation', function () {
            expect(() => {
                new DataSchema({
                    boo: {
                        type: 'boolean',
                        min: 1, // illegal attribute
                        default: true,
                    },
                })
            }).toThrowError(
                'DataSchema: invalid attribute "min". Valid attributes: default,serialize,condition,enum,canBeUndefined,conditionOf for type "boolean"',
            )
        })
    })

    describe('#Array', function () {
        it('Normalization', function () {
            const s = new DataSchema({
                arr: {
                    type: 'array',
                    default: [],
                },
            })

            const n = new Normalizer(s)
            ;[(void 0, null, '', 0, false, {})].forEach(v => {
                const o = n.process({ arr: v })
                expect(Array.isArray(o.arr)).toBeTruthy()
            })

            const o = n.process({ arr: ['1', '2', '3'] })
            expect(Array.isArray(o.arr)).toBeTruthy()
            expect(o.arr).toHaveLength(3)
            expect(o.arr[0]).toEqual('1')
            expect(o.arr[2]).toEqual('3')
            expect(o.arr).toEqual(expect.arrayContaining(['1', '2', '3']))
        })

        it('Schema validation', function () {
            expect(() => {
                new DataSchema({
                    oneArray: {
                        type: 'array',
                        min: 1, // illegal attribute
                        max: 10, // illegal attribute
                        default: [],
                    },
                })
            }).toThrowError(
                `DataSchema: invalid attribute "min". Valid attributes: default,condition,canBeUndefined,conditionOf for type "array`,
            )

            expect(() => {
                new DataSchema({
                    oneArray: {
                        type: 'array',
                        // no default attr
                    },
                })
            }).toThrowError('DataSchema: attribute "default" is missed in "oneArray"')
        })
    })
})
