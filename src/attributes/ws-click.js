domain.service("attrs.ws-click", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate){
   var WsClick = TagAttribute.extend({
      // Overriding default method
      // (we don't need to create an attribute for this case)
      create : function(){
         var self = this;
         $(this.element).click(function(e){
            event.preventDefault();
            var data = $evaluate(self.attr, {
               scope: scope,
               watchVariables : false
            });
         });
      }

   });
   return WsClick;
})
