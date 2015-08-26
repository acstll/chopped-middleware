# Chopped Middleware

WIP

## Middleware should be able to:

- work asyncly
- `getState()` *before* and *after* dispatching (next)
- transform the `action` object
- skip dispatching
- call `api.dispatch(newAction)` and have the new action go through the chain

### Signature

```js
function (action, next) {
  // this.dispatch
  // this.getState
  next()
}
```

## License

MIT
