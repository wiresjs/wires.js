require(__dirname + "/../dist/build.js");
var realm = require('realm-js');
var should = require('should');

describe('Directiv', function() {
   var _Directive;
   before(function(done) {
      return realm.require("wires.core.Directive", function(Directive) {
         _Directive = Directive;
         done();
      }).catch(done)
   });
   it('Should ', function() {
      console.log(_Directive);
   });

});
