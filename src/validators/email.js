domain.service("validators.testEmail", function() {
   return {
      cls: "ws-failed",
      validate: function(param) {
         var isValid = /(.+)@(.+){2,}\.(.+){2,}/.test(this.str);
         if (!isValid) {
            return "Email is not valid";
         }
      }
   };
});
