(function(){
   domain.service("$pathObject", function() {
      return function(path, scope) {
         // just in case converting it
         if (!_.isArray(path)) {
            path = path.split("\.");
         }

         var instance = scope;
         var property = null;
         _.each(path, function(key, index) {
            if (path.length - 1 === index) {
               // The last one
               property = key;
            } else {
               if (instance[key] !== undefined) {
                  instance = instance[key];
               } else {
                  instance[key] = {};
                  instance = instance[key];
               }
            }
         });
         return {
            update : function(newValue){
               instance[property] = newValue;
               return newValue;
            },
            value : instance[property],
            property : property,
            instance : instance
         };
      };
   });
})();
