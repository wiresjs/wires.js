domain.service("WiresValidation", function() {
   return Wires.Class.extend({
      initialize: function() {
         this.msg = '';
         this.cls = '';
      },
      // Simple email validation
      email: function(value) {
         if (!value || value.test(/^([\w._]+)@([\w_]+)\.([a-z]+)$/)) {
            return {
               msg: "Invalid email",
               cls: "ws-invalid"
            };
         }
      }
   });
});
