(function(){
   var scope = {};
   domain.register("$root", function(){
      return scope;
   })
})();
