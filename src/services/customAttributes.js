(function() {
   var _customAttributes;
   domain.service("$customAttributes", function() {
      if (_customAttributes) {
         return _customAttributes;
      }
      return new Promise(function(resolve, reject) {
         domain.requirePackage('attrs').then(function(customAttributes) {
            _customAttributes = customAttributes;
            return resolve(_customAttributes);
         });
      });
   });
})();
