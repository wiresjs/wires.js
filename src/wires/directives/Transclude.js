"use realm";

import Directive from wires.core;

class Transclude extends Directive {
   static get compiler() {
      return {
         name: 'ng-transclude'
      }
   }
   initialize() {
      if (this.element.scope.$$transcluded) { // swap children to transclusion
         this.element.schema.children = this.element.scope.$$transcluded;
      }
   }
   hide() {
      this.element.hide();
   }
   show() {
      this.element.show();
   }
}
export Transclude;
