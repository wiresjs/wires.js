require(__dirname + "/../dist/build.js");
var domain = require('wires-domain');
var should = require('should');

describe('WiresUtils', function() {
   var _Directive;
   before(function(done) {
      return domain.require(function(Directive) {
         _Directive = Directive;
         done();
      }).catch(done)
   });
   it('Should ', function() {
      console.log(_Directive);
   });

});
