(function() {
   domain.service("$form", function() {

      return function() {
         var form = {};

         // Filter out system and private  objects
         // $ - system
         // _ - private
         form.$normalize = function(data){
            var attrs = {};
            if ( _.isString(data) ){
               return data;
            }
            _.each(data, function(v, k) {
               if ( v !== undefined && _.isString(k) ){
                  if (!k.match(/^(\$|_)/)) {
                     if ( _.isArray(v) ){
                        attrs[k] = [];
                        _.each(v, function(item){
                           console.log(item, form.$normalize(item))
                           attrs[k].push(form.$normalize(item));
                        })
                     }
                     else if ( _.isObject(v) ){
                        attrs[k] = form.$normalize(v);
                     }
                     else {
                        attrs[k] = v;
                     }
                  }
               }
            });
            return attrs;
         }
         form.$getAttrs = function() {
            return form.$normalize(this);
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
