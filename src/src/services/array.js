(function() {
   domain.service("$array", ['$http'],
      function($http) {
         return function() {
            var array = [];
            array.fetch = function(url, params) {
               return $http.get(url, params).then(function(list) {

                  array.splice(0, array.length);
                  if (_.isArray(list)) {
                     _.each(list, function(item) {
                        array.push(item);
                     });
                  }
               })
            }
            return array;
         }
      })
})();
