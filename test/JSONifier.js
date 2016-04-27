require(__dirname + "/../dist/build.js");
var realm = require('realm-js');
var should = require('should');
var _ = require("lodash")
describe('ViewCompiler', function() {
   var JSONifier;
   before(function(done) {
      return realm.require(['wires.compiler.JSONifier'], function(compiler) {
         JSONifier = compiler;
         done();
      }).catch(done)
   });

   it("Should compile a simple string", function() {
      JSONifier.htmlString('<div class="hello"><my-directive></my-directive><h1>Hello {{user.name}}</h1><ul><li>1</li><li></li></ul></div>');
   })

});
