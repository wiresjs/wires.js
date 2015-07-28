domain.service("attrs.ws-visible", ['TagAttribute'], function(TagAttribute){
   var WsVisible = TagAttribute.extend({
      // Overriding default method
      // (we don't need to create an attribute for this case)
      create : function(){
         this.watcher = this.startWatching();
      },
      onExpression : function(expression){
         if ( expression ){
         //   console.log("Bllody visible",expression.value)
            if ( expression.value ){
               $(this.element).show(0);
            } else {
               $(this.element).hide(0);
            }
         }
      }
   });
   return WsVisible;
})
