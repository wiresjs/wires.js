domain.service("controllers.Animation", function($array, $form, $resource, $restEndPoint, WiresValidation) {
   return ['animation.html', function() {
      var self = this;
      self.users = $array([{
         name: "ivan"
      }, {
         name: "bang"
      }]);

      self.form = $form();

      self.validation = {};

      self.create = function(target) {

         self.users.push(self.form.$getAttrs());
         self.form.$reset();
      };
   }];
});
