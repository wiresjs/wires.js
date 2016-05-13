"use realm";

import Directive from wires.core;

class ToggleClass extends Directive {
   static get compiler() {
      return {
         name: 'ng-class'
      }
   }
   constructor() {
      super();
   }
   initialize($parent, attrs) {

   }
}

export ToggleClass;
