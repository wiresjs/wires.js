(function(){
   domain.service("attrs.ws-submit", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate) {
      var WsClick = TagAttribute.extend({

         create: function() {
            var self = this;
            $(this.element).submit(function(event) {
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
            })
         }

      });
      return WsClick;
   })
   
})();
