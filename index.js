
var step = require('step.js')
var slice = [].slice

module.exports = function patch (store) {
  var middleware = []
  var dispatch = store.dispatch
  var i = 0

  function done (err, action) {
    if (err == null) dispatch(action)
    i = 0
  }

  store.dispatch = function (action) {
    action = action || {}
    var args = middleware.concat([done])

    if (i++ > 666) {
      throw new Error('A `dispatch` call inside a middleware is probably causing a loop.')
    }

    step(action, {
      getState: store.getState,
      dispatch: store.dispatch
    }).apply(null, args)

    return action
  }

  function use () {
    var fns = slice.call(arguments)
    middleware = middleware.concat(fns)

    return use
  }

  if (arguments.length === 1) {
    return use
  }

  use.apply(null, slice.call(arguments, 1))

  return store
}
