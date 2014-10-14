var keys = require('when/keys')
var assign = require('object-assign')
var StatefulContext = module.exports = function StatefulContext() {
  this.set = this.set.bind(this)
}
StatefulContext.prototype.set = function(promises) {
  return keys.all(promises).tap(assign.bind(null, this))
}
