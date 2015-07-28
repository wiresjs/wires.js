$(function() {
   domain.require(function($evaluate, $preCompile, $http, $loadView, $run) {
      // var input = $preCompile(
      //    "Hello, ololo {{ 0 + $user.age + $some() }} trololo my name is $user.name and i am $user.age and $pukka(1) "
      // );
      // window.scope = {
      //    user: {
      //       age: 30,
      //       name: "Ivan",
      //       myStatus: function(number) {
      //          return "Married" + number
      //       }
      //    },
      //    $buka: function() {
      //       return 1000;
      //    },
      //    some: function() {
      //       return 0;
      //    },
      //    pukka: function(date) {
      //
      //       return "Some pukka here " + date
      //    }
      // }
      // var result = $evaluate(input, {
      //    scope: scope,
      //    changed: function(str) {
      //       console.log(str);
      //    }
      // });



      // $loadView('/app/views/base.html').then(function(structure) {
      //    console.log("structure", structure)
      //    var Controller = function(){
      //       // this.user = {
      //       //   name : "ivan"
      //       // }
      //       this.color = "blue";
      //       var self = this;
      //       this.someAction = function(){
      //          self.user.name = "ivan";
      //          self.color = "green";
      //       }
      //
      //    }
      //    window.scope = new Controller();
      //    var start = new Date();
      //    $run({
      //       structure: structure,
      //       target : document.querySelector("section"),
      //       scope : scope
      //    })
      //    console.log(new Date() - start);
      // });


      $loadView('/app/views/repeaters.html').then(function(structure) {

         var Controller = function(){
            this.items = [{name : "ivan"}, {name : "bang"}]
         }
         var start = new Date();
         window.scope = new Controller();
         console.log(structure)
         $run({
            structure: structure,
            target : document.querySelector("section"),
            scope : scope
         })
         console.log("Rendered in", (new Date() - start), 'ms')
      });
   });
})
