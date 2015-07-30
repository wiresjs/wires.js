(function(){
   var counter = 1;

domain.service("TextNode", ['$evaluate'],function($evaluate){

   return Wires.Class.extend({
      initialize : function(item, scope){
         this.item = item;
         this.scope = scope;
      },
      onDetach : function(){

      },
      create : function(parent){
         var self = this;
         this.firstLoad = true;
         
         var data = watcher = $evaluate(this.item.d, {
            scope: this.scope,
            changed: function(data) {
               counter++;

               if ( self.firstLoad === false ){
                  self.element.nodeValue = data.str;
               }
               self.firstLoad = false;
            }
         });
         this.watchers = data;
         this.element = document.createTextNode(data.str);
         if ( parent ){
            parent.addChild(this);
         }
         return this.element;
      }
   })

})
})();
