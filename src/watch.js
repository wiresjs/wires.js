(function() {
   var _proxies = {};
   domain.service("$watch", ['$pathObject', '$array', '$projectProxies'], function($pathObject, $array,
      $projectProxies) {
      return function(path, scope, cb) {

         var pathObject = $pathObject(path, scope);
         var instance = pathObject.instance;
         var property = pathObject.property;

         if (!instance.$watchers) {
            instance.$watchers = {};
         }

         // prototyping array if it was not
         if (_.isArray(instance)) {
            instance = $array(instance);
         }

         if (!_.isObject(instance) && _.isString(property))
            return;

         // detecting if property has been requested to be watched
         if (!instance.$watchers[property]) {
            instance.$watchers[property] = [];
         }
         if (cb) {
            instance.$watchers[property].push(cb);
         }
         if ( !instance.$subscribe ){
            instance.$subscribe = function(__cb){
               instance.$watchers[property].push(__cb);
            };
         }
         if (instance.$watchers[property].length === 1) {
            instance.watch(property, function(a, b, newvalue) {
               _.each(instance.$watchers[property], function(_callback) {
                  // Firing up handler if attached
                  if (instance.$changed !== undefined) {
                     instance.$changed(property, b, newvalue);
                  }
                  _callback(b, newvalue);
               });
               return newvalue;
            });
         }

         return {
            remove: function() {
               var index = instance.$watchers[property].indexOf(cb);
            },
            removeAll: function() {
               instance.unwatch(property);
               delete instance.$watchers;
            }
         };
      };
   });
})();
