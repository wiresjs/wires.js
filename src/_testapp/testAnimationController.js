domain.service("controllers.Animation", function($array, $form, $resource, $restEndPoint) {
   return ['animation.html', function() {
      var self = this;
      self.users = $array([{
         name: "ivan"
      }, {
         name: "bang"
      }]);
      self.form = $form();
      self.validation = {};

      self.form.$changed = function(key, oldvalue, newvalue) {
         console.log(key, newvalue);
      };
      self.create = function(target) {

         self.users.push(self.form.$getAttrs());
         self.form.$reset();
      };
   }];
});
