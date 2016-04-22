module Directive;

import _

var Directive = class {
   static get type() {
      return "attribute";
   }
   constructor() {

   }
}

export class SuperTest extends Directive {
   static get type() {
      return "pukka"
   }

}
