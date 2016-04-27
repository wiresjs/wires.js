require(__dirname + "/../dist/build.js");
var realm = require('realm-js');
var should = require('should');

describe('WiresUtils', function() {
   var utils;
   before(function(done) {
      return realm.require(['wires.utils.DotNotation'], function(WiresUtils) {
         utils = WiresUtils;
         done();
      }).catch(done)
   });
   it('Should have a property (dot notation)', function() {
      var a = {
         b: {
            c: undefined
         }
      }

      utils.hasProperty(a, 'b.c').should.equal(true)
   });

   it('Should not have a property (dot notation)', function() {
      var a = {
         b: {
            c: undefined
         }
      }
      utils.hasProperty(a, 'b.c.d').should.equal(false);
   });

   it('Should have a property (array)', function() {
      var a = {
         b: {
            c: undefined
         }
      }

      utils.hasProperty(a, ['b', 'c']).should.equal(true)
   });

   it('Should not have a property (array)', function() {
      var a = {
         b: {
            c: undefined
         }
      }
      utils.hasProperty(a, ['b', 'c', 'd']).should.equal(false);
   });

});
