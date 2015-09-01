
var test = require('tape')
var createStore = require('chopped-redux')
var createReduxStore = require('redux').createStore

var middleware = require('./')
var applyMiddleware = require('./applyMiddleware')

function update (state, action) {
  state = state || 0

  switch (action.type) {
    case 'increment':
      state++
      break
    case 'decrement':
      state--
      break
  }

  return state
}

function thunk (action, store, next) {
  if (typeof action === 'function') {
    return action(store)
  }
  next()
}

test('API', function (t) {
  t.plan(5)

  function a (action, store, next) {
    t.ok(action, 'single call (x2)')
    next()
  }

  function b (action, store, next) {
    t.equal(action, 1, '`use` function (x3)')
    next()
  }

  // Single call
  // Returns `store` if arguments > 1
  var store1 = middleware(createStore(update), a, a)

  // `use` function
  // Returns `use` if arguments === 1
  var store2 = createStore(update)
  var use = middleware(store2)
  use(b)(b, b)

  store1.dispatch(true)
  store2.dispatch(1)
})

test('Signature', function (t) {
  t.plan(6)

  var store = middleware(createStore(update), test, pass)
  var asc = ''
  var desc = ''

  function test (action, store, next) {
    t.equal(typeof store.dispatch, 'function', '`store.dispatch` is there')
    t.equal(typeof store.getState, 'function', '`store.getState` is there')
    t.equal(action.foo, 'bar', 'action is passed in correctly')
    asc += 'A'
    next()
    desc += 'A'
  }

  function pass (action, store, next) {
    t.pass('`use` can take any number of functions')
    asc += 'B'
    next()
    desc += 'B'
  }

  store.dispatch({ foo: 'bar' })

  t.equal(asc, 'AB', 'middleware executes in the right order (asc)')
  t.equal(desc, 'BA', 'middleware executes in the right order (desc)')
})

test('`getState` works before and after dispatching (next)', function (t) {
  t.plan(2)

  var store = createStore(update)

  middleware(store)(function (action, store, next) {
    t.equal(typeof store.getState(), 'undefined', 'before..')
    next()
    t.equal(store.getState(), 1, 'after..')
  })

  store.dispatch({ type: 'increment' })
})

test('Actions can be transformed', function (t) {
  t.plan(1)

  var store = createStore(function (x) { return x })

  function transform (action, store, next) {
    action = {
      beep: 'boop'
    }
    next(null, action)
  }

  function confirm (action) {
    t.equal(action.beep, 'boop', 'ok')
  }

  middleware(store, transform, confirm)

  store.dispatch(null)
})

test('Can skip dispatching completely', function (t) {
  t.plan(3)

  var store = createStore(update, 9)
  var action = { type: 'increment' }

  store.dispatch(action)
  t.equal(store.getState(), 10, 'first check')

  middleware(store, function (action, store, next) {
    t.pass()
    next(new Error('Skip'))
  })

  store.dispatch(action)
  t.equal(store.getState(), 10, 'skipped..')
})

test('Internal `dispatch` calls go through the chain', function (t) {
  t.plan(3)

  var store = createStore(update, 4)
  var log = []

  function logger (action, store, next) {
    log.push(action)
    next()
  }

  function pass (action, store, next) {
    t.pass('passing.. (x1)')
    next()
    t.equal(store.getState(), 5, 'dispatch check')
  }

  middleware(store, logger, thunk, pass)

  store.dispatch(function (methods) {
    methods.dispatch({ type: 'increment' })
  })

  t.equal(log.length, 2, 'they do')
})

test('Redux and applyMiddleware', function (t) {
  t.plan(4)

  function pass (action, store, next) {
    t.pass('passing.. (x3)')
    next()
    t.equal(store.getState(), 1000, 'work')
  }

  var createStoreWithMiddleware = applyMiddleware(pass, thunk)(createReduxStore)
  var store = createStoreWithMiddleware(update, 999)

  store.dispatch(function (methods) {
    methods.dispatch({ type: 'increment' })
  })
})
