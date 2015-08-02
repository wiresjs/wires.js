(function() {
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
               
               if ( res.status) {
                  return fail({ status : res.status, message : res.responseJSON || res.statusText} )
               }
               return ok(res);
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
         getHTML : function(url){
            var self = this;
            return new Promise(function(resolve, reject) {
               $.get(url, function(data){
                  data = data.replace(/(\r\n|\n|\r)/gm,"");
                  return resolve(data)
               });
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
