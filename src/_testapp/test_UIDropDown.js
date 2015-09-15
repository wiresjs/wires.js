domain.service("components.ui-dropdown", ['Controller'], function(Controller) {
   return Controller.extend({
      _view: "ui-dropdown.html",
      initialize: function(attrs) {
         console.log(attrs.data.getVariableValue());
         // var pukka = attrs[0]
         // console.log(pukka.getVariableValue())
         // console.log(value)
      }
   });
});
