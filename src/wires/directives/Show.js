module wires.directives.Show

import Directive from wires.core;

class Show extends Directive {
   static get compiler() {
      return {
         name: 'ng-show'
      }
   }
   initialize() {
      var self = this;
      var el = this.element;
      var attr = el.attrs['ng-show'];

      attr.watchExpression(function(value, oldValue, changes) {
         if (value !== oldValue || oldValue === undefined) {
            if (value) { // diplaying underlying elements
               self.show();
            } else {
               self.hide();
            }
         }
      }, true);
   }
   hide() {
      this.element.hide();
   }
   show() {
      this.element.show();
   }
}
export Show;