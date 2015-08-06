(function() {
   var _cache = {};
   var getFunctionFromString = function(stringFunction){
      var userFunc;
      if (_cache[stringFunction]){
         userFunc = _cache[stringFunction];
      } else {
         userFunc = eval("(function($, target){ return " + stringFunction + "})");
         _cache[stringFunction] = userFunc
      }
      return _cache[stringFunction];
   }
   domain.service("$exec", ['$pathObject'], function($pathObject) {
      return {
         func: function(str, scope, targetScope) {
            var userFunc = getFunctionFromString(str)
            var result = userFunc.bind(scope)(scope,targetScope);

            return result;
         },
         expression: function(expr, scope, targetScope) {
            var userFunc = getFunctionFromString(expr)
            var result = userFunc.bind(scope)(scope, targetScope);
            return result;
         }
      }
   });
})();
