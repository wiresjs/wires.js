domain.service("Alert", function(Controller) {
   return Controller.extend({
      _view: "alert.html -> body",
      initialize: function(msg) {
         this.msg = msg;
      }
   });
});
