# Promisify anything preserving `this`

> Simple promisify that works on object instances preserving this

## API

- `promisify(instance, [this])` - promisify a function, object literal or an instance, optionally using an alternative `this`.
  - `instance` - the instance to promisify, can be object, function or a class instance
  - an optional `this` to call the methods with

## Usage

```js
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
  console.log('called with a b d')
```

Enjoy!
