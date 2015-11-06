domain.service("controllers.Base",  function(Alert, $pushState) {
   return ['base.html', function() {
      this.runka = "hello";
      var self = this;
      self.data = {
         name: "sukka"
      };
      window.a = this;
      //   self.satana = false;
      self.data.selected = "";
      self.dates = [{
         value: "hello item1"
      }, {
         value: "hello item2"
      }];

      self.data.$changed = function(key, old, n) {
         console.log(key, old, n);
      };
      this.change = function() {
         self.data = {
            name: "PUKKA"
         };

      };
      self.forceParams  = function(){
          $pushState.force({hello : "world"})
      }
      self.mergeParams  = function(){
          $pushState.merge({ololo : "trololo"})
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
