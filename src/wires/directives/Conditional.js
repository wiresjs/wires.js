module wires.directives.Conditional

import Directive from wires.core;

class Conditional extends Directive {
   static get compiler() {
      return {
         name: 'ng-if',
         type: 'attribute',
         placeholder: true
      }
   }
   initialize(attr) {
      var self = this;
      var el = this.element;
      this.clone = this.element.clone();
      this.clone.schema.detachAttribute("ng-if");

      attr.watchExpression((value) => {

         value ? self.createNodes() : self.removeNodes();
      }, true);
   }

   removeNodes() {
      if (this.clone) {
         this.clone.remove();
      }
   }
   createNodes() {
      var self = this;
      this.clone.initialize();
      self.clone.inflate();
      self.element.original.parentNode
         .insertBefore(self.clone.original, self.element.original.nextSibling);
   }
}
export Conditional;
