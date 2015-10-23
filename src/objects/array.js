(function() {
   domain.service("$array", ['$http', '$resource', '$restEndPoint'], function($http, $resource, $restEndPoint) {
      return function(a, b) {
         var opts;
         var array;
         if (_.isArray(a)) {
            array = a;
            opts = b || {};
         } else {
            array = [];
            opts = _.isPlainObject(a) ? a : {};
         }
         var endpoint = opts.endpoint;
         if (_.isString(a)) {
            endpoint = a;
         }

         // Array has been already initialized
         if (array.$watch)
            return array;

         var watchers = [];

         var notify = function() {
            var args = arguments;
            _.each(watchers, function(watcher) {
               if (watcher) {
                  watcher.apply(null, args);
               }
            });
         };

         array.$watch = function(cb) {
            watchers.push(cb);
            return {
               // Detaching current callback
               detach: function() {
                  var index = watchers.indexOf(cb);
                  watchers.splice(index, 1);
               }
            };
         };

         // clean up array
         array.$removeAll = function() {
            array.splice(0, array.length);
         };

         array.$empty = function() {
            this.$removeAll();
         };

         // Completely destroys this.array
         // Removes all elements
         // Detaches all watchers
         array.$destroy = function() {
            array.$removeAll();
            _.each(watchers, function(watcher) {
               delete watchers[watcher];
            });
            watchers = undefined;
         };

         // fetching is rest endpoint is provided
         array.$fetch = function(params) {
            var self = this;
            return new Promise(function(resolve, reject) {
               var params = params || {};
               if (!endpoint) {
                  throw {
                     message: "Can't fetch without the endpoint!"
                  };
               }
               var url = $restEndPoint(endpoint, params);

               return $http.get(url, params).then(function(data) {
                  // If we get the result, removing everything
                  self.$removeAll();
                  _.each(data, function(item) {
                     self.push($resource(item, {
                        endpoint: endpoint,
                        array: self
                     }));
                  });
                  return resolve(self);
               }).catch(reject);
            });
         };

         // Adding new value to array
         array.$add = function() {
            var self = this;
            var items = _.flatten(arguments);
            return new Promise(function(resolve, reject) {
               return domain.each(items, function(item) {
                  var data = _.isFunction(item.$getAttrs) ? item.$getAttrs() : item;
                  // Reset errors
                  if (item.$err) {
                     item.$err = undefined;
                  }
                  // if api is restull need to perform a request
                  if (endpoint) {
                     var url = $restEndPoint(endpoint, data);
                     return $http.post(url, data);
                  }
                  return item;
                  //array.push(item)
               }).then(function(newrecords) {
                  _.each(newrecords, function(item) {
                     array.push($resource(item, {
                        endpoint: endpoint,
                        array: self
                     }));
                  });

                  return resolve(newrecords);
               }).catch(function(e) {

                  // Storing error message to items
                  _.each(items, function(item) {
                     item.$err = e.message && e.message.message ? e.message.message :
                        e;
                  });
                  // Continue here
                  return reject(e);
               });
            });

         };

         // Watching variable size
         array.size = array.length;

         // overriding array properties
         array.push = function(target) {
            target = _.isFunction(target.$getAttrs) ? target.$getAttrs() : target;
            var push = Array.prototype.push.apply(this, [target]);
            notify('push', target);
            array.size = array.length;
            return push;
         };

         // Splicing (removing)
         array.splice = function(index, howmany) {

            notify('splice', index, howmany);
            var sp = Array.prototype.splice.apply(this, arguments);
            array.size = array.length;
            return sp;
         };

         // Convinience methods
         array.$remove = function(index) {
            if (_.isObject(index)) {
               index = this.indexOf(index);
            }
            return this.splice(index, 1);
         };
         return array;
      };
   });
})();
