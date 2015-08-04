(function() {
   domain.service("$form", function() {

      return function() {
         var form = {};

         // Filter out system and private  objects
         // $ - system
         // _ - private
         form.$getAttrs = function() {
            var attrs = {};
            _.each(this, function(v, k) {
               if (!k.match(/^(\$|_)/)) {
                  attrs[k] = v;

               }
            })
            return attrs;
         }
         form.$reset = function() {
            _.each(this, function(v, k) {
               if (!k.match(/^(\$|_)/)) {
                  if (_.isArray(this[k])) {
                     this[k].$removeAll();
                  } else {
                     this[k] = undefined;
                  }
               }
            }, this);
         }
         return form;
      };
   })

})();
