
/*
  # Previous attempt

  function thunk (store, next) {
    return function (action) {
      if (typeof action == 'function') {
        action(store)
      } else {
        next(action)
      }
    }
  }
*/

module.exports = function patch (store) {
  var middleware = []
  var dispatch = store.dispatch

  store.dispatch = function (action) {
    action = action || {}
    var s = store
    var run = middleware.reduceRight(callback, dispatch)

    run(action)

    function callback (composed, fn) {
      var args = fn.length > 1 ? [s, composed] : [composed]
      return fn.apply(null, args)
    }
  }

  store.use = function () {
    var fns = [].slice.call(arguments)
    middleware = middleware.concat(fns)

    return this
  }

  return store
}
