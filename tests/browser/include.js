describe("Include test", function() {
   var cls = function() {

   }
   var $scope = new cls();
   $scope.hello = 1;

   before(useSchema('tests/include/include.html', $scope));

   it("Should include a file if we have an attribute", function(done) {
      check("#a").then(function(el) {
         el.html("<h1>Hello World</h1>")
         done()
      }).catch(done)
   });

   it("Should include a file if we have a tag", function(done) {
      check("#b").then(function(el) {
         el.html("<h1>Hello World</h1>")
         done()
      }).catch(done)

   });

   it("Should include a file with truely condition", function(done) {
      check("#c").then(function(el) {
         el.html("<h1>Hello World</h1>")
         done()
      }).catch(done)

   });

   it("Should not include a file with falsey condition", function(done) {
      check("#d").then(function(el) {
         el.exists(false)
         done()
      }).catch(done)
   });

   it("Should include after a condition is true", function(done) {
      $scope.hello = 0;
      check("#d").then(function(el) {
         el.exists(true)
         done()
      }).catch(done)
   });

   it("Should revert after a condition is falsey", function(done) {
      $scope.hello = 1;
      check("#d").then(function(el) {
         el.exists(false)
         done()
      }).catch(done)
   });

})
