(function() {

   domain.register("$a", function() {
      return "this is a";
   });

   domain.register("$b", ["$a"], function(pukka) {
      return "BBB " + pukka;
   });


   domain.register("$test", function() {
      return "hello"
   });
   /*

   domain.register("$other", function() {
      return new Promise(function(resolve, reject) {
         setTimeout(function() {
            resolve({
               test: 1
            })
         }, 1000)
      })
   });



   domain.require(['$test', '$other'],function($test, $other) {
      console.log("**********")
   })



   domain.require(['$test'],function($test, $other) {
      console.log("**********")
   })*/

   domain.service("$pukka", function(){
      return "pukka"
   })
   domain.service("$something",function($params, $pukka) {
      console.log("params are", $params, $pukka)
   })
   domain.require(['$something'], {$params : { target : {"hello": 1} }},function($a) {
      console.log("**********")
   })

   domain.service("attrs.one", function(){
      return "YES, this is attrs.one"
   })

   domain.service("attrs.two", function(){
      return new Promise(function(resolve, reject){
         setTimeout(function(){
            return resolve({ message : "Async service 2"})
         },100)
      })
   })

   // domain.requirePackage("attrs").then(function(allAttrs){
   //    console.log(allAttrs)
   // })
   var counter = 0;
   var aa = setInterval(function(){
      if ( counter === 50){
         clearInterval(aa);
      }

      domain.service("attrs.one", function(){
         return "YES, this is attrs.one"
      })

      domain.require(function($b) {
         console.log("b is", $b)
      })

      // var a = [1, 2, 3];
      // domain.each(a, function(num) {
      //    if (num === 2) {
      //       return new Promise(function(resolve, reject) {
      //          setTimeout(function() {
      //             console.log(num)
      //             resolve("hello")
      //          }, 500)
      //       })
      //    } else {
      //       console.log(num)
      //       return num;
      //    }
      // }).then(function(results) {
      //    console.log(results)
      // })
   },1000)
})();
