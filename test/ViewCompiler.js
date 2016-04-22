require(__dirname + "/../dist/build.js");
var domain = require('wires-domain');
var should = require('should');
var _ = require("lodash")
describe('StringInterpolation', function() {
   var ViewCompiler;
   before(function(done) {
      return domain.require(['wires.compiler.ViewCompiler'], function(compiler) {
         ViewCompiler = compiler;
         done();
      }).catch(done)
   });

   it("Should compile a simple string", function() {
      ViewCompiler.htmlString('<h1>Hello World</h1>');
   })

});
