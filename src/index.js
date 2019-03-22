'use strict'

const makeAsync = (fn, _this) => {
  return async function () {
    const args = Array.prototype.slice.call(arguments)
    return new Promise((resolve, reject) => {
      fn.call(_this, ...args, (err, res) => {
        if (err) return reject(err)
        return resolve(res)
      })
    })
  }
}

module.exports = (methods, _this = null, promisifyFn = true) => {
  if (!methods) return methods
  if (typeof _this === 'boolean') {
    promisifyFn = _this
    _this = null
  }

  if (!_this) {
    _this = methods
  }

  if (typeof methods === 'function' && promisifyFn) {
    return new Proxy(methods, {
      apply (target, thisArg, argumentsList) {
        return makeAsync(methods, _this)(...argumentsList)
      }
    })
  }

  if (methods.constructor) {
    const Clazz = methods.constructor
    if (!(_this instanceof Clazz)) throw new Error('this override should be instanceof `instance`!')
  }

  const asyncMethods = {}
  const handler = {
    get (target, prop, receiver) {
      // eslint-disable-next-line valid-typeof
      if (typeof target[prop] !== 'function' || prop === 'constructor') {
        return Reflect.get(...arguments)
      }

      // generate async methods lazily
      if (!asyncMethods[prop]) {
        asyncMethods[prop] = makeAsync(target[prop], _this)
      }
      return asyncMethods[prop]
    }
  }

  return new Proxy(methods, handler)
}
