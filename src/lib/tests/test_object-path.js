
import { Selector } from '../object-path.js'
import HashList from '../hashlist.js';

describe('Selector', function() {

    describe('#fetch', function() {

        it('empty result 1', function() {
            const s1 = new Selector("app.size.width");
            chai.assert.equal(s1.fetch({}).length, 0);
            chai.assert.equal(s1.fetch("3234").length, 0);
            chai.assert.equal(s1.fetch(23334).length, 0);
            chai.assert.equal(s1.fetch({some:{props:{app:{}}}}).length, 0);
            try{
                chai.assert.equal(s1.fetch().length, 0);
                chai.assert.equal(true, false);
            }
            catch(err) {
                // it is OK
            }
            try{
                chai.assert.equal(s1.fetch(null).length, 0);
                chai.assert.equal(true, false);
            }
            catch(err) {
                // it is OK
            }
        });

        it('empty result 2', function() {
            const s1 = new Selector("app.size.width");
            const obj0 = {
                app: {
                }
            }
            chai.assert.equal(s1.fetch(obj0).length, 0);
        });

        it('empty result 3', function() {
            const s1 = new Selector("app.size.width");
            const obj = {
                app: {
                    size: undefined
                }
            }
            chai.assert.equal(s1.fetch(obj).length, 0);
        });

        it('empty result 4', function() {
            const s1 = new Selector("app.size.width");
            const obj = {
                app: {
                    size: null
                }
            }
            chai.assert.equal(s1.fetch(obj).length, 0);
        });

        it('empty result 5', function() {
            const s1 = new Selector("app.size.width");
            const obj1 = {app:{
                size: {}
            }}
            chai.assert.equal(s1.fetch(obj1).length, 0);
        });

        it('empty result 6', function() {
            const s1 = new Selector("app.size.width");
            const obj2 = {app:{
                size: {
                    height: 10
                }
            }}
            chai.assert.equal(s1.fetch(obj2).length, 0);
        });

        it('fetch number value', function() {
            const s1 = new Selector("app.size.width");
            const obj = {app:{
                size: {
                    width: 99
                }
            }}
            chai.assert.equal(s1.fetch(obj).length, 1);
            chai.assert.equal(s1.fetch(obj)[0].value, 99);
            chai.assert.equal(s1.fetch(obj)[0].path, "app.size.width");
        });

        it('fetch undefined', function() {
            const s1 = new Selector("app.size.undefinedProp");
            const obj = {app:{
                size: {
                    undefinedProp: undefined
                }
            }}
            chai.assert.equal(s1.fetch(obj).length, 1);
            chai.assert.equal(s1.fetch(obj)[0].value, undefined);
            chai.assert.equal(s1.fetch(obj)[0].path, "app.size.undefinedProp");
        });

        it('fetch null', function() {
            const s1 = new Selector("app.size.nullProp");
            const obj = {app:{
                size: {
                    nullProp: null
                }
            }}
            chai.assert.equal(s1.fetch(obj).length, 1);
            chai.assert.equal(s1.fetch(obj)[0].value, null);
            chai.assert.equal(s1.fetch(obj)[0].path, "app.size.nullProp");
        });

        it('fetch types', function() {
            const s1 = new Selector("app.[size Object].[width Number]");

            const obj = {
                app:{
                    size: {
                        width: 123
                    }
                }
            };
            chai.assert.equal(s1.fetch(obj).length, 1);
            chai.assert.equal(s1.fetch(obj)[0].value, 123);
            chai.assert.equal(s1.fetch(obj)[0].path, "app.size.width");

            const obj2 = {
                app:{
                    size: {
                        width: '123'
                    }
                }
            };
            chai.assert.equal(s1.fetch(obj2).length, 0);
        });

        it('Regexp', function() {
            const obj = {
                app: {
                    size: {
                        prop: 123
                    }
                },
                foo: {
                    bar: {
                        prop: 345
                    }
                },
                nope123: {
                    bar: {
                        prop: 999
                    }
                }
            };

            const s1 = new Selector("/^[a-z]+$/./^[a-z]+$/./^prop$/");
            chai.assert.equal(s1.fetch(obj).length, 2);
            chai.assert.equal(s1.fetch(obj)[0].value, 123);
            chai.assert.equal(s1.fetch(obj)[0].path, "app.size.prop");
            chai.assert.equal(s1.fetch(obj)[1].value, 345);
            chai.assert.equal(s1.fetch(obj)[1].path, "foo.bar.prop");

            const s2 = new Selector("/^[a-z0-9]+$/./^bar$/./^prop$/");
            chai.assert.equal(s2.fetch(obj).length, 2);
            chai.assert.equal(s2.fetch(obj)[0].value, 345);
            chai.assert.equal(s2.fetch(obj)[0].path, "foo.bar.prop");
            chai.assert.equal(s2.fetch(obj)[1].value, 999);
            chai.assert.equal(s2.fetch(obj)[1].path, "nope123.bar.prop");
        });
    });


    describe('#assign', function() {
        it('to empty object', function() {
            const s1 = new Selector("app.size.width");
            const obj = {};
            s1.assign(obj, 77);
            chai.assert.equal(obj.app.size.width, 77);
        });

        it('with typed hashlist', () => {
            const h = new HashList([{data: 123}, {data: 456}, {data: 789}]);
            const secondId = h.getId(1);
            const s1 = new Selector("app.[hashlist Hashlist]."+secondId+".data");
            const obj = {
                app:{
                    hashlist: h
                }
            };
            s1.assign(obj, 777);
            chai.assert.equal(h.toArray()[1].data, 777);
        });

        it('cannot assign with mismatched type', () => {
            const h = new HashList([{data: 123}, {data: 456}, {data: 789}]);
            const secondId = h.getId(1);
            const s1 = new Selector("app.[hashlist Object]."+secondId+".data");
            const obj = {
                app:{
                    hashlist: h
                }
            };
            try {
                s1.assign(obj, 777);
                chai.assert.equal(false, true);    
            }
            catch(err) {
                // it is OK
            }
            chai.assert.equal(h.toArray()[1].data, 456); // no assign
        });

        it('assign using regexp', () => {
            const h = new HashList([{text: "123"}, {text: "456"}, {data: "789"}]);
            const s1 = new Selector("app.[hashlist HashList]./^[0-9a-z]+$/.options");
            const obj = {
                app:{
                    hashlist: h
                }
            };
            try {
                s1.assign(obj, {optionText: 'option text'});
                chai.assert.equal(true, false);
            }
            catch(err) {
                // it is OK
            }
            // const result = s1.fetch(obj);
            // chai.assert.equal(result.length, 3); // 3 properties were added
            // chai.assert.equal(result[2].value.optionText, "option text");
        });
    });

    describe('#match', function() {

        it('match', () => {
            const s = new Selector("app.path.to.prop");
            chai.assert.equal(s.match("app.path.to.prop"), true);
        });

        it('match', () => {
            const s = new Selector("app.path.to.prop.false");
            chai.assert.equal(s.match("app.path.to.prop"), false);
        });

        it('regexp', () => {
            const s = new Selector("app./^[a-z0-9]+$/.to.prop");
            chai.assert.equal(s.match("app.path.to.prop"), true);
        });

        it('regexp selector, regexp path', () => {
            const s = new Selector("quiz.[questions HashList]./^[0-9a-z]+$/.text");
            chai.assert.equal(s.match("quiz.[questions HashList]./^[0-9a-z]+$/.options"), false);
        });
    });

    describe('#getPathes', () => {

        it('selector equal to path', () => {
            const s = new Selector("app.[path object].to.prop");
            const obj = {
                app:{
                    path: {
                        to: {
                            prop: "value"
                        }
                    }
                }
            };
            const pathes = s.getPathes(obj);
            chai.assert.equal(pathes.length, 1);
            chai.assert.equal(pathes[0], "app.path.to.prop");
        });

        it('unresolved path', () => {
            const s = new Selector("app.[path object].to.prop");
            const obj = {
                app:{
                    path: {
                        
                    }
                }
            };
            const pathes = s.getPathes(obj);
            chai.assert.equal(pathes.length, 1);
            chai.assert.equal(pathes[0], "app.path.to.prop");
        });

        it('path with undefined value', () => {
            const s = new Selector("app.[path object].to.prop");
            const obj = {
                app:{
                    path: {
                        to: {
                            prop: undefined
                        }
                    }
                }
            };
            const pathes = s.getPathes(obj);
            chai.assert.equal(pathes.length, 1);
            chai.assert.equal(pathes[0], "app.path.to.prop");
        });

        it('path with undefined value', () => {
            const h = new HashList([{data: "123"}, {data: "456"}, {data: "789"}]);
            const s1 = new Selector("app.[hashlist HashList]./^[0-9a-z]+$/.options");
            const obj = {
                app:{
                    hashlist: h
                }
            };
            const pathes = s1.getPathes(obj);
            chai.assert.equal(pathes.length, 3);
            chai.assert.equal(pathes[0], "app.hashlist."+h.getId(0)+".options");
            chai.assert.equal(pathes[1], "app.hashlist."+h.getId(1)+".options");
            chai.assert.equal(pathes[2], "app.hashlist."+h.getId(2)+".options");
        });

    })
});