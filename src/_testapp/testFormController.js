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

      var TestObject = function(number){
         this.number = number;
         this.age = this.number + " year";
      }
      var obj1 = new TestObject(1);
      var obj2 = new TestObject(2);
      var obj3 = new TestObject(3);

      self.form.age = obj3;
      this.ages = [obj1, obj2, obj3]
      self.users = $array("/api/user/:_id");


      self.form.ids =[];
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
