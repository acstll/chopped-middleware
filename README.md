# Chopped Middleware

WIP

## Middleware should be able to:

- work asyncly
- `getState()` *before* and *after* dispatching (next)
- transform the `action` object
- skip dispatching
- call internal `dispatch(newAction)` and have the new action go through the chain

### Signature

```js
function (action, next) {
  // this.dispatch
  // this.getState
  next()
}
```

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

## License

MIT
