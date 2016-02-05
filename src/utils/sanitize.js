domain.service("$sanitize", function() {
   var sanitize = function(data) {
      var attrs = {};
      if (_.isString(data)) {
         return data;
      }
      if (_.isNumber(data)) {
         return data;
      }
      if (_.isBoolean(data)) {
         return data;
      }
      _.each(data, function(v, k) {
         if (v !== undefined && _.isString(k)) {
            if (!k.match(/^(\$)/)) {
               if (_.isArray(v)) {
                  attrs[k] = [];
                  _.each(v, function(item) {
                     attrs[k].push(sanitize(item));
                  });
               } else if (_.isPlainObject(v)) {
                  attrs[k] = sanitize(v);
               } else {
                  if (!(v instanceof Date)) {
                     attrs[k] = sanitize(v);
                  } else {
                     attrs[k] = v;
                  }
               }
            }
         }
      });
      return attrs;
   };
   return sanitize;
});
