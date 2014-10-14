var keys = require('when/keys')
var _    = require('underscore')
module.exports = function StatefulContext() {
  this.set = function(promises) {
    return keys.all(promises).tap(_.extend.bind(_, this))
  }.bind(this)
}
