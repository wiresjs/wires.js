var Wires = Wires || {};
(function() {
   'use strict';
   Wires.TextNode = Wires.Node.extend({
      initialize: function(scope, dom, target, parent) {
         this.dom = dom;
         this.scope = scope;
         this.instance = scope.instance;
         this.element = document.createTextNode(this.dom.data);
         if (this.dom.persists) {
            this.element.__persists = true;
         }
         this.bindEssentials(dom.data);
         var self = this;
         //this.async(function() {
         target.appendChild(self.element);
         //	});
         if (dom.children) {
            //this.async(function() {
            Wires.World.parse(scope, dom.children, this.element);
            //});
         }
      },
      setValue: function(variable, value) {
         var value = this.compileValue(variable, value);
         this.element.nodeValue = value;
      },
      getElement: function() {
         var self = this;
         return new Promise(function(resolve, reject) {
            return resolve(self.element);
         })
      }
   });
})();
