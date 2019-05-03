'use strict'

import { Promisify, PromisifyAll } from './types'
export { Promisify, PromisifyAll } from './types'

type Promisified = <T>(...args: any[]) => Promise<T>
const makeAsync = <T extends Function>(fn: T, _this: any): Promisified => {
  return function (...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      fn.call(_this, ...args, (err: Error, res: any) => {
        if (err) return reject(err)
        return resolve(res)
      })
    })
  }
}

export default function promisify<T extends Function> (methods: T): Promisify<T>
export default function promisify<
  T extends { [K in keyof T]: T[K] }
> (methods: T, promisifyFn?: boolean | T): PromisifyAll<T>
export default function promisify<T> (
  methods: T,
  _this: T | boolean = methods,
  promisifyFn: boolean = true): Promisify<T> | T {
  if (!methods) {
    throw new Error('missing object or function to promisify')
  }

  // tslint:disable-next-line: strict-type-predicates
  if (typeof _this === 'boolean') {
    promisifyFn = _this
    _this = null as any // we do want to clean it up here
  }

  // tslint:disable-next-line: strict-type-predicates
  if (typeof methods === 'function' && promisifyFn) {
    return new Proxy(methods, {
      apply (target, thisArg, args) {
        return makeAsync(methods, _this || methods)(...args)
      }
    }) as T
  }

  if (methods.constructor && _this) {
    const Clazz = methods.constructor
    if (!(_this instanceof Clazz)) throw new Error('this override should be instanceof `instance`!')
  }

  const asyncMethods = {}
  const handler = {
    get (target, prop) {
      if (typeof target[prop] !== 'function' || prop === 'constructor') {
        return target[prop]
      }

      // generate async methods lazily
      if (!asyncMethods[prop]) {
        asyncMethods[prop] = makeAsync(target[prop], _this || methods)
      }
      return asyncMethods[prop]
    }
  }

  return new Proxy(methods, handler)
}
