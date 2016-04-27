module wires.core.Watchable

import lodash as _ from utils;
class Watchable {
   constructor() {

   }
   registerWatcher(watcher) {
      this.watchers = this.watchers || [];
      this.watchers.push(watcher);
   }
   destroyWatchers() {
      _.each(this.watchers, function(watcher) {
         watcher.destroy();
      });
   }
}
export Watchable
