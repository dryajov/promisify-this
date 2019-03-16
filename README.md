# Promisify anything preserving `this`

> Simple promisify that works on object instances preserving this

## API

- `promisify(instance, [this], [{skipPrivate: true, skipList: []}])` - promisify a function, object literal or an instance, optionally using an alternative `this`.
  - `instance` - the instance to promisify, can be object, function or a class instance
  - `this` optional - `this` to call the methods with
  - `options` optional - an options list
    - `skipPrivate` - should private (`_`) methods be skipped
    - `skipList` - a list of method names to not promisify

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
  const res = mP.fn('a', 'b')
  console.log(res)
  // prints 'called with a b d'
```

Enjoy!
