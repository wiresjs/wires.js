(function(){
   var _animations;
   domain.service("$projectAnimations", function(){
      if ( _animations ){

         return _animations;
      }
      return new Promise(function(resolve, reject){
         domain.requirePackage('animations').then(function(animations){
            _animations = {};
            _.each(animations, function(proxy, key){
               var name = key.slice(11, key.length);
               _animations[name] = proxy;
            });
            return resolve(_animations);
         });
      });
   });
})();
