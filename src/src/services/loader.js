(function() {
   var _loaded = {};

   domain.service("$load", ['$http', '$queryString', '$root'], function($http, $queryString, $root) {
      return {
         component: function(component, opts) {

         },
         controller: function(controller, opts) {
            var _url = window.location.url;
            var opts = opts || {};
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
                  }
               })
            }
            return domain.require([controller], injections, function(list) {
               // Basic validation on list
               if (!_.isArray(list)) {
                  return;
               }
               if (list.length < 2) {
                  return;
               }
               var loadOpts = list[0].match(/^([^\s]+)(\s*->\s*([^\s]+))?/i)
               var Ctrl = list[1];
               if (!loadOpts) {
                  return;
               }
               var view = loadOpts[1];
               var targetSelector = loadOpts[3] || "section";
               var target;

               // in case if we have a target (components)
               // we should just force it
               if (opts.target) {
                  target = opts.target;
               } else {
                  // If parent controller was passed
                  // We must find the target inside the parent div
                  // To avoid collisions with other "sections"
                  if (parent && parent.target) {
                     target = $(parent.target).find(targetSelector)[0]
                  } else {
                     target = document.querySelector(targetSelector);
                  }
               }
               if (!target) {
                  throw {
                     message: "Target '" + targetSelector + "' was not found"
                  }
               }

               // Clean the current target
               Wires.World.cleanUp($(target)[0]);



               return $http.getTemplate(view).then(function(tpl) {
                  var ctrlArgs = [1];
                  var ctrl;
                  if ( opts.args ){
                     ctrlArgs = _.union(ctrlArgs,opts.args)
                     var f = Ctrl.bind.apply(Ctrl, ctrlArgs);
                     ctrl = new f();
                  } else {
                     ctrl = new Ctrl();
                  }
                  ctrl.root = $root;
                  return new Promise(function(resolve, reject) {
                     var opts = {
                        scope: {
                           instance: ctrl
                        },
                        target: target,
                        done: function() {
                           return resolve({
                              wires: wires,
                              target: target,
                              ctrl: ctrl
                           })
                        }
                     }
                     if ( _.isPlainObject(tpl) ){
                        if ( tpl.dom ){
                           opts.dom = tpl.dom;
                        }
                        if ( tpl.html ){
                           opts.template = tpl.html;
                        }
                     } else {
                        opts.template = tpl;
                     }
                     var wires = new Wires.World(opts);
                  });
               });
            })
         }
      }
   })
})();
