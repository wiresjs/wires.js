(function(){

   domain.service("$loadView",function(){
      return function(view){
         
         return new Promise(function(resolve, reject){
            if (window.__wires_views__[view] ){
               return resolve(window.__wires_views__[view]);
            }
            return resolve([]);
         })
      }
   })

})();
