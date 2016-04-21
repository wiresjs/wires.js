(function(domain) {
   return domain.module("WatchBatch", function(_, AsyncWatch, WiresUtils) {
      return function(opts, cb) {
         opts = opts || {};
         var $locals = opts.locals || {};
         var $scope = opts.scope || {};
         var batch = opts.batch || [];

         var paths = [];
         _.each(batch, function(item) {
            var key = _.keys(item)[0];
            var prop = item[key];
            paths.push(key);
         });
         var a = false;

         var anyValueChanged = function(value) {}

         var watchers = [];
         // collecting watchers
         _.each(paths, function(path) {
            if (WiresUtils.hasProperty($locals, path)) {
               watchers.push(AsyncWatch($locals, path, anyValueChanged));
            } else {
               watchers.push(AsyncWatch($scope, path, anyValueChanged));
            }
         });

         return AsyncWatch.subscribe(watchers, cb);
      }
   });
})(typeof exports !== 'undefined' ? require('wires-domain') : this.domain)
