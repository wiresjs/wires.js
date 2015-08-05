(function(){
   var _projectProxies;
   domain.service("$projectProxies", function(){
      if ( _projectProxies ){
         return _projectProxies;
      }
      return new Promise(function(resolve, reject){

         domain.requirePackage('proxies').then(function(projectProxies){

            _projectProxies = {};
            
            _.each(projectProxies, function(proxy, key){
               var name = key.slice(8, key.length);
               _projectProxies[name] = proxy;
            })
            return resolve(_projectProxies);
         })
      })
   })
})();
