(function() {
   var _projectComponents;
   domain.service("$projectComponents", function() {
      if (_projectComponents) {
         return _projectComponents;
      }
      return new Promise(function(resolve, reject) {
         domain.requirePackage('components').then(function(projectComponents) {
            _projectComponents = {};
            _.each(projectComponents, function(component, key) {
               var name = key.slice(11, key.length);
               _projectComponents[name] = component;
            });
            return resolve(_projectComponents);
         });
      });
   });
})();
