"use realm";

import AngularExpressions from wires.expressions;
import Directive from wires.core;

class Model extends Directive {
   static get compiler() {
      return {
         name: 'ng-model'
      }
   }
   initialize(attr) {

      var el = this.element.original;
      var type = "text";
      var typeAttribute = this.element.attrs["type"];
      var selfAssign = false;
      if (typeAttribute) {
         type = typeAttribute.value[0];
      }
      if (el.nodeName.toLowerCase() === "select") {
         type = "select";
      }

      attr.watchExpression(function(value) {
         if (type === "text") {
            el.value = value;
         }
         if (type === "checkbox") {
            el.checked = value;
         }

         if (type === "select") {
            el.value = value;
         }
         if (type === "radio") {
            if (value === el.value) {
               el.checked = true;
            }
         }
      });

      // Bind events ************************
      if (type === "text") {
         this.bindEvent("keyup", function() {
            attr.assign(el.value);
         });
      }
      // checkbox
      if (type === "checkbox") {
         this.bindEvent("click", function() {
            attr.assign(el.checked);
         });
      }
      // select
      if (type === "select") {
         this.bindEvent("change", function() {
            attr.assign(el.value);
         });
      }
      if (type === "radio") {
         this.bindEvent("click", function() {
            attr.assign(el.value);
         });
      }
   }
}
export Model;
