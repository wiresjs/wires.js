(function() {

   // Router State
   var RouterState = Wires.Class.extend({
      initialize: function() {
         this.states = [];
         this.loaded = false;
      },
      set: function(route, controller, states) {
         this.route = route;
         this.controller = controller;
         this.states = states;
      },
      getControllerPath: function() {
         return "controllers." + this.controller;
      },
      matches: function() {
         var url = window.location.pathname;

         var keys = [];
         var re = pathToRegexp(this.route, keys);
         var result;
         var params = {};
         if ((result = re.exec(url))) {
            _.each(keys, function(key, index) {
               params[key.name] = result[index + 1];
            });
            return params;
         }
      }
   });
   // Defining the root router state
   var rootState = new RouterState();

   domain.register("$router", ['$load', '$queryString', '$loadView', '$run', '$history'],
      function($load, $queryString, $loadView, $run, $history) {
         // Storing "run" to windows object
         window.WiresEngineStart = $run;
         return {

            add: function() {
               var state = this.state.apply(this, arguments);
               rootState.states.push(state);
            },
            state: function(route, controller, states) {
               var state = new RouterState();
               state.set.apply(state, arguments);
               return state;
            },
            _start: function(rState) {
               var self = this;
               _.each(rState.states, function(state) {
                  var params;
                  // If the route matches
                  if ((params = state.matches())) {
                     self.stack.push(state);
                     // Check if we have nested controllers
                     if (state.states) {

                        self._start(state);
                     }
                     return false;
                  }
               });
            },
            loadStates: function(states) {
               var start = new Date().getTime();
               var self = this;
               var parent;

               self.historyStack = self.historyStack || [];

               return domain.each(states, function(routeState, index) {

                  var hs = self.historyStack[index];
                  var thelast = index + 1 === states.length;

                  if (hs) {
                     // If the route is not the last one
                     if (!thelast) {
                        // We need to check if it's been changed
                        if (hs.route === routeState.route) {
                           // W don't need to trigger it
                           parent = routeState.parent;
                           return;
                        }
                     }
                  }

                  return $load.controller(routeState.getControllerPath(), {
                     parent: parent
                  }).then(function(current) {
                     routeState.loaded = true;
                     routeState.parent = current;
                     parent = current;
                  });
               }).then(function(scope) {

                  self.historyStack = [];
                  // Reset the controller stack
                  _.each(self.stack, function(s) {
                     self.historyStack.push(s);
                  });
                  self.stack = [];
               }).catch(function(e) {
                  console.error(e || e.stack);
               });

            },
            start: function() {
               var self = this;
               self.stack = [];
               self._start(rootState);
               self.loadStates(self.stack);

               $history.on("change", function(e) {
                  self.stack = [];
                  self._start(rootState);
                  self.loadStates(self.stack);
               });
            }
         };
      });
})();
