domain.service("controllers.Test", function($array, $form, $resource, $restEndPoint) {
   return ['test.html', function() {
      var self = this;
      var user1 = {
         name: "user1"
      };
      var user2 = {
         name: "user2"
      };
      self.form = $form();

      var TestObject = function(number){
         this.number = number;
         this.age = this.number + " year";
      };
      var date1 = new Date("12.11.1984");
      var date2 = new Date("12.12.1984");
      var date3 = new Date("12.13.1984");

      self.form.date = date3;
      this.dates = [date1, date2, date3];



      self.users = $array("/api/user/:_id");

      self.form.mySuperDate = new Date();
      self.form.ids =[];
      self.form.agree = true
      this.item1 = { id : "num1", title : "num1" };
      this.item2 = { id: "num2", title : "num2"};
      this.item3 = { id :"num3", title : "num3"};

      this.items = [this.item1, this.item2, this.item3];

      window.form = self.form;
      this.some = $resource("/api/user/:_id");

      //this.some.$fetch({_id :"55bd306657d75939c5ef50d4"});

      self.users.$fetch();
      self.create = function() {

         self.users.$add(self.form);
         console.log(self.form);
         self.form.$reset();
      };

      window.ctrl = this;
   }]
});
