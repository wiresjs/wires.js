domain.service("controllers.Base", function() {
   return ['base.html', function() {

   }]
})

$(function() {
   domain.require(function($router) {


      $router.add('/:ctrl?/:action?/:id?', 'Base', [
         $router.state('/calendar', 'Calendar'),
         $router.state('/test', 'Test')
      ])


      $router.start();
   })
})
