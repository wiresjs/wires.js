"use realm";

import lodash as _ from utils;
class Common {
   constructor() {
      this.__events = [];
   }

   bindEvent(name, cb) {
      var target = this.element ? this.element.original : this.original;
      if (target) {
         target.addEventListener(name, cb, false)
         this.__events.push({
            name: name,
            cb: cb
         });
      }
   }

   /**
    * "GarbageCollector"
    * Removes listeners and watchers
    */
   __gc() {
      this.destroyWatchers()
      this.destroyListeners();
   }
   destroyListeners() {
      var self = this;
      var target = this.element ? this.element.original : this.original;
      if (target) {
         _.each(this.__events, function(item, index) {
            target.removeEventListener(item.name, item.cb);
            self.__events[index] = undefined;
         });
         this.__events = {};
      }
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
export Common
