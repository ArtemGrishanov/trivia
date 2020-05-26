import { Selector } from '../object-path.js'
import HashList from '../hashlist.js'

describe('Selector', () => {
    describe('#fetch', () => {
        it('empty result 1', () => {
            const s1 = new Selector('app.size.width')
            expect(s1.fetch({})).toHaveLength(0)
            expect(s1.fetch('3234')).toHaveLength(0)
            expect(s1.fetch(23334)).toHaveLength(0)
            expect(s1.fetch({ some: { props: { app: {} } } })).toHaveLength(0)
            expect(() => {
                s1.fetch()
            }).toThrowError('Object is not specified')
            expect(() => {
                s1.fetch(null)
            }).toThrowError('Object is not specified')
        })

        it('empty result 2', () => {
            const s1 = new Selector('app.size.width')
            const obj0 = {
                app: {},
            }
            expect(s1.fetch(obj0)).toHaveLength(0)
        })

        it('empty result 3', () => {
            const s1 = new Selector('app.size.width')
            const obj = {
                app: {
                    size: undefined,
                },
            }
            expect(s1.fetch(obj)).toHaveLength(0)
        })

        it('empty result 4', () => {
            const s1 = new Selector('app.size.width')
            const obj = {
                app: {
                    size: null,
                },
            }
            expect(s1.fetch(obj)).toHaveLength(0)
        })

        it('empty result 5', () => {
            const s1 = new Selector('app.size.width')
            const obj1 = {
                app: {
                    size: {},
                },
            }
            expect(s1.fetch(obj1)).toHaveLength(0)
        })

        it('empty result 6', () => {
            const s1 = new Selector('app.size.width')
            const obj2 = {
                app: {
                    size: {
                        height: 10,
                    },
                },
            }
            expect(s1.fetch(obj2)).toHaveLength(0)
        })

        it('fetch number value', () => {
            const s1 = new Selector('app.size.width')
            const obj = {
                app: {
                    size: {
                        width: 99,
                    },
                },
            }
            expect(s1.fetch(obj)).toHaveLength(1)
            expect(s1.fetch(obj)[0].value).toEqual(99)
            expect(s1.fetch(obj)[0].path).toEqual('app.size.width')
        })

        it('fetch undefined', () => {
            const s1 = new Selector('app.size.undefinedProp')
            const obj = {
                app: {
                    size: {
                        undefinedProp: undefined,
                    },
                },
            }
            expect(s1.fetch(obj)).toHaveLength(1)
            expect(s1.fetch(obj)[0].value).toBeUndefined()
            expect(s1.fetch(obj)[0].path).toEqual('app.size.undefinedProp')
        })

        it('fetch null', () => {
            const s1 = new Selector('app.size.nullProp')
            const obj = {
                app: {
                    size: {
                        nullProp: null,
                    },
                },
            }
            expect(s1.fetch(obj)).toHaveLength(1)
            expect(s1.fetch(obj)[0].value).toBeNull()
            expect(s1.fetch(obj)[0].path).toEqual('app.size.nullProp')
        })

        it('fetch types', () => {
            const s1 = new Selector('app.[size Object].[width Number]')

            const obj = {
                app: {
                    size: {
                        width: 123,
                    },
                },
            }
            expect(s1.fetch(obj)).toHaveLength(1)
            expect(s1.fetch(obj)[0].value).toEqual(123)
            expect(s1.fetch(obj)[0].path).toEqual('app.size.width')

            const obj2 = {
                app: {
                    size: {
                        width: '123',
                    },
                },
            }
            expect(s1.fetch(obj2)).toHaveLength(0)
        })

        it('Regexp', () => {
            const obj = {
                app: {
                    size: {
                        prop: 123,
                    },
                },
                foo: {
                    bar: {
                        prop: 345,
                    },
                },
                nope123: {
                    bar: {
                        prop: 999,
                    },
                },
            }

            const s1 = new Selector('/^[a-z]+$/./^[a-z]+$/./^prop$/')
            expect(s1.fetch(obj)).toHaveLength(2)
            expect(s1.fetch(obj)[0].value).toEqual(123)
            expect(s1.fetch(obj)[0].path).toEqual('app.size.prop')
            expect(s1.fetch(obj)[1].value).toEqual(345)
            expect(s1.fetch(obj)[1].path).toEqual('foo.bar.prop')

            const s2 = new Selector('/^[a-z0-9]+$/./^bar$/./^prop$/')
            expect(s2.fetch(obj)).toHaveLength(2)
            expect(s2.fetch(obj)[0].value).toEqual(345)
            expect(s2.fetch(obj)[0].path).toEqual('foo.bar.prop')
            expect(s2.fetch(obj)[1].value).toEqual(999)
            expect(s2.fetch(obj)[1].path).toEqual('nope123.bar.prop')
        })

        it('fetch Hashlist', () => {
            const s1 = new Selector('app.[screens HashList]./^[a-z0-9]+$/')

            const obj = {
                app: {
                    screens: new HashList(['A', 'B']),
                    otherdata: 1,
                },
            }
            expect(s1.fetch(obj)).toHaveLength(2)
            expect(s1.fetch(obj)[0].value).toEqual('A')
            expect(s1.fetch(obj)[1].value).toEqual('B')
        })

        it('fetch Hashlist with custom type checking', () => {
            const s1 = new Selector('app.[screens HashList]./^[a-z0-9]+$/', {
                typeCheckers: {
                    HashList: obj => obj.hasOwnProperty('_orderedIds'),
                },
            })

            const obj = {
                app: {
                    // this is a serialized hashlist and we need consider it as 'hashlist'
                    screens: { _orderedIds: ['ar1r5h', 'vven03'], ar1r5h: 'A', vven03: 'B' },
                    otherdata: 1,
                },
            }
            expect(s1.fetch(obj)).toHaveLength(2)
            expect(s1.fetch(obj)[0].value).toEqual('A')
            expect(s1.fetch(obj)[1].value).toEqual('B')
        })

        it('fetch with attribute filter', () => {
            const s1 = new Selector('app.[component displayName=Text].tags')
            const s2 = new Selector('app.[component displayName=Image].tags')

            const obj = {
                app: {
                    component: {
                        displayName: 'Text',
                        tags: 'text component remix',
                        data: 'some data',
                    },
                },
            }
            expect(s1.fetch(obj)).toHaveLength(1)
            expect(s1.fetch(obj)[0].value).toEqual('text component remix')

            expect(s2.fetch(obj)).toHaveLength(0)
        })

        it('fetch with attribute "indexOf" filter', () => {
            const s1 = new Selector('app.[component tags=~component].tags')
            const s2 = new Selector('app.[component tags=~no_component].tags') // no result

            const obj = {
                app: {
                    component: {
                        displayName: 'Text',
                        tags: 'text component remix',
                        data: 'some data',
                    },
                },
            }
            expect(s1.fetch(obj)).toHaveLength(1)
            expect(s1.fetch(obj)[0].value).toEqual('text component remix')

            expect(s2.fetch(obj)).toHaveLength(0)
        })

        it('fetch with attribute filter and regexp', () => {
            const s1 = new Selector('app./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ displayName=Text].tags')
            const s2 = new Selector('app./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ displayName=Image].tags')

            const obj = {
                app: {
                    wf127j: {
                        components: {
                            gf644a: {
                                displayName: 'Text',
                                tags: 'ttt',
                                data: 'some data',
                            },
                            cca321: {
                                displayName: 'Image',
                                tags: 'iii',
                                data: 'some data',
                            },
                            gth8877: {
                                displayName: 'Text',
                                tags: 'ttt',
                                data: 'some data',
                            },
                        },
                    },
                },
            }

            expect(s1.fetch(obj)).toHaveLength(2)
            expect(s1.fetch(obj)[0].value).toEqual('ttt')
            expect(s1.fetch(obj)[1].value).toEqual('ttt')

            expect(s2.fetch(obj)).toHaveLength(1)
            expect(s2.fetch(obj)[0].value).toEqual('iii')
        })
    })

    describe('#assign', () => {
        it('to empty object', () => {
            const s1 = new Selector('app.size.width')
            const obj = {}
            s1.assign(obj, 77)
            expect(obj.app.size.width).toEqual(77)
        })

        it('with typed hashlist', () => {
            const h = new HashList([{ data: 123 }, { data: 456 }, { data: 789 }])
            const secondId = h.getId(1)
            const s1 = new Selector('app.[hashlist Hashlist].' + secondId + '.data')
            const obj = {
                app: {
                    hashlist: h,
                },
            }
            s1.assign(obj, 777)
            expect(h.toArray()[1].data).toEqual(777)
        })

        it('cannot assign with mismatched type', () => {
            const h = new HashList([{ data: 123 }, { data: 456 }, { data: 789 }])
            const secondId = h.getId(1)
            const s1 = new Selector('app.[hashlist Object].' + secondId + '.data')
            const obj = {
                app: {
                    hashlist: h,
                },
            }
            expect(() => {
                s1.assign(obj, 777)
            }).toThrowError('hashlist has type "HashList", but "Object" expected')

            expect(h.toArray()[1].data).toEqual(456) // no assign
        })

        it('assign using regexp', () => {
            const h = new HashList([{ text: '123' }, { text: '456' }, { data: '789' }])
            const s1 = new Selector('app.[hashlist HashList]./^[0-9a-z]+$/.options')
            const obj = {
                app: {
                    hashlist: h,
                },
            }
            expect(() => {
                s1.assign(obj, { optionText: 'option text' })
            }).toThrowError('Cannot use this selector for assignment')
        })
    })

    describe('#match', () => {
        it('match', () => {
            const s = new Selector('app.path.to.prop')
            expect(s.match('app.path.to.prop')).toBeTruthy()
        })

        it('match', () => {
            const s = new Selector('app.path.to.prop.false')
            expect(s.match('app.path.to.prop')).toBeFalsy()
        })

        it('regexp', () => {
            const s = new Selector('app./^[a-z0-9]+$/.to.prop')
            expect(s.match('app.path.to.prop')).toBeTruthy()
        })

        it('regexp selector, regexp path', () => {
            const s = new Selector('quiz.[questions HashList]./^[0-9a-z]+$/.text')
            expect(s.match('quiz.[questions HashList]./^[0-9a-z]+$/.options')).toBeFalsy()
        })
    })

    describe('#getPathes', () => {
        it('selector equal to path', () => {
            const s = new Selector('app.[path object].to.prop')
            const obj = {
                app: {
                    path: {
                        to: {
                            prop: 'value',
                        },
                    },
                },
            }
            const pathes = s.getPathes(obj)
            expect(pathes).toHaveLength(1)
            expect(pathes[0]).toEqual('app.path.to.prop')
        })

        it('unresolved path', () => {
            const s = new Selector('app.[path object].to.prop')
            const obj = {
                app: {
                    path: {},
                },
            }
            const pathes = s.getPathes(obj)
            expect(pathes).toHaveLength(1)
            expect(pathes[0]).toEqual('app.path.to.prop')
        })

        it('path with undefined value', () => {
            const s = new Selector('app.[path object].to.prop')
            const obj = {
                app: {
                    path: {
                        to: {
                            prop: undefined,
                        },
                    },
                },
            }
            const pathes = s.getPathes(obj)
            expect(pathes).toHaveLength(1)
            expect(pathes[0]).toEqual('app.path.to.prop')
        })

        it('path with undefined value', () => {
            const h = new HashList([{ data: '123' }, { data: '456' }, { data: '789' }])
            const s1 = new Selector('app.[hashlist HashList]./^[0-9a-z]+$/.options')
            const obj = {
                app: {
                    hashlist: h,
                },
            }
            const pathes = s1.getPathes(obj)
            expect(pathes).toHaveLength(3)
            expect(pathes[0]).toEqual('app.hashlist.' + h.getId(0) + '.options')
            expect(pathes[1]).toEqual('app.hashlist.' + h.getId(1) + '.options')
            expect(pathes[2]).toEqual('app.hashlist.' + h.getId(2) + '.options')
        })
    })
})
