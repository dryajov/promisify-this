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

#### Typescript

```typescript
import { promisify } from './src'

(async () => {
  class MyClass {
    d: string
    constructor(d: string) {
      this.d = d
    }
    fn(p1, p2, cb) {
      return cb(null, `called with ${p1} ${p2} ${this.d}`)
    }
  }

  const mP = promisify(new MyClass('d'))
  const res = await mP.fn('a', 'b')
  console.log(res)
  // prints 'called with a b d'
})()
```

#### Javascript

```js
(async () => {
  const { promisify } = require('promisify-this')

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

# VERSIONS 2.1.0 & 2.2.0 broke CommonJs compatibility

## TL;DR

> Either upgrade to version 3.0.0 **and** use a named export, as in:
>
> `import { promisify } from 'promisify-this'`
>
> or
>
> `const { promisify } = require('promisify-this')`
>
> or downgrade to version 2.0.2 to continue using the previous CommonJs default export pattern of:
>
> `const promisify = require('promisify-this)`
>
> Alternatively, you can continue using versions 2.1.0 & 2.2.0 (*note however, that this versions have been deprecated*) with the following syntax:
>
> `const {default: promisify} = require('promisify-this')`

## Typescript migration and breaking changes

This module has been rewritten in Typescript beginning with version 2.1.0. The previous pure js implementation relied on the CommonJs pattern of `module.exports = function(){}`. This pattern doesn't work well under the new ES6 modules spec, nor is it fully supported by Typescript as such. Versions `2.1.0` and `2.2.0` relied on the `default export` syntax which doesn't simply map to `module.exports = function(){}`, but adds a new entry - `default` in the exports object, this in turn, ends up mapping to `module.exports = { default: function(){} }` in CommonJs, which is not the intent and breaks compatibility.

Beginning with version `3.0.0` the `default export` has been removed in favor on named exports.

-------------------------

Enjoy!

## Licence

MIT
