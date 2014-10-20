StatefulContext
===============

A stateful context to DRY up your promise chain.

Often times, especially in specs, there are times that you have to deal with multiple values in a promise chain.

* [Example](#a-gentle-example)
* [Usage](#usage)
* [API](#api)


A Gentle Example
----------------

Let's say you are building a Twitter-like application and want to test that following works, that is, when A follows B and B updates a status, A should see B's status in the timeline.

One approach is to nest these promises, resulting in a promise hell instead of a callback hell.

```javascript
Promise.all([createUser('foo'), createUser('bar')])
.then(function([user1, user2]) {
  return user1.follow(user2)
  .then(function() {
    return user2.updateStatus('My status')
  })
  .then(function(status) {
    return user1.getTimeline()
    .then(function(timeline) {
      expectTimelineToContainStatus(timeline, status)
      done()
    })
  })
})
```

Another approach is to pass all the variables we need in the future steps through the promise chain. Notice how you have to maintain the correct order of values and parameters in each step.

```javascript
Promise.all([createUser('foo'), createUser('bar')])
.then(function([user1, user2]) {
  return user1.follow(user2)
    .then(function() { return [user1, user2] })
})
.then(function([user1, user2]) {
  return user2.updateStatus('My status')
    .then(function(status) { return [user1, status] })
})
.then(function([user1, status]) {
  return [user1.getTimeline(), status]
})
.then(function([timeline, status]) {
  expectTimelineToContainStatus(timeline, status)
  done()
})
```

And yet another approach is to just store these variables as local variables. Notice how you have to create multiple variables and assigning them yourself.

```javascript
var user1, user2, status
Promise.all([createUser('foo'), createUser('bar')])
.then(function([_user1, _user2]) {
  user1 = _user1
  user2 = _user2
  return user1.follow(user2)
})
.then(function() {
  return user2.updateStatus('My status')
})
.then(function(_status) {
  status = _status
  return user1.getTimeline()
})
.then(function(timeline) {
  expectTimelineToContainStatus(timeline, status)
  done()
})
```

With a StatefulContext, this becomes:

```javascript
set({
  firstUser: createUser('foo'),
  secondUser: createUser('foo'),
})
.then(function() {
  return the.firstUser.follow(the.secondUser)
})
.then(function() {
  return set({ status: the.secondUser.updateStatus('My status') })
})
.then(function() {
  return set({ timeline: the.firstUser.getTimeline() })
})
.then(function() {
  expectTimelineToContainStatus(the.timeline, the.status)
  done()
})
```

And this StatefulContext is [implemented using 8 lines of code](index.js).


Usage
-----

```javascript
var StatefulContext = require('stateful-context')
var the = new StatefulContext(), set = the.set
```

### Use it in your mocha tests

```javascript
var StatefulContext = require('stateful-context')
beforeEach(function() {
  global.the = new StatefulContext()
  global.set = global.the.set
})
```

### More descriptive name, please

You might think that the name `the` and `set` are not quite descriptive.
You can also name it like this:

```javascript
beforeEach(function() {
  global.locals = new StatefulContext()
})
```

And the above example becomes:

```javascript
locals.set({
  firstUser: createUser('foo'),
  secondUser: createUser('foo'),
})
.then(function() {
  return locals.firstUser.follow(locals.secondUser)
})
.then(function() {
  return locals.set({ status: locals.secondUser.updateStatus('My status') })
})
.then(function() {
  return locals.set({ timeline: locals.firstUser.getTimeline() })
})
.then(function() {
  expectTimelineToContainStatus(locals.timeline, locals.status)
  done()
})
```


API
---

### StatefulContext.set(context, object)

Returns a promise that will resolve when all promises inside the `object` are resolved.
Also, the resolved values are added the `context` with corresponding key as a side effect.

If any of the promise in the object is rejected, the returned promise will be rejected.


### context = new StatefulContext()

Returns a new StatefulContext object.

```javascript
var the = new StatefulContext()
```

This object has a `.set` method on it, already bound to the created StatefulContext instance. Therefore, you can store that function in a variable and call it without having to worry about the value of `this`.


### context.set(object)

Equivalent to calling `StatefulContext.set(context, object)`.

__Warning:__ Don't call `set` with an object with a key called `set`! :)
