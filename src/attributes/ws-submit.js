(function() {
   domain.service("attrs.ws-submit", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate) {
      var WsClick = TagAttribute.extend({
         detach: function() {
            if (this.submitListener) {
               this.element.removeEventListener("submit", this.submitListener);
            }
         },
         create: function() {
            var self = this;
            this.submitListener = function(event) {
               try {
                  $evaluate(self.attr, {
                     scope: self.scope,
                     element: event.target,
                     target: {
                        scope: event.target.$scope,
                        element: event.target
                     },
                     watchVariables: false
                  });
               } catch (e) {
                  console.error(e.stack || e);
               }
               event.preventDefault();
            };
            this.element.addEventListener("submit", this.submitListener);
         }
      });
      return WsClick;
   });

})();
