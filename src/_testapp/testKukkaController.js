domain.service("controllers.Kukka", function($array, $form, $resource, $restEndPoint) {
   return ['kukka.html', function() {
      this.users = [{name : "ivan"}, {name : "bang"}];
      this.someScope = {
         name : "Name from another scope"
      };
   }];
});
