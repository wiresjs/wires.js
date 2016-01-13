(function() {
   domain.service("$resource", ['$restEndPoint', '$http', '$sanitize'], function($restEndPoint, $http, $sanitize) {
      return function(a, b) {
         var opts = {};
         var obj;
         var endpoint;

         if (_.isObject(a)) {
            obj = a || {};
            opts = b || {};
            endpoint = opts.endpoint;
         }
         if (_.isString(a)) {
            endpoint = a;
            obj = {};
         }
         var array = opts.array;

         obj.$apply = function(target) {
            var iterate = function(t, o) {
               _.each(t, function(value, key) {
                  if (_.isPlainObject(value)) {
                     if (_.isPlainObject(o[key])) {
                        iterate(value, o[key]);
                     } else {
                        o[key] = value;
                     }
                  } else if (_.isArray(value)) {
                     var currentArray = o[key];
                     if (_.isArray(currentArray)) {
                        currentArray.splice(0, currentArray.length);
                        _.each(value, function(v) {
                           currentArray.push(v);
                        });
                     } else {
                        o[key] = value;
                     }
                  } else {
                     o[key] = value;
                  }
               });
            };
            iterate(target, obj);
         };

         obj.$reset = function() {
            _.each(this, function(v, k) {
               if (!k.match(/^(\$|_)/)) {
                  this[k] = undefined;
               }
            }, this);
         };

         obj.$fetch = function(o) {

            return new Promise(function(resolve, reject) {
               if (endpoint) {
                  var pm = o || {};
                  var url = $restEndPoint(endpoint, pm);
                  $http.get(url, pm).then(function(data) {
                     obj.$apply(data);
                     return resolve(obj);
                  }).catch(function(e) {
                     return reject(e);
                  });

               }
            });
         };

         obj.$update = function() {
            obj.$err = undefined;
            return new Promise(function(resolve, reject) {
               if (endpoint) {
                  var url = $restEndPoint(endpoint, obj);
                  return $http.put(url, obj).then(resolve).catch(function(e) {
                     obj.$err = e.message && e.message.message ? e.message.message : e;
                     return reject(e);
                  });
               } else {
                  return resolve();
               }
            });
         };

         obj.$remove = function() {
            return new Promise(function(resolve, reject) {
               // Removing from the parent array
               if (endpoint) {
                  var url = $restEndPoint(endpoint, obj);
                  $http.delete(url).then(function() {
                     if (array) {
                        array.$remove(obj);
                     }
                     obj.$reset();
                     return resolve();
                  }).catch(function() {
                     return reject(e);
                  });
               } else {
                  if (array) {
                     array.$remove(obj);
                     return resolve();
                  }
               }
            });
         };
         return obj;
      };
   });

})();
