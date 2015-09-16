(function() {
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
            update: function(newValue) {
               // If the target is object
               if (_.isPlainObject(instance[property])) {
                  // and we are trying to attach an object
                  // it's obvious we need to update values
                  // without overrides
                  if (_.isPlainObject(newValue)) {
                     _.each(newValue, function(v, k) {
                        if (k[0] !== "$") {
                           instance[property][k] = v;
                        }
                     });
                  }
               } else {
                  instance[property] = newValue;
               }
               return newValue;
            },
            value: instance[property],
            property: property,
            instance: instance
         };
      };
   });
})();
