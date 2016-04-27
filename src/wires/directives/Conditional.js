module wires.directives.Conditional

import Directive from wires.core;

class Conditional extends Directive {
   static get compiler() {
      return {
         name: 'ng-if',
         placeholder: true
      }
   }
   initialize() {
      var self = this;
      var el = this.element;
      var attr = el.attrs['ng-if'];
      this.clone = this.element.clone();
      this.clone.schema.detachAttribute("ng-if");

      attr.watchExpression(function(value, oldValue, changes) {

         if (value !== oldValue || oldValue === undefined) {
            if (value) { // diplaying underlying elements
               self.createNodes();
            } else {
               self.removeNodes();
            }
         }
      }, true);
   }
   removeNodes() {
      //   console.log("REMOVE")
      if (this.clone) {
         this.clone.remove();
      }
   }
   createNodes() {
      var self = this;
      //console.log("CREATE")
      this.clone.initialize();
      self.clone.inflate();
      self.element.original.parentNode
         .insertBefore(self.clone.original, self.element.original.nextSibling);

   }

}
export Conditional;
