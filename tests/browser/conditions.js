describe("Conditions", function() {
   var cls = function() {

   }
   var $scope = new cls();
   before(useSchema('tests/conditions/index.html', $scope));

   it("Should not be there (variable is absent)", function(done) {
      $scope.user = {
         name: "John"
      }
      check("#c").then(function(el) {
         el.exists(false);

         done();
      }).catch(done);
   });

   it("Should not be there (variable is there but condition is falsey)", function(done) {
      $scope.user = {
         name: "John",
         age: 49
      }
      check("#c").then(function(el) {
         el.exists(false);

         done();
      }).catch(done);
   });

   it("Should be there", function(done) {
      $scope.user = {
         name: "John",
         age: 49
      }
      $scope.user.age++;
      setTimeout(function() {
         $scope.user.age++;
      }, 1)

      check("#c").then(function(el) {
         el.exists(true);
         el.html('John is 51')
         done();
      }).catch(done);
   });

})
