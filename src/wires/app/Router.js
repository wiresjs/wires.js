"use realm";
import Dispatcher as dispatcher from wires.app;
import lodash as _ from utils;

class Router {

   static start() {
      dispatcher.assign(this);
   }

   render(target) {
      if (_.isString(target)) {
         return {
            type: "schema",
            path: target
         }
      }
      if (target instanceof Router) {
         return {
            type: "router",
            instance: target
         }
      }
   }
}
export Router;
