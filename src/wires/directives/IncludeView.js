module wires.directives.IncludeView

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

      attr.watchString((fname) => {
         if (self.inflated) {
            self.element.removeChildren()
         }
         if (userSchemas[fname]) {
            self.createSchema(userSchemas[fname])
         }
      }, true);
   }
   createSchema(jsonSchema) {
      this.element.inflateChildren(jsonSchema);
   }

}
export IncludeView;
