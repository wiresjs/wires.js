domain.service("Controller", function() {

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
         var target = selector instanceof HTMLElement ? selector : document.querySelector(selector);
         if (!target) {
            throw {
               message: "Can't run. Selector " + selector + " for " + view + " in controller + " + this +
                  " was not found "
            };
         }
         // Storing target to this instance
         this.__target = target;
         var structure = window.__wires_views__[view];
         if (!structure) {
            throw {
               message: "'" + view + "' has not been compiled!"
            };
         }
         if (!window.WiresEngineStart) {
            throw {
               message: "WiresEngineStart was not found. Please initialize the router!"
            };
         }
         this.stack = window.WiresEngineStart({
            structure: structure,
            target: target,
            scope: this
         });
         if (_.isFunction(this.onRender)) {
            this.onRender();
         }
      },
      // Destroying this target
      destroy: function() {
         _.each(this.stack.children, function(item) {
            item.gc();
         });
      }
   });
});
