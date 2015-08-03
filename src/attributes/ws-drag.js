(function() {
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
                  event.preventDefault();
               }
               // Binding events

            var m = window.isMobile;
            $(this.element).bind(m ? "touchstart" : "mousedown", function(e) {
               var startCoords = {
                  x: e.clientX,
                  y: e.clientY
               }
               fireEvent({
                  e: e,
                  coords: startCoords,
                  type: "start"
               })
               $(this).bind(m ? "touchmove" : "mousemove", function(e) {
                  var x = startCoords.x - e.clientX;
                  var y = startCoords.y - e.clientY
                  var coords = {
                     x: x,
                     y: y,
                     dy: y < 0 ? "down" : "up",
                     dx: x < 0 ? "right" : "left"
                  }
                  fireEvent({
                     e: e,
                     coords: coords,
                     type: "move"
                  });
               })
               $(this).bind(m ? "touchend touchleave touchcancel" : "mouseup", function(e) {
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
