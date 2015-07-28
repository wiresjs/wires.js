(function(){
   domain.service("$watch", ['$pathObject', '$array'], function($pathObject, $array){
      return function(path, scope, cb){

         var pathObject = $pathObject(path, scope);
         var instance = pathObject.instance;
         var property = pathObject.property;

         if ( !instance.$watchers ){
            instance.$watchers = {};
         }
         if (!_.isObject(instance) && _.isString(property) )
            return;

         // prototyping array if it was not
         if ( _.isArray(instance) ){
            instance = $array(instance)
         }


         // detecting if property has been requested to be watched
         if ( !instance.$watchers[property] ){
            instance.$watchers[property] = [];
         }
         if ( cb ){
            instance.$watchers[property].push(cb);
         }
         if ( instance.$watchers[property].length === 1 ){
            instance.watch(property, function(a, b, newvalue) {
               _.each(instance.$watchers[property], function(_callback){
                  _callback(b, newvalue);
               });
               return newvalue;
   			});
         }

         return {
            remove : function(){
               var index = instance.$watchers[property].indexOf(cb);
               instance.$watchers[property].splice(index, 1);
               delete cb;
            },
            removeAll : function(){
               instance.unwatch(property);
               delete instance.$watchers;
            }
         };
      }
   });
})();
