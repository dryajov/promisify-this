# Promisify anything preserving `this`

> Simple promisify that works on object instances preserving this

## API

- `promisify(instance [, this])` - promisify a function, object literal or a class instance, optionally using an alternative `this`. Methods on objects and instances are promisified lazily, which allows promisifying large objects without much initial overhead.
  - `instance` - the instance to promisify, can be object, function or a class instance
  - `this` optional - `this` to call the methods with

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
