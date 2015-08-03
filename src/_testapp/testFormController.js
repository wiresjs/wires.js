domain.service("controllers.Test", function($array, $form, $resource, $restEndPoint) {
   return ['test.html', function() {
      var self = this;
      var user1 = {
         name: "user1"
      }
      var user2 = {
         name: "user2"
      }
      self.form = $form();


      self.users = $array("/api/user/:_id");


      this.some = $resource("/api/user/:_id");

      //this.some.$fetch({_id :"55bd306657d75939c5ef50d4"});

      self.users.$fetch();
      self.create = function() {
         self.users.$add(self.form)
         self.form.$reset();
      }

      window.ctrl = this;
   }]
})
