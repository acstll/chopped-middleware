# Chopped Middleware

This is an implementation of [Redux](http://github.com/rackt/redux) [Middleware](http://rackt.github.io/redux/docs/advanced/Middleware.html). Built to work with [Chopped Redux](http://github.com/acstll/chopped-redux) but Redux-compatible.

Middleware are callbacks that fire in-between a `dispatch(action)` call and the `update(state, action)` call that follows. They receive the dispatched `action` so you can deal with it, before the state updates.

*Notes:*
- Redux-compatible means you can use Chopped Middleware with Redux (as of 1.0), but Redux userland middleware obviously won't work with this implementation.
- In Chopped Redux the `reducer` function is called `update`.


### Signature of a middleware function

```js
function (action, next) {
  // this.dispatch
  // this.getState
  next()
}
```

## Install

With npm do:

```bash
npm install acstll/chopped-middleware --save
```

This is not yet on the npm registry.

## Usage

```js
var middleware = require('chopped-middleware')
var createStore = require('chopped-redux')

var store = createStore(update)

// Apply middleware fn1 and fn2
middleware(store, fn1, fn2)
```

### Shortcut

```js
var store = middleware(createStore(update), fn1, fn2)
```

### Flexible alternative

```js
var store = createStore(update)
var use = middleware(store) // only pass the `store`
use(fn1, fn2)
// later..
use(fn3)
```

### Store Enhancer

There's an `applyMiddleware` function available that works just as the one in Redux.

```js
var applyMiddleware = require('chopped-middleware/applyMiddleware')
var createStore = require('redux')

var createStoreWithMiddleware = applyMiddleware(fn1, fn2)(createStore)
var store = createStoreWithMiddleware(reducer)
```

### With middleware you can…

- `getState()` *before* and *after* the state update
- Transform the `action` object
- Skip dispatching
- Call `dispatch(newAction)` and have the new action go through the chain

and they work asyncly.

#### `getState()`

```js
function (action, next) {  
  this.getState() // returns state before the update
  next() // state updates at this point
  this.getState() // returns state after..
}
```

#### Tranforms

The middleware chain is handled by the [`step.js`](http://npm.im/step.js) module internally. So every middleware callback receives the same `action` object. You can mutate it, or replace it completely.

```js
// Mutate, add `foo` prop
function (action, next) {
  action.foo = 'bar'
  next()
}

// Replace, original action gets lost
function (action, next) {
  var newAction = { foo: bar }
  // first argument is for node-style errors, so `null` means OK
  next(null, newAction) // next middleware receives `newAction`
}
```

#### Skip dispatching

You can abort the state update by calling `next` by passing anything other than `null` as first argument.

```js
// State will never update
function (action, next) {
  next(new Error('Forget it'))
}
```

#### Call new `dispatch`

You can call `dispatch` from within middleware. That new action will go through the middleware chain from the top. (Be careful with loops.)

```js
function (action, next) {
  if (action.foo) {
    this.dispatch(bar)
    return // stop the chain
  }
  next() // continue otherwise
}
```

## License

MIT
