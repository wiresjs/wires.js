(function(){
   domain.service("$restEndPoint", function(){
      return function(path, params){
         var params = params || {};
         var p = path.split("\/");
         var processedPath = [];
         _.each(p, function(item){
            var variable = item.match(/:(.+)/);
            if ( variable ){
               if ( params.hasOwnProperty(variable[1])) {
                  processedPath.push(params[variable[1]])
               }
            } else {
               processedPath.push(item);
            }
         });
         return processedPath.join("/");
      }
   })
})();
