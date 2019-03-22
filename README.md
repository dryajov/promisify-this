# Promisify anything preserving `this`

> Simple promisify that works on object instances preserving this

## Why?

Many existing libraries loose the `this` binding, others would wrap the object and loose `typeof` and `instanceof` functionality, yet others would modify the object in place breaking it all together. This  library uses proxies to lazily intercept calls to instance methods and functions.

NOTE: There might be some edge cases where it still breaks, so far I'm not aware of any, if you run into one, please open an issue.

## API

- `promisify(instance [, this], )` - promisify a function, object literal or a class instance, optionally using an alternative `this`. Instance methods are promisified lazily, which allows promisifying large objects without much initial overhead.
  - `instance` - the instance to promisify, can be object, function or a class instance. 
    - All functions and methods are assumed to be in standard callback style, e.g. `function(...args, callback)` where `callback` takes an `error` as its first argument. 
  - `this` optional - `this` to call the methods with
  - `promisifyFn` optional (boolean, default `false`) - if `true` will treat the passed instance as a callable function.

## Usage

```js
(async () => {
  const promisify = require('promisify-this')

  class MyClass {
    constructor (d) {
      this.d = d
    }
    fn (p1, p2, cb) {
      return cb(null, `called with ${p1} ${p2} ${this.d}`)
    }
  }

  const mP = promisify(new MyClass('d'))
  const res = await mP.fn('a', 'b')
  console.log(res)
  // prints 'called with a b d'
})()
```

Enjoy!

## Licence

MIT
