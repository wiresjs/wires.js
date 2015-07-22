domain.service("controllers.BaseController",
   function($root, $params, $history) {
      return ["/app/views/state1/base.html -> #main", function(){

      }]
})

domain.service("controllers.HelloController",
   function($root, $params, $history) {
      return ["/app/views/state1/hello.html", function(){

      }]
})

domain.service("controllers.BaseController2",
   function($root, $params, $array, $history) {
      return ["/app/views/state2/base.html -> #main", function(){


         this.items = $array();
         this.items.fetch('/list');


         var self = this;
         this.add = function(){
            self.items.push({name : self.name});
            self.name = '';
         }
      }]
})

domain.service("controllers.HelloController2",
   function($root, $params, $history) {
      return ["/app/views/state2/hello.html", function(){

      }]
})
