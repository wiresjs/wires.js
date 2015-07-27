domain.service("TagNode", ['$tagAttrs', 'TextNode'],function($tagAttrs, TextNode){

   return Wires.Class.extend({
      initialize : function(item, scope){
         this.item = item;
         this.scope = scope;
         this.children = [];
      },
      create : function(parent){
         this.element = document.createElement(this.item.name);
         if ( parent ){
            parent.addChild(this);
         }
         this.startWatching();
         return this.element;
      },
      addChild : function(child){
         $(this.element).append(child.element);
         this.children.push(child);
      },
      // Create attributes here
      // Watching if dom Removed
      startWatching : function(){
         var self = this;
         this.attrWatchers = $tagAttrs.create(this.item, this.scope, this.element);

         self.element.addEventListener("DOMNodeRemovedFromDocument", function() {

            // Removing all watchers from the attributes
   			_.each(self.attrWatchers, function(attrWatcher){
   			   attrWatcher.detach();
   			});

            // TextNode should be triggered manually
            // So we iterate over each text node
            // And detach watchers manually
            _.each(self.children, function(child){
               if ( child.watchers){
                  child.watchers.detach();
                  delete child;
               }
            });
            // Cleaning up stuff we don't need
            delete self.attrWatchers;
            delete this.children;
            delete this.element;
         });
      }
   });
});
