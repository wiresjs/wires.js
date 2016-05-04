describe("Directive test", function() {
   var cls = function() {

   }
   var $scope = new cls();
   $scope.hello = 1;

   before(useSchema('tests/directives/index.html', $scope));

   it("Should initialize testing directive", function(done) {
      check("#a").then(function(el) {
         el.exists(true);
         el.html('<div><span>Hello from directive</span><div></div></div>')
         done();
      }).catch(done);
   });

   it("Should transclude elements into a directive testing directive", function(done) {
      check("#b").then(function(el) {
         el.exists(true);
         el.html('<div><span>Hello from directive</span><div><h1>transcluded element</h1></div></div>')
         done();
      }).catch(done);
   });

   it("Should work with conditions", function(done) {
      check("#c").then(function(el) {
         el.exists(false);
         done();
      }).catch(done);
   });

   it("Should show after coniditions value changed", function(done) {
      $scope.hello = 0;
      check("#c").then(function(el) {
         el.exists(true);
         el.html('<div><span>Hello from directive</span><div><h1>transcluded element</h1></div></div>')
         done();
      }).catch(done);
   });

})
