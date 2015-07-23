(function() {

   var templateCache = {};

   domain.register("$http", function() {
      return {
         _request: function(method, url, data, ok, fail) {
            var opts = {
               url: url,
               contentType: 'application/json; charset=UTF-8',
               method: method,
               data: JSON.stringify(data),
               dataType: "json"
            }
            if (method === "GET") {
               opts.data = data;
            }

            var request = $.ajax(opts);

            request.always(function(res, status) {

               if (status === "success") {
                  ok(res);
               } else {
                  if (res.responseJSON && res.responseJSON) {
                     fail(res.responseJSON)
                  }
               }

            });
         },
         delete: function(url, data) {
            var self = this;
            return new Promise(function(resolve, reject) {


               self._request("DELETE", url, data, function(res) {
                  resolve(res);
               }, function(err) {
                  reject(err)
               })
            })
         },
         getTemplate: function(url, data) {

            return new Promise(function(resolve, reject) {

               if ( domain.isServiceRegistered("$wiresViewsCache") ){
                  domain.require(['$wiresViewsCache'],function(cache){
                     if ( cache[url] ){
                        return resolve({ dom : cache[url] } )
                     }
                  }).catch(reject);
               } else {
                  if ( templateCache[url] ){
                     return resolve(templateCache[url])
                  }

                  $.get(url, data, function(res) {
                     templateCache[url] = res;
                     resolve(res);
                  });
               }
            })
         },
         // Gett request
         get: function(url, data) {
            var self = this;

            return new Promise(function(resolve, reject) {
               self._request("GET", url, data, function(res) {
                  resolve(res);
               }, function(err) {
                  reject(err)
               })
            })
         },
         // Gett request
         post: function(url, data) {
            var self = this;
            return new Promise(function(resolve, reject) {
               self._request("POST", url, data, function(res) {
                  resolve(res);
               }, function(err) {
                  reject(err)
               })
            })
         },
         put: function(url, data) {
            var self = this;
            return new Promise(function(resolve, reject) {
               self._request("PUT", url, data, function(res) {
                  resolve(res);
               }, function(err) {
                  reject(err)
               })
            })
         }
      }
   })
})();
