module wires.expressions.StringInterpolation;

import lodash as _ from utils;
import AngularExpressions, WatchBatch from wires.expressions;
import DotNotation from wires.utils;

var StringInterpolation = {
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
      return function(arg1, arg2, arg3, instant) {
         var $scope = arg1 || {};
         var $locals = arg3 ? arg2 : {};
         var cb = arguments.length >= 3 ? arg3 : arg2;

         var watchable = _.chain(lines).map(function(item) {
            return item.v || false;
         }).compact().value();
         if (watchable.length === 0) {
            return cb(lines.join(''));
         }
         var oldValue;
         var trigger = function() {
            var strings = _.map(lines, function(item) {
               return item.e ? AngularExpressions.compile(item.e)($scope, $locals) : item;
            });
            var value = strings.join('');
            cb(value, oldValue);
            oldValue = value;
         }
         if (instant) {
            trigger();
         }
         return WatchBatch({
            locals: $locals,
            scope: $scope,
            batch: watchable
         }, trigger);
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

export StringInterpolation;
