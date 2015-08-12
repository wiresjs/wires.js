(function(){
   domain.service("attrs.ws-click", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate){
      var WsClick = TagAttribute.extend({
         // Overriding default method
         // (we don't need to create an attribute for this case)
         detach : function(){
            if ( this.element ){
               this.element.removeEventListener(this.eventName, this.elementClicked);
            }
         },
         create : function(){
            var self = this;
            this.elementClicked = function(e){
               var target = e.target;
               var data = $evaluate(self.attr, {
                  scope: self.scope,
                  element : target,
                  target : { scope: target.$scope, element : self.element },
                  watchVariables : false
               });
               e.preventDefault();
            };
            this.eventName = window.isMobile ? "touchend" : "click";
            this.clickListener = this.element.addEventListener(this.eventName, this.elementClicked);
         }
      });
      return WsClick;
   });
})();
