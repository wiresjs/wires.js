domain.service("controllers.Animation", function(Controller, $array, $form, $resource, $restEndPoint, WiresValidation) {
   return Controller.extend({
      _view: 'animation.html',
      initialize: function() {
         var self = this;
         self.users = $array([{
            name: "ivan"
         }, {
            name: "bang"
         }]);

         self.form = $form();

         self.validation = {};

      },
      create: function() {
         var self = this;
         self.users.push(self.form.$getAttrs());
         self.form.$reset();
      }
   });
});
