domain.service("TextNode", ['$evaluate'],function($evaluate){

   return Wires.Class.extend({
      initialize : function(item, scope){
         this.item = item;
         this.scope = scope;
      },
      create : function(parent){
         this.element = document.createTextNode('');
         parent.addChild(this);
         this.watchers = this.startWatching();
         return this.element;
      },
      startWatching : function(){
         var self = this;
         return $evaluate(this.item.data, {
            scope: scope,
            changed: function(data) {
               self.element.nodeValue = data.str;
            }
         });
      }
   })

})
