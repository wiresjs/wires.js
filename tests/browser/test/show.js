describe("Show", function() {
   var cls = function() {

   }
   var $scope = new cls();

   before(Helpers.init('<div id="a" ng-show="index > 5"></div>', $scope));

   it("Should be hidden", function(done) {
      check("#a").then(function(el) {
         el.exists(true);
         el.hidden(true)
         done();
      }).catch(done);
   });

   it("Should not be hidden", function(done) {
      $scope.index = 6;
      check("#a").then(function(el) {
         el.exists(true);
         el.hidden(false)
         done();
      }).catch(done);
   });

})
