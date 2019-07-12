
import HashList from '../hashlist.js'

describe('HashList', function() {

    const list = new HashList([11,22,33]);

    describe('#_getUniqueId', function() {
        it('Returns unique id', function() {
            chai.assert.equal(list._getUniqueId() == list._getUniqueId(), false);
        });
    });

    describe('#constructor', function() {
        it('Create new instance and get elements', function() {
            chai.assert.equal(list.length, 3);
            chai.assert.equal(list.toArray().length, 3);
            chai.assert.equal(!!list._orderedIds, true);
            list._orderedIds.forEach( (id) => {
                chai.assert.equal(!!list[id], true);
            });
        });
    });

    describe('#getId', function() {
        it('Returns id on position', function() {
            chai.assert.equal(list.getId(0), list._orderedIds[0]);
            chai.assert.equal(list.getId(1), list._orderedIds[1]);
            chai.assert.equal(list.getId(2), list._orderedIds[2]);
            chai.assert.equal(list.getId(3), undefined);
        });
    });

    describe('#getIndex', function() {
        it('Get position', function() {
            chai.assert.equal(list.getIndex(list._orderedIds[0]), 0);
            chai.assert.equal(list.getIndex("unknown_id"), -1);
        });
    });

    describe('#addElement', function() {
        const list = new HashList([11,22,33]);

        it('add element on different positions', function() {
            chai.assert.equal(list.length, 3);
            list.addElement("new1")
            chai.assert.equal(list.length, 4);
            chai.assert.equal(list.toArray()[3], "new1");

            list.addElement("new2", 1)
            chai.assert.equal(list.length, 5);
            chai.assert.equal(list.toArray()[1], "new2");
            chai.assert.equal(list.toArray()[4], "new1");

            list.addElement("new3", 0, "custom_id")
            chai.assert.equal(list.length, 6);
            chai.assert.equal(list.toArray()[0], "new3");
            chai.assert.equal(list.getId(0), "custom_id");
            chai.assert.equal(list.toArray()[2], "new2");
            chai.assert.equal(list.toArray()[5], "new1");
        });
    });

    describe('#changePosition', function() {
        const list = new HashList([11,22,33]);

        it('change position', function() {
            list.changePosition(0,1);
            chai.assert.equal(list.toArray()[0], 22);
            chai.assert.equal(list.toArray()[1], 11);
            chai.assert.equal(list.toArray()[2], 33);
            list.changePosition(2,0);
            chai.assert.equal(list.toArray()[0], 33);
            chai.assert.equal(list.toArray()[1], 22);
            chai.assert.equal(list.toArray()[2], 11);
        });
    });

    describe('#shuffle', function() {
        const list = new HashList([11,22,33,44,55,66]);

        it('shuffle', function() {
            list.shuffle();
            const arr = list.toArray();
            chai.assert.equal(arr[0] === 11, false);
            chai.assert.equal(arr.indexOf(11) > 0, true);
        });
    });

    describe('#toArray', function() {
        it('Retuns new array each time', function() {
            chai.assert.equal(list.toArray() !== list.toArray(), true);
        });

        it('Retuns new array with right length', function() {
            chai.assert.equal(list.toArray().length, 3);
        });
    });

    describe('#deleteElement', function() {
        const list = new HashList([11,22,33]);

        it('Deleting all elements one by one', function() {
            const deleted1 = list.deleteElement(1);
            chai.assert.equal(deleted1, 22);
            chai.assert.equal(list.length, 2);
            chai.assert.equal(list.toArray()[0], 11);
            chai.assert.equal(list.toArray()[1], 33);

            const deleted2 = list.deleteElement(0);
            chai.assert.equal(deleted2, 11);
            chai.assert.equal(list.length, 1);
            chai.assert.equal(list.toArray()[0], 33);

            const deleted3 = list.deleteElement(0);
            chai.assert.equal(deleted3, 33);
            chai.assert.equal(list.length, 0);
        });

    });

    describe('#deleteElementById', function() {
        const list = new HashList([11,22,33]);

        it('Deleting', function() {
            const deleted1 = list.deleteElementById(list.getId(1));
            chai.assert.equal(deleted1, 22);
            chai.assert.equal(list.length, 2);
            chai.assert.equal(list.toArray()[0], 11);
            chai.assert.equal(list.toArray()[1], 33);
        });

    });

    describe('#getElementCopy', function() {

        it('Make copy of primitive', function() {
            const list = new HashList([11,22,33]);
            const cloned = list.getElementCopy(1);
            chai.assert.equal(cloned == 22, true);
        });

        it('Make copy of object', function() {
            const elem = {
                data1: "value1",
                data2: false
            };
            const list = new HashList([11, elem]);
            const cloned = list.getElementCopy(1);
            chai.assert.equal(cloned == elem, false);
            chai.assert.equal(cloned.data1 === "value1", true);
            chai.assert.equal(cloned.data2 === false, true);
        });

    });


});