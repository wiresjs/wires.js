(function() {
   var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
   var getClientCoords = function(e){
      var coords = {
         x : e.clientX,
         y : e.clientY
      };
      if ( e.originalEvent.touches  ){
         var c;
         if ( ( c = e.originalEvent.touches[0]) ){
            coords.x = c.clientX;
            coords.y = c.clientY;
         }
      }
      return coords;
   };

   domain.service("attrs.ws-drag", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate) {
      var WsClick = TagAttribute.extend({
         // Overriding default method
         // (we don't need to create an attribute for this case)
         create: function() {
            var self = this;


            var fireEvent = function(ev) {
                  var original = ev.e.originalEvent ? ev.e.originalEvent.target : ev.e.target;
                  ev.target = original.$scope;
                  ev.element = original;
                  var data = $evaluate(self.attr, {
                     scope: self.scope,
                     target: ev,
                     watchVariables: false
                  });
            };
            // Binding events

            var m = window.isMobile;
            $(this.element).bind(m ? "touchstart" : "mousedown", function(e) {
               if ( is_firefox ){
                  e.preventDefault();
               }
               var startCoords = getClientCoords(e);
               fireEvent({
                  e: e,
                  coords: startCoords,
                  type: "start"
               });
               $(this).bind(m ? "touchmove" : "mousemove", function(e) {
                  var x = startCoords.x - getClientCoords(e).x;
                  var y = startCoords.y - getClientCoords(e).y;
                  var coords = {
                     x: x,
                     y: y,
                     dy: y < 0 ? "down" : "up",
                     dx: x < 0 ? "right" : "left"
                  };
                  fireEvent({
                     e: e,
                     coords: coords,
                     type: "move"
                  });
               });
               $(this).bind(m ? "touchend touchleave touchcancel" : "mouseup", function(e) {
                  if ( is_firefox ){
                     e.preventDefault();
                  }
                  fireEvent({
                     e: e,
                     type: "stop"
                  });
                  $(this).unbind("mouseup mousemove")
               })
            });
         }

      });
      return WsClick;
   });
})();
