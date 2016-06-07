require(__dirname + "/../../build/universal.js");
var realm = require('realm-js');
var should = require('should');

describe('VAriableExtractor', function() {
   var expressions;
   before(function(done) {
      return realm.require(['wires.expressions.AngularExpressions'], function(_AngularExpressions) {
         expressions = _AngularExpressions;
         done();
      }).catch(done)
   });

   it('Should extract simle object', function() {
      var r = expressions.extract('{"myName" : user.name === 1}');
      r.should.deepEqual({
         'user.name': {}
      })
   });

   it('Should extract simle object 2', function() {
      var r = expressions.extract('{"myName" : user.name === 1 && user.age = 1}');
      r.should.deepEqual({
         'user.name': {},
         'user.age': {}

      })
   });
   it('Should extract  object 2', function() {
      var r = expressions.extract('user.name === "user.something" && "hello.world" === user.world');

      r.should.deepEqual({
         'user.name': {},
         'user.world': {}
      })
   });
});
