"use realm";

import Directive from wires.core;

class Conditional extends Directive {

   static get compiler() {
      return {
         name: 'ng-if',
         type: 'attribute',
         attribute: {
            placeholder: true
         }
      }
   }

   initialize(attr) {
      var self = this;
      var el = this.element;
      this.$initialized = false;
      attr.watchExpression((value) => {
         value ? self.createNodes() : self.removeNodes();
      }, true);
   }

   removeNodes() {
      if (this.clone) {
         this.clone.remove();
      }

      // if (this.$initialized) {
      //    this.clone.detachElement();
      // }
   }

   createNodes() {
      var self = this;
      // if (this.$initialized) {
      //    return this.clone.insertAfter(this.element);;
      // }
      // this.$initialized = true;
      this.clone = this.element.clone();
      this.clone.schema.detachAttribute("ng-if");
      this.clone.create();
      this.clone.insertAfter(this.element);
      this.clone.initialize();

   }
}
export Conditional;
