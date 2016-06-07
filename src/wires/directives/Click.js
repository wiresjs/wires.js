"use realm";

import Directive from wires.core;

class Click extends Directive {
   static get compiler() {
      return {
         name: 'ng-click'
      }
   }
   initialize(attr) {

      var callback = attr.asFunction();
      var scope = this.element.scope;
      this.element.bindEvent("click", function() {
         callback.bind(scope)({
            event: event
         })
      });
   }
}

export Click;
