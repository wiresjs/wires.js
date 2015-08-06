(function(){
   domain.service("attrs.ws-submit", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate) {
      var WsClick = TagAttribute.extend({
         detach : function(){
            if ( this.submitListener ){
               this.element.removeEventListener(this.submitListener);
            }
         },
         create: function() {
            var self = this;
            this.submitListener = function(event) {
               try {
                  var e = event.originalEvent;
                  $evaluate(self.attr, {
                     scope: self.scope,
                     element: e.target,
                     target: e.target.$scope,
                     watchVariables: false
                  });
               } catch (e) {
                  console.error(e.stack || e)
               }
               e.preventDefault();
            }
            this.element.addEventListener(this.submitListener)
         }
      });
      return WsClick;
   })

})();
