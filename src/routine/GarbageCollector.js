(function() {
   domain.service("GarbageCollector", function() {
      return Wires.Class.extend({
         gc: function(recursive) {
            var self = this;
            if ( this.element ){
               $(this.element).unbind();
            }
            if ( self.detach ){
               self.detach();
            }
            // Removing all watchers from the attributes
            if (self.attributes) {
               _.each(self.attributes, function(attribute) {
                  if (attribute.watcher) {
                     if (_.isArray(attribute.watcher)) {
                        _.each(attribute.watcher, function(w) {

                           w.detach();
                        })
                     } else {
                        attribute.watcher.detach();
                     }
                  }
                  if (_.isFunction(attribute.detach)) {
                     attribute.detach();
                  }
               });

               self.attributes.splice(0, self.attributes.length - 1)
               delete self.attributes;
            }
            if ( self.watchers ){
               var collection = [].concat(self.watchers)
               _.each(collection, function(watcher) {
                  watcher.detach();
               });
            }
            // TextNode should be triggered manually
            // So we iterate over each text node
            // And detach watchers manually
            //if ( recursive ){
            if (self.children) {
               _.each(self.children, function(child) {
                  child.gc();
               });
            }

         }
      })
   })
})();
