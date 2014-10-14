var assert = require('assert')
var when = require('when')
var StatefulContext = require('./')
var the = new StatefulContext()
var set = the.set
set({ value: 1, promise: when(2) })
.then(function() { return set({ sum: the.value + the.promise }) })
.then(function() {
  assert.equal(the.value, 1)
  assert.equal(the.promise, 2)
  assert.equal(the.sum, 3)
  console.log("\033[1;32m素晴らしい！\033[0m")
})
.done()
