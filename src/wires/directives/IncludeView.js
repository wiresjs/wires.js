"use realm";

import Directive from wires.core;
import Schema as userSchemas from wires.runtime;

class IncludeView extends Directive {
   static get compiler() {
      return {
         name: 'ng-include'
      }
   }
   initialize(attr) {

      var self = this;
      var el = this.element;
      this.inflated = false;
      this.isElementDirective = false;
      if (!attr) {
         attr = this.element.attrs["src"];
         this.isElementDirective = true;
      }
      if (!attr) {
         throw "Directive needs either src attribute or self value!";
      }
      if (attr) {
         attr.watchString((fname) => {
            if (self.inflated) {
               self.element.removeChildren()
            }
            if (userSchemas[fname]) {
               self.createSchema(userSchemas[fname])
            }
         }, true);
      }

   }
   createSchema(json) {
      this.element.inflate(json);
   }

}
export IncludeView;
