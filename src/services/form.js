(function() {
   domain.service("$form", ['$sanitize'], function($sanitize) {

      return function() {
         var form = {};
         form.$getAttrs = function() {
            return $sanitize(this);
         };
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
         };
         return form;
      };
   });
})();
