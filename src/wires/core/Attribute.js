module wires.core.Attribute
import StringInterpolation from wires.expressions;
import ConfigurableNode from wires.core;
import AngularExpressions, WatchBatch from wires.expressions;
import Watch from wires.services;
import Watchable from wires.core;

class Attribute extends Watchable {
   constructor(element, name, value) {
      super();
      this.element = element;
      this.name = name;
      this.value = value;
      this.watchers = [];
   }
   initialize() {
      // Must ignore regular initialization if an attribute linked to a directive
      if (this.directive) {
         return;
      }
      var original = document.createAttribute(this.name);
      this.original = original;
      this.element.original.setAttributeNode(original);
      var self = this;
      this.registerWatcher(this.watchString(function(value) {
         self.original.value = value;
      }));
   }
   watchExpression(cb, instant) {
      this.registerWatcher(Watch({
         locals: this.element.locals,
         scope: this.element.scope
      }, this.value, cb, instant));
   }
   watchString(cb) {
      var model = StringInterpolation.compile(this.value);
      this.registerWatcher(model(this.element.scope, this.element.locals, cb));
   }
}
export Attribute;
