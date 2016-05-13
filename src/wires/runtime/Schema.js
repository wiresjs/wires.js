"use realm";

import lodash as _ from utils;
var data = {};

export realm.requirePackage('wires.schema').then(function(items) {
   var schemas = {};

   _.each(items, function(packg) {
      schemas = _.merge(schemas, packg);
   });
   return schemas;
});
