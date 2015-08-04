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

      //self.form.age = 2;
      this.ages = [{
         value: 1,
         age: "1 year"
      }, {
         value: 2,
         age: "2 year"
      }, {
         value: 3,
         age: "3 years"
      }]
      self.users = $array("/api/user/:_id");


      self.form.ids =["id1_trolollo"];
      this.item1 = { id : "num1", title : "num1" };
      this.item2 = { id: "num2", title : "num2"};
      this.item3 = { id :"num3", title : "num3"};

      this.items = [this.item1, this.item2, this.item3]

      window.form = self.form;
      this.some = $resource("/api/user/:_id");

      //this.some.$fetch({_id :"55bd306657d75939c5ef50d4"});

      self.users.$fetch();
      self.create = function() {
         self.users.$add(self.form)
         console.log(self.form)
         self.form.$reset();
      }

      window.ctrl = this;
   }]
})
