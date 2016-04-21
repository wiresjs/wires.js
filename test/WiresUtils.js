require('require-all')(__dirname + "/../src");
var domain = require('wires-domain');
var should = require('should');

describe('WiresUtils', function() {
   var utils;
   before(function(done) {
      return domain.require(function(WiresUtils) {
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
