domain.service("$tagAttrs", ['$evaluate'], function($evaluate){
   return {
      create : function(item, scope, element){
         var _watchers = [];
         _.each(item.attrs, function(attr, name){
            // Creatinga attribute
            var attribute = document.createAttribute(name);

            var watcher = $evaluate(attr, {
               scope: scope,
               changed: function(data) {
                  console.log("Triggered attr", data.str)
                  attribute.value = data.str;
               }
            });
            _watchers.push(watcher);
            // Adding the attribute
            element.setAttributeNode(attribute);
         });
         return _watchers;
      }
   }
})
