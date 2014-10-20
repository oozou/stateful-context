var keys = require('when/keys')
var assign = require('object-assign')
var StatefulContext = module.exports = function StatefulContext() {
  this.set = StatefulContext.set.bind(null, this)
}
StatefulContext.set = function(context, promises) {
  return keys.all(promises).tap(assign.bind(null, context))
}
