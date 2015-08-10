var _ = require('lodash');

var preCompile = function(str, opts) {
   var _counter = 0;

   var extractVariablesAndFunction = function(input, replaceString) {
      var _out = {};
      var params = /\$(\{)?(([a-zA-Z-0-9_$.]+)(\([^\)]*\))?)(\})?/g.execAll(input);
      _.each(params, function(param, index) {
         var key = "__v" + _counter++;
         // Preparing the string with macros
         if (replaceString) {
            str = str.split(param[0]).join(key);
         }
         var path = param[2].split(".");
         var stringFunc = param[4] !== undefined ? param[2] : false;
         // String functions
         if (stringFunc) {
            if (!_out.funcs) {
               _out.funcs = {};
            }
            // f is a full string (for evaluation)
            // we are not creating custom language parser (like in angular)
            var fSource = param[0];
            if (fSource[0] === "$") {
               fSource = "$." + fSource.slice(1, fSource.length);
            }
            _out.funcs[key] = {
               p: path,
               f: fSource
            };
         } else {
            if (!_out.vars) {
               _out.vars = {};
            }
            // Just variables and it's path
            // This variable will be watched
            _out.vars[key] = {
               p: path
            };
         }
      });
      return _out;
   };

   var _out = {};
   // Extract proxies
   var proxies = /\$(\w+):([a-zA-Z-0-9._]+)/g.execAll(str);
   _.each(proxies, function(_proxy){
      var key = "__p" + _counter++;
      str = str.split(_proxy[0]).join(key);
      var proxyName = _proxy[1];
      var proxyKey = _proxy[2];
      if (!_out.x){
          _out.x = {};
      }
      _out.x[key] = { n : proxyName, k : proxyKey};
   });
   // Expressions within {{  }}
   // ******************************************************
   var expressions = /\{\{(.+)\}\}/g.execAll(str);

   _.each(expressions, function(_expr) {

      var stringExpression = _expr[1];

      var exprOut = extractVariablesAndFunction(stringExpression);
      if (!_out.vars) {
         _out.vars = {};
      }
      var key = "__e" + _counter++;

      str = str.split(_expr[0]).join(key);

      var ignoreNext = false;
      var replacedExpression = [];
      _.each(stringExpression, function(symbol) {

         if (!ignoreNext && symbol === "$") {
            replacedExpression.push('this.');
            ignoreNext = false;
         } else {
            replacedExpression.push(symbol);
            ignoreNext = false;
         }
         if (symbol === ".") {
            ignoreNext = true;
         }
      });

      _out.vars[key] = {
         e: replacedExpression.join('').trim(),
         v: exprOut.vars || {}
      };
   });

   // Variables and functions starting with $
   // ***************************************

   var _vout = extractVariablesAndFunction(str, true);
   _out.vars = _out.vars || {};
   _out.vars = _.merge(_out.vars, _vout.vars);
   if (_vout.funcs) {
      _out.funcs = _vout.funcs;
   }
   _out.tpl = str;
   if (!_.keys(_out.vars).length) {
      delete _out.vars;
   }
   return _out;
};

module.exports = preCompile;
