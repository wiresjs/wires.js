domain.service("$exec", ['$pathObject'],function($pathObject){
   return {
      func : function(stringFunction, scope){
         var result;
         try {
            var userFunc = eval("(function($){ return "+ stringFunction +"})");
            result = userFunc(scope);
         } catch(e){
            console.error("Error while evaluating " + stringFunction, e )
         }
         return result;
      },
      expression : function(expr, scope){
         var result;
         try {
            var userFunc = eval("(function($){ return "+ expr +"})");
            result = userFunc.bind(scope)();
         } catch(e){
            console.error("Error while evaluating " + expr, e )
         }
         return result;
      }
   }

})
