domain.service("TagNode", ['$tagAttrs'],function($tagAttrs){

   return Wires.Class.extend({
      initialize : function(item, scope){
         this.item = item;
         this.scope = scope;

         this.children = [];
      },
      create : function(parent, insertAfter){
         this.element = document.createElement(this.item.n);
         this.element.$scope = this.scope;
         this.element.$tag = this;

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

         this.attributes = $tagAttrs.create(this.item, this.scope, this.element);

         self.element.addEventListener("DOMNodeRemovedFromDocument", function() {

            // Removing all watchers from the attributes
   			_.each(self.attributes, function(attribute){
               if( attribute.watcher){
   			      attribute.watcher.detach();
               }
   			});

            // TextNode should be triggered manually
            // So we iterate over each text node
            // And detach watchers manually
            _.each(self.children, function(child){

               if ( child.watchers){
                  child.watchers.detach();
                  delete child;
               }
               if ( child.onRemove){
                  child.onRemove();
               }
               delete child;
            });
            // Cleaning up stuff we don't need
            delete self.attributes;
            delete self.children;
            delete self.element.$scope;
            delete self.element.$tag;
            delete self.element;
         });
      }
   });
});
