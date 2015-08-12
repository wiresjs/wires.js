domain.service("animations.ws-spring", function() {
   return {
      onCreate: function() {
         var el = $(this);
         el.show()
            .velocity({
               scale: 0,
               opacity : 0
            }, {
               duration: 1
            }).velocity({scale : 1, opacity: 1},  { easing :[ 250, 15 ] });
      },
      onDestroy: function() {
         var el = $(this);
         return new Promise(function(resolve, reject) {
            el.velocity({scale : 0, opacity : 0},  { duration : 200,complete: resolve});
         });
      }
   };
});
