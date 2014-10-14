var keys = require('when/keys')
var assign = require('object-assign')
module.exports = function StatefulContext() {
  this.set = function(promises) {
    return keys.all(promises).tap(assign.bind(null, this))
  }.bind(this)
}
