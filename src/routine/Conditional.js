(function() {
   domain.service("Conditional", ['TagNode',  '$array', '$watch', '$evaluate', '$pathObject', 'GarbageCollector'],
   function(TagNode, $array, $watch, $evaluate, $pathObject, GarbageCollector) {
      return GarbageCollector.extend({
         initialize: function(opts) {
            var self = this;
            this.item = opts.item;
            this.run = opts.run;
            this.parent = opts.parent;
            this.scope = opts.scope;


            var parentDom = self.item.c[0];

            // Checking new scope
            // TODO: move to compiler

            if ( parentDom.a && parentDom.a["ws-bind"] ){
               var wsBind = parentDom.a["ws-bind"];
               if ( _.values(wsBind.vars).length > 0 ){
                  var newScope =  _.values(wsBind.vars)[0];
                  this.attachedScopePath = newScope.p;
               }
            }

            this.element = document.createComment(' if ');
            this.parent.addChild(this);

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
                           // check for modified SCOPE
                           var scope = self.scope;
                           if ( self.attachedScopePath ){
                              scope = $pathObject(self.attachedScopePath, scope).value;
                           }

                           var parentNode = new TagNode(parentDom, scope);
                           parentNode.create();
                           self.parentElement = parentNode.element;

                           // check for the include
                           var includes;
                           var structure = parentDom.c || [];
                           if ( parentDom.a && ( includes = parentDom.a["ws-include"]) ){
                              if ( window.__wires_views__[includes.tpl] ) {
                                 structure = window.__wires_views__[includes.tpl];
                              } else {
                                 console.error(includes.tpl + " was not found");
                              }
                           }
                           // Kicking of the run with parent's children

                           self.run({
                              structure   : structure,
                              parentNode  : parentNode,
                              scope       : scope
                           });
                           self.element.parentNode.insertBefore(parentNode.element, self.element.nextSibling);
                        }
                     } else {
                        // Destroying the element
                        if (  self.parentElement ){
                           if ( self.parentElement.$tag ){
                              self.parentElement.$tag.gc();
                           }

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
