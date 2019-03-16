'use strict'

function getAllFuncs (obj) {
  let props = []

  const filterFn = (e) => {
    return (typeof obj[e] === 'function' && e !== 'constructor')
  }

  do {
    props = props.concat(Object.getOwnPropertyNames(obj).sort()
      .filter(filterFn))
  } while ((obj = Object.getPrototypeOf(obj)) && obj !== Object.prototype) // eslint-disable-line

  return props.sort().filter((e, i, arr) => {
    return e !== arr[i + 1]
  })
}

module.exports = (methods, _this) => {
  if (!_this) {
    _this = methods
  }

  if (methods.constructor) {
    const Clazz = methods.constructor
    if (!(_this instanceof Clazz)) throw new Error('methods should be an instance of this!')
  }

  const makeAsync = (fn) => {
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

  if (typeof methods === 'function') {
    return makeAsync(methods)
  }

  getAllFuncs(methods).forEach((method) => {
    methods[method] = makeAsync(methods[method])
  })

  return methods
}
