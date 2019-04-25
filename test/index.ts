'use strict'

import test from 'tape';
import promisify from '../src'

test('function', async (t) => {
  function fn(cb?) {
    return cb(null, `called`)
  }

  const fnP = promisify(fn)
  const res = await fnP()
  t.isEqual(res, 'called')
  t.end()
})

test('=> function', async (t) => {
  const fn = (cb?) => {
    return cb(null, `called`)
  }

  const fnP = promisify(fn)
  const res = await fnP()
  t.isEqual(res, 'called')
  t.end()
})

test('object literal', async (t) => {
  interface Methods {
    fn: (cb?) => Promise<any>
  }

  const methods: Methods = {
    fn: (cb) => {
      return cb(null, `called`)
    }
  }

  const mP = promisify(methods)
  const res = await mP.fn()
  t.isEqual(res, 'called')
  t.end()
})

test('function bag', async (t) => {
  function bag(cb) {
    cb(null, `not called`)
  }

  bag.fn = (a, b, cb?) => {
    cb(null, `called with ${a} ${b}`)
  }

  const mP = promisify(bag, false)
  const res = await mP.fn('a', 'b')
  t.isEqual(res, 'called with a b')
  t.end()
})

test('class instance', async (t) => {
  class Methods {
    a: string
    constructor() {
      this.a = 'prop a'
    }

    fn(cb?) {
      return cb(null, this.a)
    }
  }

  const mP = promisify(new Methods())
  const res = await mP.fn()
  t.isEqual(res, 'prop a')
  t.end()
})

test('function with params', async (t) => {
  function fn(p1, p2, cb?) {
    return cb(null, `called with ${p1} ${p2}`)
  }

  const fnP = promisify(fn)
  const res = await fnP('a', 'b')
  t.isEqual(res, 'called with a b')
  t.end()
})

test('=> function with params', async (t) => {
  const fn = (p1, p2, cb?) => {
    return cb(null, `called with ${p1} ${p2}`)
  }

  const fnP = promisify(fn)
  const res = await fnP('a', 'b')
  t.isEqual(res, 'called with a b')
  t.end()
})

test('object literal with params', async (t) => {
  const methods = {
    fn: (p1, p2, cb?) => {
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
    fn(p1, p2, cb?) {
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
    d: string
    constructor(d) {
      this.d = d
    }
    fn(p1, p2, cb?) {
      return cb(null, `called with ${p1} ${p2} ${this.d}`)
    }
  }

  const mP = promisify(new Methods('d'))
  const res = await mP.fn('a', 'b')
  t.isEqual(res, 'called with a b d')
  t.end()
})

test('should throw if `this` is not the same type', async (t) => {
  class Class1 {
  }

  class Class2 {
  }

  t.throws(() => promisify(new Class1(), new Class2()), /this override should be instanceof `instance`!/)
  t.end()
})

test('should not throw if `this` is type of', async (t) => {
  class Class1 {
  }

  class Class2 extends Class1 {
  }

  t.doesNotThrow(() => promisify(new Class1(), new Class2()))
  t.end()
})

test('works with legacy classes (functions)', async (t) => {
  interface Methods {
    d: any
    new(): Methods
  }

  function Methods(this: Methods, d) {
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

test('should not throw if `this` is type of and using legacy classes (functions)', async (t) => {
  interface Class1 {
    new(): Class1
  }

  function Class1() { }

  function Class2(this: Class1) {
    Class1.call(this)
  }

  Class2.prototype = Object.create(Class1.prototype)

  t.doesNotThrow(() => promisify(new Class1(), new Class2()))
  t.end()
})

test('should not throw if `this` is type of and mixing legacy classes (functions) and class', async (t) => {

  class Class1 {}
  const class1: typeof Class1 = Class1

  class Class2 extends class1 {
  }

  t.doesNotThrow(() => promisify(new Class1(), new Class2()))
  t.end()
})

test('should bypass simple properties', async (t) => {
  class Class1 {
    p2: string
    constructor() {
      this.p2 = 'p2'
    }

    get p1() {
      return 'p1'
    }
  }

  const c = promisify(new Class1())
  t.isEqual(c.p1, 'p1')
  t.isEqual(c.p2, 'p2')
  t.end()
})

test('should allow overriding `this`', async (t) => {
  class Class1 {
    name: string
    constructor() {
      this.name = 'class1'
    }

    fn(cb) {
      return cb(null, this.name)
    }
  }

  class Class2 extends Class1 {
    constructor() {
      super()
      this.name = 'class2'
    }

    fn(cb?) {
      return cb(null, this.name)
    }
  }

  const c = promisify(new Class1(), new Class2())
  const res = await c.fn()
  t.isEqual(res, 'class2')
  t.end()
})

test('should be instanceof', async (t) => {
  class Class1 {
  }

  const c = promisify(new Class1())
  t.ok(c instanceof Class1)
  t.end()
})

test('should not mangle prototype', async (t) => {
  class Class1 {
  }

  const c = promisify(new Class1())
  t.isEqual(Object.getPrototypeOf(c), Class1.prototype)
  t.end()
})

test('should not mangle constructor name', async (t) => {
  class Class1 {
  }

  const c = promisify(new Class1())
  t.isEqual(c.constructor.name, Class1.name)
  t.end()
})

// NOTE: this isn't relevant in typescript, but it is in pure js
test('should not promisify undef ', async (t) => {
  const prom: any = promisify
  t.throws(() => prom(), 'missing object or function to promisify')
  t.end()
})

test('should not promisify null ', async (t) => {
  const prom = promisify
  t.throws(() => prom(null), 'missing object or function to promisify')
  t.end()
})
