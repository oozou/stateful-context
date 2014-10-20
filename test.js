var assert = require('assert')
var when = require('when')
var StatefulContext = require('./')

var the = { }
var set = StatefulContext.set

var locals = new StatefulContext()

set(the, { value: 1, promise: when(2) })
.then(function() { return set(the, { sum: the.value + the.promise }) })
.then(function() {
  assert.equal(the.value, 1)
  assert.equal(the.promise, 2)
  assert.equal(the.sum, 3)
})
.then(function() { return locals.set({ value: 6, promise: when(7) }) })
.then(function() { return locals.set({ answer: locals.value * locals.promise }) })
.then(function() {
  assert.equal(locals.value, 6)
  assert.equal(locals.promise, 7)
  assert.equal(locals.answer, 42)
})
.done(function() {
  console.log("\033[1;32m素晴らしい！\033[0m")
})

