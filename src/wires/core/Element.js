module wires.core.Element;

import Attribute, Watchable, TextNode, Schema from wires.core;
import lodash as _ from utils;
import StringInterpolation from wires.expressions;
import Packer from wires.compiler;
import Directives as appDirectives from wires.runtime;

class Element extends Watchable {
   constructor(schema, scope, locals) {
      super();
      this.scope = scope;
      this.locals = locals;
      this.claimed = false;
      this.children = [];
      this.schema = schema;
      this.attrs = {};
      this.directives = {};

   }

   initialize(parent) {
      var self = this;
      if (!this.schema) {
         throw "Cannot initialize an element without a schema!"
      }
      this.filterAttrs();

      if (this.schema instanceof Schema) {
         this.original = this.createElement();
      } else {
         this.original = this.schema;
      }
      if (parent) {
         parent.append(this)
      }
      if (!this.controllingDirective) {
         this.initAttrs();
      } else {
         this.controllingDirective.initialize();
      }
   }
   initAttrs() {
      _.each(this.attrs, function(attr, name) {
         attr.initialize();
      });
   }
   filterAttrs() {
      var self = this;

      // Go through attributes and check for directives' properties
      _.each(self.schema.attrs, function(item) {
         var attr = new Attribute(self, item.name, item.value);;
         if (item.requires) {
            // If we have a custom directive here
            var ControllingDirective = appDirectives[item.requires];
            if (ControllingDirective.compiler.placeholder) {

               self.controllingDirective = new ControllingDirective(self, item.name, item.value);
            }
            attr.directive = self.controllingDirective;
         }

         self.attrs[item.name] = attr;
      });
   }

   createElement() {
      var element;
      if (this.controllingDirective) {
         element = document.createComment('');
      } else {
         element = document.createElement(this.schema.name);
      }
      return element;
   }

   inflate(schema) {

      schema = schema || this.schema;

      this.inflateChildren(schema.children);

   }
   remove() {
      if (this.original && this.original.parentNode) {
         this.original.parentNode.removeChild(this.original);
         this.detach();
      }

   }
   detach() {
      this.destroyWatchers();
      _.each(this.children, function(item) {
         item.detach();
      });
   }

   clone(schema, scope, locals) {
      var newEl = new Element(schema || this.schema, scope || this.scope, locals || this.locals);
      return newEl;
   }
   ready(cb) {
      this.onReady = cb;
   }

   append(target) {
      this.children.push(target);
      this.original.appendChild(target.original);
   }

   inflateNode(item) {
      var self = this;
      if (item.type === "tag") {
         var element = new Element(item, self.scope, self.locals);

         element.initialize(self);

         if (item.children.length > 0 && !element.claimed) {
            element.inflateChildren(item.children)
         }
      }
      if (item.type === "text") {
         var textNode = new TextNode(item, self.scope, self.locals);

         self.append(textNode);
      }
   }
   inflateChildren(children) {
      if (this.controllingDirective) {
         return;
      }
      var self = this;
      children = children || this.schema.children;
      _.each(children, function(item) {

         self.inflateNode(new Schema(item));
      });
   }
}

export Element;
