module wires.runtime.Schema;

var data = {};
if (!isNode) {
   if (realm.isRegistered('wires.sample.schema')) {
      data = realm.require('wires.sample.schema', function(views) {
         return views;
      });
   }

}

export data;
