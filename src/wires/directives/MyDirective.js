"use realm";

import Directive from wires.core;

class MyDirective extends Directive {
   static get compiler() {
      return {
         name: 'my-directive',
         schema: 'other/my-directive.html'
      }
   }
   initialize() {
      this.myName = "This is my name";
   }

}
export MyDirective;
