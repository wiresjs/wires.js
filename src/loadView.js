(function(){
   var _cache = {};
   domain.service("$loadView", ['$parseHTML', '$http'],function($parseHTML, $http){
      return function(path){
         return new Promise(function(resolve, reject){
            if ( _cache[path] ){
               return _cache[path];
            }
            $http.getHTML(path).then(function(html){

               $parseHTML(html).then(function(structure){
                  
                  _cache[path] = structure;
                  return resolve(structure);
               })
            })
         })
      }
   })

})();
