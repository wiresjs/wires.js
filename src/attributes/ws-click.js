domain.service("attrs.ws-click", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate){
   var WsClick = TagAttribute.extend({
      // Overriding default method
      // (we don't need to create an attribute for this case)
      create : function(){
         var self = this;
         var elementClicked = function(e){
            var target = e.originalEvent ? e.originalEvent.target : e.target;
            var data = $evaluate(self.attr, {
               scope: self.scope,
               element : target,
               target : target.$scope,
               watchVariables : false
            });
            delete elementClicked;
            e.preventDefault();
         }
         var evName = window.isMobile ? "touchend" : "click";
         $(this.element).bind( evName, elementClicked)
      }
   });
   return WsClick;
})
