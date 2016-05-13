"use realm";

import StringInterpolation, AngularExpressions, WatchBatch from wires.expressions;
import Watch from wires.services;
import Common from wires.core;

class Attribute extends Common {
   constructor(element, name, value) {
      super();
      this.element = element;
      this.name = name;
      this.value = value;
      this.watchers = [];
      this.model;
   }
   initialize() {
      // Must ignore regular initialization if an attribute is linked to a directive
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

   assign(value) {
      if (!this.model) {
         this.model = AngularExpressions.compile(this.value);
      }
      this.model.assign(this.element.scope, value);
   }

   asFunction() {
      var compiled = AngularExpressions.compile(this.value);
      var scope = this.element.scope;
      return function(locals) {
         compiled(scope, locals)
      }
   }

   watchExpression(cb, instant) {

      var watcher = Watch({
         locals: this.element.locals,
         scope: this.element.scope
      }, this.value, function(value, oldValue, changes) {

         if (value !== oldValue || oldValue === undefined) {
            return cb(value, oldValue, changes);
         }
      }, instant);

      this.registerWatcher(watcher);
   }
   watchString(cb, instant) {
      var model = StringInterpolation.compile(this.value);
      var watcher = model(this.element.scope, this.element.locals, function(value, oldValue) {
         if (value !== oldValue || oldValue === undefined) {
            return cb(value, oldValue);
         }
      }, instant)
      this.registerWatcher(watcher);
   }
}
export Attribute;
