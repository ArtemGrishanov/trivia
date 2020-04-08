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
      chai.assert.equal(o.oneString, 'abc', 'String default value')

      o = n.process({ oneString: 'verylongstring_verylongstring' })
      chai.assert.equal(o.oneString, 'verylongst', 'Max length normalization')

      o = n.process({ oneString: '' })
      chai.assert.equal(o.oneString, 'abc', 'Min length normalization')
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
      chai.assert.equal(o.enstr, 'center', 'String default value')

      o = n.process({ enstr: 'illegal' })
      chai.assert.equal(o.enstr, 'center', 'Only enum values')

      o = n.process({ enstr: 'right' })
      chai.assert.equal(o.enstr, 'right', 'Only enum values')

      const s2 = new DataSchema({
        enstr: {
          type: 'string',
          enum: ['true', 'false', '42'],
          default: 'true',
        },
      })
      const n2 = new Normalizer(s2)

      let o2 = n2.process({ enstr: 42 })
      chai.assert.equal(o2.enstr, '42', 'Number being casted to string')

      o2 = n2.process({ enstr: false })
      chai.assert.equal(o2.enstr, 'false', 'boolean being casting to string')
    })

    it('Schema validation', function () {
      chai
        .expect(() => {
          new DataSchema({
            oneString: {
              type: 'string',
              min: 1, // illegal attribute
              max: 10, // illegal attribute
              default: 'norm',
            },
          })
        })
        .to.throw(Error, 'invalid attribute')

      chai
        .expect(() => {
          new DataSchema({
            oneString: {
              type: 'string',
              // no default attr
            },
          })
        })
        .to.throw(Error, '"default" is missed')
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
      chai.assert.equal(o.boo, true, 'Boolean default value when undefined')

      o = n.process({ boo: null })
      chai.assert.equal(o.boo, false, 'Null considered as false')

      o = n.process({ boo: false })
      chai.assert.equal(o.boo, false)

      o = n.process({ boo: 'false' }) // special case string 'false' must be considered as boolean false
      chai.assert.equal(o.boo, false)

      const s2 = new DataSchema({
        boo: {
          type: 'boolean',
          default: 'parsed as true',
        },
      })
      const n2 = new Normalizer(s2)
      let o2 = n2.process({})
      chai.assert.equal(o2.boo, true, 'Boolean default value')
    })

    it('Schema validation', function () {
      chai
        .expect(() => {
          new DataSchema({
            boo: {
              type: 'boolean',
              min: 1, // illegal attribute
              default: true,
            },
          })
        })
        .to.throw(Error, 'invalid attribute')
    })
  })
})
