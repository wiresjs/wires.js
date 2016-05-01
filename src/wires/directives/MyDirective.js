module wires.directives.MyDirective;

import Directive from wires.core;

export class extends Directive {
   static get compiler() {
      return {
         name: 'my-directive',
         schema: 'other/my-directive.html'
      }
   }
   initialize() {

   }

}
