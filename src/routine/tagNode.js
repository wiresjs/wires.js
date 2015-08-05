domain.service("TagNode", ['$tagAttrs'],function($tagAttrs){

   return Wires.Class.extend({
      initialize : function(item, scope){
         this.item = item;
         this.scope = scope;

         this.children = [];
         var self = this;

         this.detachAllEvents = function() {
            // Removing all watchers from the attributes
   			_.each(self.attributes, function(attribute){
               if( attribute.watcher){
                  if (_.isArray(attribute.watcher)){
                     _.each(attribute.watcher, function(w){

                        w.detach();
                     })
                  } else {
   			            attribute.watcher.detach();
                  }
               }
               if ( _.isFunction(attribute.detach) ){
                  attribute.detach();
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
            $(self.element).unbind();
            if ( self.element ){
               self.element.removeEventListener("DOMNodeRemovedFromDocument", self.detachAllEvents)
            }
            // Cleaning up stuff we don't need
            delete self.attributes;
            delete self.children;
            if ( self.element){
               delete self.element.$scope;
               delete self.element.$tag;
            }
            delete self.element;
         }
      },
      setElement : function(element){
         this.element = element;
         this.element.$scope = this.scope;
         this.element.$tag = this;
      },
      create : function(parent){
         this.setElement(document.createElement(this.item.n));
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
      attachGarbageCollector : function(){
         this.element.addEventListener("DOMNodeRemovedFromDocument", this.detachAllEvents);
      },
      // Create attributes here
      // Watching if dom Removed
      startWatching : function(){
         var self = this;
         this.attributes = $tagAttrs.create(this.item, this.scope, this.element);
         this.attachGarbageCollector();
      }
   });
});
