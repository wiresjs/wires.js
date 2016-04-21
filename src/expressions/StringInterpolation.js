(function(domain) {
   return domain.module("StringInterpolation",
      function(_, AngularExpressions, WiresUtils, WatchBatch) {
         return {

            /**
             * compile - Compile a string
             * var model = parser.compile('Hello {{name}}');
             * model({ name : "John" }, function(str){
             *
             * })
             *
             * @param  {type} lines string or a list of compiled statements
             * @return {type}       callback when changes are made
             */
            compile: function(lines) {
               if (!_.isArray(lines)) {
                  lines = this.parse(lines);
               }
               return function() {
                  var $scope = typeof arguments[0] === "object" ? arguments[0] : {};
                  var $locals = !_.isFunction(arguments[1]) && _.isObject(arguments[1]) ? arguments[1] : {};

                  var cb = _.isFunction(arguments[1]) ? arguments[1] : (_.isFunction(arguments[2]) ? arguments[2] : undefined);
                  var trigged = false;
                  var changed = function(changes) {
                     var strings = _.map(lines, function(item) {
                        return item.e ? AngularExpressions.compile(item.e)($scope, $locals) : item;
                     });
                     cb ? cb(strings.join('')) : undefined;
                  }

                  var watchable = _.chain(lines).map(function(item) {
                     return item.v || false;
                  }).compact().value();

                  return WatchBatch({
                     locals: $locals,
                     scope: $scope,
                     batch: watchable
                  }, changed);
               }
            },

            /**
             * parse - Parsing input string
             * Extrating expressions and regular string
             * "Hello {{user.name}}" will give an array
             * ['Hello', {e : 'user.name', v {}}]
             *       e - raw expression
             *       v - extracted variable names (for watchers)
             * @param  {type} str user string
             * @return {type}     Array
             */
            parse: function(str) {
               if (!_.isString(str)) {
                  return [];
               }
               var re = /({{\s*[^}]+\s*}})/g;
               var list = str.split(re).map(function(x) {
                  var expr;
                  if ((expr = x.match(/{{\s*([^}]+)\s*}}/))) {
                     var expressionString = expr[1].trim();
                     return {
                        e: expressionString,
                        v: AngularExpressions.extract(expressionString)
                     }
                  }
                  return x;
               });
               return _.filter(list, function(x) {
                  return x ? x : undefined
               });

            }
         }
      });
})(typeof exports !== 'undefined' ? require('wires-domain') : this.domain)
