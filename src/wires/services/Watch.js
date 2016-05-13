"use realm";

import AngularExpressions, WatchBatch from wires.expressions;

import lodash as _ from utils;

var Watch = (o, expression, fn, instant) => {
   var scope = o.scope || {};
   var locals = o.locals || {};
   var variables = AngularExpressions.extract(expression);
   var model = AngularExpressions.compile(expression);
   var oldValue;
   if (instant) {
      oldValue = model(scope, locals);
      fn(oldValue, undefined, {});
   }

   return WatchBatch({
      locals: locals,
      scope: scope,
      batch: variables
   }, function(changes) {
      var result = model(scope, locals);

      fn(result, oldValue, changes);
      oldValue = result;
   });
}
export Watch;
