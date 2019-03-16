'use strict'

const test = require('tape')
const promisify = require('../src')

test('function', async (t) => {
  function fn (cb) {
    return cb(null, `called`)
  }

  const fnP = promisify(fn)
  const res = await fnP()
  t.isEqual(res, 'called')
  t.end()
})

test('=> function', async (t) => {
  const fn = (cb) => {
    return cb(null, `called`)
  }

  const fnP = promisify(fn)
  const res = await fnP()
  t.isEqual(res, 'called')
  t.end()
})

test('object literal', async (t) => {
  const methods = {
    fn: (cb) => {
      return cb(null, `called`)
    }
  }

  const mP = promisify(methods)
  const res = await mP.fn()
  t.isEqual(res, 'called')
  t.end()
})

test('class instance', async (t) => {
  class Methods {
    constructor () {
      this.a = 'prop a'
    }

    fn (cb) {
      return cb(null, this.a)
    }
  }

  const mP = promisify(new Methods())
  const res = await mP.fn()
  t.isEqual(res, 'prop a')
  t.end()
})

test('function with params', async (t) => {
  function fn (p1, p2, cb) {
    return cb(null, `called with ${p1} ${p2}`)
  }

  const fnP = promisify(fn)
  const res = await fnP('a', 'b')
  t.isEqual(res, 'called with a b')
  t.end()
})

test('=> function with params', async (t) => {
  const fn = (p1, p2, cb) => {
    return cb(null, `called with ${p1} ${p2}`)
  }

  const fnP = promisify(fn)
  const res = await fnP('a', 'b')
  t.isEqual(res, 'called with a b')
  t.end()
})

test('object literal with params', async (t) => {
  const methods = {
    fn: (p1, p2, cb) => {
      return cb(null, `called with ${p1} ${p2}`)
    }
  }

  const mP = promisify(methods)
  const res = await mP.fn('a', 'b')
  t.isEqual(res, 'called with a b')
  t.end()
})

test('class instance with params', async (t) => {
  class Methods {
    fn (p1, p2, cb) {
      return cb(null, `called with ${p1} ${p2}`)
    }
  }

  const mP = promisify(new Methods())
  const res = await mP.fn('a', 'b')
  t.isEqual(res, 'called with a b')
  t.end()
})

test('class instance with constructor params', async (t) => {
  class Methods {
    constructor (d) {
      this.d = d
    }
    fn (p1, p2, cb) {
      return cb(null, `called with ${p1} ${p2} ${this.d}`)
    }
  }

  const mP = promisify(new Methods('d'))
  const res = await mP.fn('a', 'b')
  t.isEqual(res, 'called with a b d')
  t.end()
})

test('should throw if this is not the same type', async (t) => {
  class Class1 {
  }

  class Class2 {
  }

  t.throws(() => promisify(new Class1(), new Class2()), /methods should be an instance of this!/)
  t.end()
})

test('should not throw if this is type of', async (t) => {
  class Class1 {
  }

  class Class2 extends Class1 {
  }

  t.doesNotThrow(() => promisify(new Class1(), new Class2()))
  t.end()
})

test('works with legacy classes (functions)', async (t) => {
  function Methods (d) {
    this.d = d
  }

  Methods.prototype.fn = function (p1, p2, cb) {
    return cb(null, `called with ${p1} ${p2} ${this.d}`)
  }

  const mP = promisify(new Methods('d'))
  const res = await mP.fn('a', 'b')
  t.isEqual(res, 'called with a b d')
  t.end()
})

test('should not throw if this is type of and using legacy classes (functions)', async (t) => {
  function Class1 () {
  }

  function Class2 () {
    Class1.call(this)
  }

  Class2.prototype = Object.create(Class1.prototype)

  t.doesNotThrow(() => promisify(new Class1(), new Class2()))
  t.end()
})

test('should not throw if this is type of and mixing legacy classes (functions) and class', async (t) => {
  function Class1 () {
  }

  class Class2 extends Class1 {
  }

  t.doesNotThrow(() => promisify(new Class1(), new Class2()))
  t.end()
})

test('should be instanceof', async (t) => {
  function Class1 () {
  }

  const c = promisify(new Class1())
  t.ok(c instanceof Class1)
  t.end()
})
