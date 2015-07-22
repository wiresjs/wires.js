// /list/:id
domain.register("$resource", function($http) {

   return {
      array: [],
      item: {},
      load: function(url, into) {
         var self = this;
         return $http.get(url).then(function(results) {
            return new Promise(function(resolve, reject) {
               if (_.isArray(results)) {
                  into.splice(0, into.length)
                  _.each(results, function(item) {
                     into.push(item);
                  })
               } else {
                  _.each(into, function(value, key) {
                     if (results[key]) {
                        into[key] = value;
                     } else {
                        delete into[key];
                     }
                  })
               }
               return resolve(results);
            });
         })
      }
   }
})
