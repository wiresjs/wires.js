(function() {
   var _validators;
   domain.service("$projectValidators", function() {
      if (_validators) {
         return _validators;
      }
      return new Promise(function(resolve, reject) {
         domain.requirePackage('validators').then(function(validators) {
            _validators = {};
            _.each(validators, function(validator, key) {
               var name = key.slice(11, key.length);
               _validators[name] = validator;
            });
            return resolve(_validators);
         });
      });
   });
})();
