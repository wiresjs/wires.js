(function() {
   var _loaded = {};
   var counter = 0;
   domain.service("$load", ['$queryString', '$loadView', '$run'],
      function($queryString, $loadView, $run) {
         window.WiresEngineStart = $run;
         return {
            component: function(component, opts) {

            },
            extractViewAndTarget: function(str) {
               var opts = str.match(/^([^\s]+)(\s*->\s*([^\s]+))?/i);
               return {
                  view: opts[1],
                  targetSelector: opts[3] || "section"
               };
            },
            controller: function(controller, opts) {
               var self = this;
               var _url = window.location.url;
               opts = opts || {};
               var parent = opts.parent;

               var params = $queryString();

               if (opts.params) {
                  params = _.merge(params, opts.params);
               }
               var injections = {
                  $params: {
                     target: params
                  }
               };

               // Check if controller has custom injections
               if (opts.injections) {
                  _.each(opts.injections, function(value, key) {
                     injections[key] = {
                        target: value
                     };
                  });
               }
               return domain.require([controller], injections, function(data) {
                  counter++;
                  var view, Ctrl, targetSelector;

                  // Basic validation on list
                  if (_.isArray(data)) {
                     var loadOpts = self.extractViewAndTarget(data[0]);
                     Ctrl = data[1];
                     view = loadOpts.view;
                     targetSelector = loadOpts.targetSelector;
                  } else if (_.isObject(data)) {
                     if (data.prototype && data.prototype._view) {
                        var ctrlOpts = self.extractViewAndTarget(data.prototype._view);
                        view = ctrlOpts.view;
                        Ctrl = data;
                        targetSelector = ctrlOpts.targetSelector;
                     }
                  }

                  var target = null;

                  if (parent && parent.element) {
                     target = $(parent.element).find(targetSelector)[0];
                  } else {
                     target = document.querySelector(targetSelector);
                  }

                  if (!target) {
                     throw {
                        message: "Can't find a target "
                     };
                  }

                  var ctrl = new Ctrl();
                  // detach the very first
                  if (target.$tag) {
                     if (target.$tag.gc) {
                        target.$tag.gc(true);
                     }
                  }
                  $(target).empty();
                  // while (target.firstChild) {
                  //    if (target.firstChild.$tag) {
                  //       target.firstChild.$tag.gc();
                  //    }
                  // }
                  return $loadView(view).then(function(structure) {
                     $run({
                        structure: structure,
                        target: target,
                        scope: ctrl
                     });
                     return {
                        scope: ctrl,
                        element: target
                     };
                  });
               });
            }
         };
      });
})();
