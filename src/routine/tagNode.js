domain.service("TagNode", ['$tagAttrs', 'GarbageCollector'],function($tagAttrs, GarbageCollector){

   return GarbageCollector.extend({
      initialize : function(item, scope){
         this.item = item;
         this.scope = scope;

         this.children = [];
         var self = this;
      },
      setElement : function(element){
         this.element = element;
         this.element.$scope = this.scope;
         this.element.$tag = this;
      },
      create : function(parent){
         var el = document.createElement(this.item.n);
         
         // We need to have the element it is has animation property
         if ( this.item.a && this.item.a["ws-animation"] ) {
            $(el).hide();
         }
         this.setElement(el);
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
      }
   });
});
