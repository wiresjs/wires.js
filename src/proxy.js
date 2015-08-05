(function(){
   var _proxies = {};
   domain.service("$proxy", ['$projectProxies'], function($projectProxies){
      return {
         getProxy : function(proxyData){
            var name = proxyData.n;
            var _Proxy = $projectProxies[name];
            if ( _Proxy ) {
               var proxy = _proxies[name];
               if ( !proxy  ){
                  proxy = _proxies[name] = new _Proxy();
               }
               return proxy;
            }
         },
         exec : function(proxyData, scope){
            var proxy = this.getProxy(proxyData);
            if ( proxy ){
               return proxy.get(proxyData.k, scope)
            }
            return '';
         }
      }

   })
})();
