domain.service("$pushState", ['$queryString'],function($queryString){
   return {
      _createQueryString : function(data){
         var stringData = [];
         _.each(data, function(value, k){
            stringData.push(k + "=" + encodeURI(value))
         });
         var str = stringData.join("&");
         if ( stringData.length > 0 ){
            str = "?" + str;
         }
         return  str;
      },
      _changeState : function(a){
         var stateObj = { url : a };
         history.pushState(stateObj,a, a);
      },
      force : function(data, userUrl){
         this._changeState( (userUrl || window.location.pathname) + this._createQueryString(data));
      },
      merge : function(data, userUrl){
         if ( _.isPlainObject(data) ){
            var current = $queryString();
            var params = _.merge(current,data);
            var url =  (userUrl || window.location.pathname) + this._createQueryString(params);
            this._changeState(url);
         }
      }
   }
});
