(function(isNode, domain) {
   var _transations = {};

   return domain.module("WiresUtils", function(AsyncWatch) {
      var WiresUtils = {
         nextTick: function(cb) {
            return isNode ? process.nextTick(cb) : window.requestAnimationFrame(cb);
         },
         dotNotation: function(path) {
            if (path instanceof Array) {
               return {
                  path: path,
                  str: path.join('.')
               }
            }
            if (typeof path !== 'string') {
               return;
            }
            return {
               path: path.split('\.'),
               str: path
            }
         },
         hasProperty: function(obj, path) {
            if (path.length === 0 || obj === undefined) {
               return false;
            }
            var notation = this.dotNotation(path);
            if (!notation) {
               return false;
            }
            path = notation.path;
            var validNext = true;
            for (var i = 0; i < path.length; i++) {
               if (validNext && obj.hasOwnProperty(path[i])) {
                  obj = obj[path[i]];
                  if (obj === undefined) {
                     validNext = false;
                  }
               } else {
                  return false;
               }
            }
            return true;
         },
         getPropertyValue: function(obj, path) {

            if (path.length === 0 || obj === undefined) {
               return undefined;
            }
            var notation = this.dotNotation(path);
            if (!notation) {
               return;
            }
            path = notation.path;
            for (var i = 0; i < path.length; i++) {
               obj = obj[path[i]];
               if (obj === undefined) {
                  return undefined;
               }
            }
            return obj;
         }
      }
      return WiresUtils;
   });
})(typeof exports !== 'undefined', typeof exports !== 'undefined' ? require('wires-domain') : this.domain)
