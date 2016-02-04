domain.service("controllers.Base", function(Alert, $pushState, $array) {
   return ['base.html', function() {
      this.runka = "hello";
      var self = this;
      self.data = {
         text: "hello"
      };

      self.items = $array([{
         name: "hello"
      }, {
         name: "world"
      }]);

      this.add = function() {
         self.items.$prepend({
            name: "pukka"
         })
      }

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
