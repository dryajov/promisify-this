# Async json rpc

> Simple transport agnostic JSON RPC module

## Why?

I wanted a simple transport agnostic RPC module that lets me use it with any duplex stream. I also wanted it to support basic class instance functionality, like inheritance, etc... This is it. 

It uses JSON RPC as the rpc standard and by default sends all traffic as JSON, however, this can be serialized with something more efficient like messagepack or cbor as the network representation. 

This module doesn't do any of that however, it leaves it to the user to decide which on the wire representation works better for its use case.

## Usage

> Client
```js
const stream = ... // get duplex stream

const methods = {
  sayHello: () => {} // just a stub
}

const rpc = createRpc({ stream, methods })

const hello = async () => {
  const res = await rpc.sayHello()
  console.log(res)
}

hello() // prints 'Hello!'
```

> Server
```js
const stream = ... // get duplex stream

const methods = {
  sayHello: async () => { return 'Hello!' }
}

createRpc({ stream, methods }) // listen for request
```

Enjoy!
