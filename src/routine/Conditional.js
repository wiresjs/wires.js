(function() {
   domain.service("Conditional", ['TagNode', '$pathObject', '$array', '$watch', '$evaluate'], function(TagNode, $pathObject,
      $array, $watch, $evaluate) {
      return Wires.Class.extend({
         initialize: function(opts) {
            var self = this;
            this.item = opts.item;
            this.run = opts.run;
            this.parent = opts.parent;
            this.scope = opts.scope;


            var parentDom = self.item.c[0];
            this.element = document.createComment(' if ');
            this.parent.addChild(this)

            // Evaluate and watch condition
            this.watchers = $evaluate(this.item.z, {
               scope: self.scope,
               element : {},
               target : {},
               changed : function(data){

                  if ( data.expressions && data.expressions.length > 0 ){
                     var condition = data.expressions[0].value;
                     // Create the element from scratch
                     if ( condition ){
                        // Only if element was removed
                        // We don't want to re-create it all the time
                        if ( self.parentElement === undefined ){
                           var parentNode = new TagNode(parentDom, self.scope);
                           parentNode.create();
                           self.parentElement = parentNode.element;
                           
                           // Kicking of the run with parent's children
                           self.run({
                              structure   : parentDom.c || [],
                              parentNode  : parentNode,
                              scope       : self.scope
                           });
                           self.element.parentNode.insertBefore(parentNode.element, self.element.nextSibling);
                        }
                     } else {
                        // Destroying the element
                        if (  self.parentElement ){
                           $(self.parentElement).remove();
                           self.parentElement = undefined;
                        }
                     }
                  }
               }
            });

         }
      })
   })

})();
