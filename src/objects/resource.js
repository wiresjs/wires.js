domain.service("$resource", ['$restEndPoint', '$http'], function($restEndPoint, $http){
   return function(a, b){
      var opts = {};
      var obj;
      var endpoint;

      if ( _.isObject(a) ){
         obj = a || {};
         opts = b || {};
         endpoint = opts.endpoint;
      }
      if (_.isString(a)){
         endpoint = a;
         obj = {};
      }

      var array = opts.array;

      obj.$reset = function(){
         _.each(this, function(v, k){
            if ( !k.match(/^(\$|_)/)){
              this[k] = undefined;
            }
         }, this);
      }
      

      obj.$fetch = function(o){

         return new Promise(function(resolve, reject){
            if (endpoint){
               var pm = o || {};
               var url = $restEndPoint(endpoint, pm);
               $http.get(url, pm).then(function(data){
                  _.each(data, function(v, k){
                     obj[k] = v;
                  })
                  return resolve(obj)
               }).catch(function(e){
                  return reject(e)
               })

            }
         })
      }

      obj.$remove = function(){
         return new Promise(function(resolve, reject){
            // Removing from the parent array
            if (endpoint){
               var url = $restEndPoint(endpoint, obj);
               $http.delete(url).then(function(){
                  if ( array ){
                     array.$remove(obj);
                  }
                  return resolve()
               }).catch(function(){
                  return reject(e)
               })
            } else {
               if ( array ){
                  array.$remove(obj);
                  return resolve();
               }
            }
         })

      }

      return obj
   }
})
