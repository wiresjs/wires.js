domain.service("$evaluate", ['$preCompile', '$watch', '$pathObject', '$exec'],
   function($preCompile, $watch, $pathObject, $exec) {
      return function(input, opts) {
         var opts = opts || [];
         var scope = opts.scope || {};

         var changed = opts.changed;
         var watchVariables = opts.watchVariables !== undefined ? opts.watchVariables : true;

         // watchers for the current callback
         var _watchers = [];

         var compile = function(newKey, newValue) {
            var tpl = input.tpl;
            var expressions = [];
            var locals = [];
            _.each(input.vars, function(variable, k) {
               var value;

               // If compile is called with new value we have to take the new value instead
               if (variable.p) {
                  // The rest can be taken from the scope
                  path = $pathObject(variable.p, scope)
                  value = path.value;
                  locals.push({
                     path: variable.p,
                     value: path
                  })
               } else {
                  // Expression
                  if (variable.e) {
                     value = $exec.expression(variable.e, scope);
                     expressions.push({
                        str: variable.e,
                        value: value
                     })
                  }
               }
               value = value === undefined ? '' : value;

               tpl = tpl.split(k).join(value)
            });

            // Exec functions
            _.each(input.funcs, function(func, k) {

               var existingFunction = $pathObject(func.p, scope).value;
               if (_.isFunction(existingFunction)) {

                  var funcResult = $exec.func(func.f, scope);
                  tpl = tpl.split(k).join(funcResult !== undefined ? funcResult : '');
               } else {
                  // Replace it with empty string if function is not defined
                  tpl = tpl.split(k).join('');
               }
            })

            var response = {
               str: tpl,
               expressions: expressions,
               locals : locals,
               // detach (unwatch)
               detach: function() {
                  _.each(_watchers, function(wt) {
                     wt.remove();
                  })
               }
            }
            if (_.isFunction(changed)) {
               changed(response)
            }
            return response;
         }
         // Calling if variables need to be watched
         // Sometimes we need to just to evaluate and that's it
         if (watchVariables) {
            // to be watched
            var variables2Watch = {};
            var collectWatchers = function(list) {
               _.each(list, function(variable) {
                  if (variable.p) {
                     var vpath = variable.p.join('.')
                     if (!variables2Watch[vpath]) {
                        variables2Watch[vpath] = variable;
                     }
                  }
                  // Expression?
                  if (variable.e) {
                     collectWatchers(variable.v)
                  }
               });
            }
            collectWatchers(input.vars);
            _.each(variables2Watch, function(variable) {

               // In case of a direct variable
               var watcher = $watch(variable.p, scope, function(old, value) {
                  var newVar = {}
                     // Have to call if after values been actually changed
                  _.defer(function() {
                     compile(variable.p.join('.'), value);
                  });
               });
               if (watcher ){
                  _watchers.push(watcher);
               }
            });
         }

         var compiled = compile();

         return compiled;
      }
   })