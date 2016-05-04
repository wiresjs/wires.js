describe("Show", function() {
   var cls = function() {

   }
   var $scope = new cls();
   before(useSchema('tests/show/index.html', $scope));

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
