domain.service("Controller", ['$run'], function($run) {
   return Wires.Class.extend({
      initialize: function() {

      },
      // Render Controller manually
      render: function(_customTargetSelector) {
         if (!this._view) {
            return;
         }
         // Extracting params
         // e.g myview.html -> body
         var opts = this._view.match(/^([^\s]+)(\s*->\s*([^\s]+))?/i);
         var view = opts[1];
         var selector = _customTargetSelector ? _customTargetSelector : (opts[3] || "section");
         var target = document.querySelector(selector);
         if (!target) {
            throw {
               message: "Can't run. Selector " + selector + " for " + view + " in controller + " + this +
                  " was not found "
            };
         }
         // Storing target to this instance
         this.__target = target;
         if (!window.__wires_views__[view]) {
            throw {
               message: "'" + view + "' has not been compiled!"
            };
         }
         this.stack = $run({
            structure: window.__wires_views__[view],
            target: target,
            scope: this
         });

      },
      // Destroying this target
      destroy: function() {
         _.each(this.stack.children, function(item) {
            item.gc();
         });

      }
   });
});
