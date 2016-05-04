describe("My Test", function() {
   var cls = function() {}
   var $scope = new cls();

   before(useSchema('tests/watchers/index.html', $scope));

   it("Should modify a simpe node with a variable", function(done) {
      $scope.user = {
         name: "John"
      }

      check("#a").then(function(el) {
         el.html('John');

         done();
      }).catch(done);
   });

   it("Should modify a simpe node with a variable (setting many times)", function(done) {
      $scope.user = {
         name: "John"
      }
      $scope.user = {
         name: "Another user"
      }

      $scope.user.name = "Pekka";
      check("#a").then(function(el) {
         el.html('Pekka');

         done();
      }).catch(done);
   });

   it("Should modify a text node with a variable", function(done) {
      $scope.user = {
         name: "Ivan",
         age: 30
      }
      check("#b").then(function(el) {
         el.html('Hello Ivan 30');

         done();
      }).catch(done);
   });

   it("Should modify a text node with a variable (setTimeout)", function(done) {
      $scope.user = {
         name: "Ivan",
         age: 30
      }
      setTimeout(function() {
         $scope.user = {
            name: "John",
            age: 30
         }
         $scope.user.age = 10;
      }, 1)
      check("#b").then(function(el) {
         el.html('Hello John 10');

         done();
      }).catch(done);
   });
})
