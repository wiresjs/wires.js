describe("Attributes", function() {
   var cls = function() {

   }
   var $scope = new cls();

   before(useSchema('tests/attributes/index.html', $scope));

   it("Should display at attribute", function(done) {
      check("#a").then(function(el) {
         el.attr("style", 'color:red')
         done()
      }).catch(done)
   });

   it("Should not have a system attribute", function(done) {
      check("#a").then(function(el) {
         el.attr("ng-show", undefined)
         el.attr("style", 'color:red')
         done()
      }).catch(done)
   });

   it("Should be inside ng-if", function(done) {
      $scope.index = 1;
      check("#b").then(function(el) {

         el.attr("style", 'color:blue')
         done()
      }).catch(done)
   });

   it("Should be changed accordingly", function(done) {
      $scope.index = 1;
      check("#c").then(function(el) {

         el.attr("style", 'left:1px')
         done()
      }).catch(done)
   });

   it("Should be changed accordingly (changed 3 times)", function(done) {
      $scope.index = 50;
      $scope.index = 55;
      $scope.index = 100;
      check("#c").then(function(el) {

         el.attr("style", 'left:100px')
         done()
      }).catch(done)
   });
})
