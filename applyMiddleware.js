
var patch = require('./')
var slice = [].slice

// Redux "Store enhancer"
// http://rackt.github.io/redux/docs/Glossary.html#store-enhancer

module.exports = function applyMiddleware () {
  var fns = slice.call(arguments)

  return function (next) {
    return function (reducer, initialState) {
      var store = next(reducer, initialState)
      patch(store).apply(null, fns)

      return store
    }
  }
}
