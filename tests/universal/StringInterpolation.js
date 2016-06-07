require(__dirname + "/../../build/universal.js");
var realm = require('realm-js');
var should = require('should');

describe('StringInterpolation', function() {
   var parser;
   before(function(done) {
      return realm.require(['wires.expressions.StringInterpolation'], function(StringInterpolation) {
         parser = StringInterpolation;
         done();
      }).catch(done)
   });

   it('Should parse a string', function() {
      var results = parser.parse("Hello {{ user.name }}");
      results.should.be.lengthOf(2);

      results[0].should.equal("Hello ");
      results[1].e.should.equal("user.name");
   });

   it('Should not give an error with wrong object', function() {
      var results = parser.parse({});
      results.should.be.lengthOf(0);
   });

   it('Should not give an error with empty string', function() {
      var results = parser.parse('');
      results.should.be.lengthOf(0);
   });

   it('Should parse a string and watch a simple string', function(done) {
      var parsed = parser.parse("INDEX {{ index }}");

      var model = parser.compile(parsed)
      var $scope = {
         index: 500
      }

      model($scope, {}, function(value) {

         value.should.equal("INDEX 500");
         done();
      })

      // results.should.be.lengthOf(2);
      // results[0].should.equal("Hello ");
      // results[1].e.should.equal("user.name");
   });

   it('Should compile and watch a string', function(done) {
      var model = parser.compile('Hello {{user.name}}, I am {{user.age}} years old');

      var $scope = {
         user: {
            name: "John",
            age: 20
         }
      }
      var results = [];
      var str = model($scope, function(compiled) {
         results.push(compiled);
      });
      setTimeout(function() {
         $scope.user = {
            name: "Jose",
            age: 21
         }
         $scope.user.age = 22;
         $scope.user = {
            name: "Peter",
            age: 28
         }
         setTimeout(function() {
            results[0].should.equal("Hello John, I am 20 years old")
            results[1].should.equal("Hello Peter, I am 28 years old")
            done();
         }, 10);
      }, 5);
   });
   //
   it('Should compile and watch a string with local variables', function(done) {
      var model = parser.compile('Hello {{user.name}}, I am {{loc.age}} years old');

      var $scope = {
         loc: {
            age: 1
         },
         user: {
            name: "John",
            age: 20
         }
      }
      var results = [];
      var str = model($scope, {
         loc: {
            age: 50
         }
      }, function(compiled) {
         results.push(compiled);
      });
      setTimeout(function() {
         $scope.user = {
            name: "Jose",
            age: 21
         }
         $scope.user.age = 22;
         $scope.user = {
            name: "Peter",
            age: 28
         }
         setTimeout(function() {
            results[0].should.equal("Hello John, I am 50 years old")
            results[1].should.equal("Hello Peter, I am 50 years old")
            done();
         }, 0);
      }, 0);
   });
   //
   it('Should compile multiple string and spit them at once', function(done) {
      var a = {
         name: "John"
      };
      var b = {
         name: "Bob"
      };
      var c = {
         name: "Jose"
      };
      var tpl = parser.compile('Hello {{name}}');

      var results = [];

      tpl(a, function(s) {
         results.push(s)
      });

      tpl(b, function(s) {
         results.push(s)
      });

      tpl(c, function(s) {
         results.push(s)
      });
      a.name = "John1";
      b.name = "Bob1";
      c.name = "Jose1"
      setTimeout(function() {

         results.should.deepEqual(['Hello John1', 'Hello Bob1', 'Hello Jose1'])
         done();
      }, 0)
   })

   it('Should yield without variables', function(done) {
      var tpl = parser.compile('Hello');
      var a = {}
      tpl(a, function(s) {
         s.should.equal("Hello");

         done();
      });
   });

});
