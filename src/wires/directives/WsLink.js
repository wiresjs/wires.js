"use realm";

import Directive from wires.core;
import PushState from wires.app;
//import Dispatcher as dispatcher from wires.app;

class WsLink extends Directive {
   static get compiler() {
      return {
         name: 'ws-link'
      }
   }
   initialize(attr) {
      var self = this;
      this.element.bindEvent("click", function(e) {
         e.preventDefault();
         e.stopPropagation();
         var link = self.element.attr("href");
         PushState.force({}, link);
      })
      attr.watchString(function(value) {
         self.element.attr("href", value);
      }, true);
   }

}
export WsLink;
