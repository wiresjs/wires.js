domain.service("controllers.Base", function(Alert) {
   return ['base.html', function() {
      this.runka = "hello";
      var self = this;
      self.data = {
         name: "sukka"
      };
      this.change = function() {
         self.data = {
            name: "PUKKA"
         }

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
