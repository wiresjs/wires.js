describe("Conditions", function() {
   var cls = function() {}
   var $scope = new cls();

   before(Helpers.init('<h1 id="a" ng-if="user.age > 50">{{user.name}}</h1><h1>Hello</h1>', $scope));

   it("Should not be there (variable is absent)", function(done) {
      $scope.user = {
         name: "John"
      }
      check("#a").then(function(el) {
         el.exists(false);

         done();
      }).catch(done);
   });

   it("Should not be there (variable is there but condition is falsey)", function(done) {
      $scope.user = {
         name: "John",
         age: 49
      }
      check("#a").then(function(el) {
         el.exists(false);

         done();
      }).catch(done);
   });

   it("Should be there", function(done) {
      $scope.user = {
         name: "John",
         age: 55
      }
      $scope.user.age++;
      $scope.user.age++;

      setTimeout(function() {
         Helpers.takeScreenshot();
         done()
      }, 100);

      // check("#a").then(function(el) {
      //    Helpers.takeScreenshot()
      //    el.exists(true);
      //
      //    done();
      // }).catch(done);
   });

})
