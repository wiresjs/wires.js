(function(){
   var _customAttributes;
   domain.service("$customAttributes", function(){
      return new Promise(function(resolve, reject){
         if ( _customAttributes ){
            return resolve(_customAttributes);
         }
         domain.requirePackage('attrs').then(function(customAttributes){
            _customAttributes = customAttributes;
            return resolve(_customAttributes);
         })
      })
   })
})();
