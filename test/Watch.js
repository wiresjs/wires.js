require('require-all')(__dirname + "/../src");
var domain = require('wires-domain');
var should = require('should');
var _ = require("lodash")
describe('StringInterpolation', function() {
   var $watch, $interpolate;
   before(function(done) {
      return domain.require(function(WatchBatch, StringInterpolation) {
         $watch = WatchBatch;
         $interpolate = StringInterpolation;
         done();
      }).catch(done)
   });

   // it('Should watch', function() {
   //    var data = $interpolate.parse('Hello {{user.name["hello"]}}, I am {{user.age}} years old');
   //    data = _.chain(data).map(function(item) {
   //       return item.v || false;
   //    }).compact().value();
   //
   //    $watch({
   //       batch: data,
   //       scope: {}
   //    }, function() {
   //       console.log("changed")
   //    });
   //
   // });

});
