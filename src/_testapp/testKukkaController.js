domain.service("controllers.Kukka", function($array, $form, $resource, $restEndPoint) {
   return ['kukka.html', function() {


      window.ctrl = this;
      ctrl.users = [{name : "ivan"}, {name : "samuli"}]
   }]
})
