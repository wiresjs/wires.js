domain.service("controllers.Animation", function($array, $form, $resource, $restEndPoint) {
   return ['animation.html', function() {
      var self = this;
      self.users = $array([{name : "ivan"}, {name : "bang"}]);
      self.form = $form();
      self.create = function(target) {
         
         target.element.$animate();
         self.users.push(self.form.$getAttrs());
         self.form.$reset();
      };
   }];
});
