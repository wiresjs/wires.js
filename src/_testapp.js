domain.service("controllers.Base", function(Alert) {
   return ['base.html', function() {
      this.runka = "hello";
      var self = this;
      this.some = 'runka';
      this.ololo = function(path) {
         return {
            $watch: [path],
            $scope: self
         };
      };
      this.shit = function() {
         return "sdfsdf";
      };
      this.showAlert = function() {

         var alert = new Alert("Hello");
         alert.render();
      };
   }];
});

$(function() {
   domain.require(function($router) {

      $router.add('/:ctrl?/:action?/:id?', 'Base', [
         $router.state('/calendar', 'Calendar'),
         $router.state('/test', 'Test'),
         $router.state('/kukka', 'Kukka'),
         $router.state('/animation', 'Animation')
      ]);

      $router.start();
   });
});
