"use realm";

import Directive from wires.core;
//import Dispatcher as dispatcher from wires.app;

class WsRoute extends Directive {
   static get compiler() {
      return {
         name: 'ws-route'
      }
   }
   initialize(attr) {
      var self = this;
      var route = this.element.scope;
      var $router = route.$$router;
      this.element.schema.children = [];
      if ($router && $router.dispatcher) {
         $router.dispatcher.register(this.element, route);
      }
   }

}
export WsRoute;
