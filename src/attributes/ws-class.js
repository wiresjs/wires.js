(function() {
   domain.service("attrs.ws-class", ['TagAttribute'], function(TagAttribute) {
      var WsVisible = TagAttribute.extend({
         // Overriding default method
         // (we don't need to create an attribute for this case)
         create: function() {
            this.watcher = this.startWatching();
         },

         onExpression: function(expression) {

            var el = $(this.element);
            if (expression) {
               if (_.isPlainObject(expression.value)) {
                  _.each(expression.value, function(v, cls) {

                     if (v) {
                        if (!el.hasClass(cls)) {
                           el.addClass(cls)
                        }
                     } else {
                        el.removeClass(cls)
                     }
                  });
               }
            }

         }
      });
      return WsVisible;
   })
})();
