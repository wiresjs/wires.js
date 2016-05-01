module wires.expressions.WatchBatch;

import lodash as _ from utils;
import AsyncWatch from wires;
import DotNotation from wires.utils;

export function(opts, cb) {
   opts = opts || {};
   var $locals = opts.locals || {};
   var $scope = opts.scope || {};

   var batch = opts.batch ? [].concat(opts.batch) : [];

   var paths = [];

   _.each(batch, function(item) {
      var key = _.keys(item)[0];
      var prop = item[key];
      paths.push(key);
   });
   var a = false;

   var anyValueChanged = function(value) {

   }

   var watchers = [];
   // collecting watchers
   _.each(paths, function(path) {

      if (DotNotation.hasProperty($locals, path)) {
         watchers.push(AsyncWatch($locals, path, anyValueChanged));
      } else {
         watchers.push(AsyncWatch($scope, path, anyValueChanged));
      }
   });
   watchers = _.compact(watchers);

   return watchers.length && cb ? AsyncWatch.subscribe(watchers, cb) : {} //

}
