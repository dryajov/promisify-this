'use strict'

module.exports = (methods, _this) => {
  if (!_this) {
    _this = methods
  }

  if (methods.constructor) {
    const Clazz = methods.constructor
    if (!(_this instanceof Clazz)) throw new Error('methods should be an instance of this!')
  }

  const makeAsync = (fn, __this) => {
    return async function () {
      const args = Array.prototype.slice.call(arguments)
      return new Promise((resolve, reject) => {
        fn.call(__this, ...args, (err, res) => {
          if (err) return reject(err)
          return resolve(res)
        })
      })
    }
  }

  if (typeof methods === 'function') {
    return makeAsync(methods)
  }

  const asyncMethods = {}
  const handler = {
    get (target, prop, receiver) {
      if (typeof target[prop] !== 'function') {
        return Reflect.get(...arguments)
      }

      // generate async methods lazily
      if (!asyncMethods[prop]) {
        asyncMethods[prop] = makeAsync(target[prop], target)
      }
      return asyncMethods[prop]
    }
  }

  return new Proxy(methods, handler)
}
