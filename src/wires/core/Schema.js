"use realm";

import Packer from wires.compiler;
import lodash as _ from utils;
import Element, TextNode from wires.core;
import Directives as appDirectives, Schema as userSchemas from wires.runtime;

class Schema {
   constructor(json) {
      this.json = json;
      if (json) {
         var data = Packer.unpack(json);
         var self = this;
         _.each(data, function(value, key) {
            self[key] = value;
         });
      }
   }

   detachAttribute(name) {
      _.remove(this.attrs, function(attrs) {
         return attrs.name === name
      });
   }

   inflate(opts) {
      return Schema.inflate(opts)
   }

   init(schema, scope, locals) {
      return Schema.init(schema, scope, locals);
   }

   static init(schema, scope, locals) {
      var element;
      if (schema.type === "tag") {
         element = new Element(schema, scope, locals);
      }
      if (schema.type === "directive") {
         element = Schema.createDirectiveElement(schema, scope, locals);
      }
      if (schema.type === "text") {
         element = new TextNode(schema, scope, locals);
      }
      return element;
   }

   static createDirectiveElement(item, scope, locals) {
      var self = this;
      var element;

      var Dir = appDirectives[item.requires];
      if (Dir) {

         var opts = Dir.compiler || {};
         var directive = new Dir();

         if (opts.element && opts.element.placeholder) {
            element = new Element(item, scope, locals);
            directive.element = element;
            element.setControllingDirective(directive);
         } else {
            element = new Element(item, scope, locals);
            directive.element = element;
            element.setPrimaryDirective(item.name, directive);
         }
      }
      return element;
   }

   static inflate(opts) {
      opts = opts || {};
      var scope = opts.scope;
      var locals = opts.locals;
      var target = opts.target;
      var json = opts.schema;
      var children = [];
      _.each(json, function(item) {
         var schema = new Schema(item);
         var element = Schema.init(schema, scope, locals);
         if (element) {
            element.create();

            element.appendTo(target);
            element.initialize();
         }
      });
      var element;
   }

   clone() {
      return new Schema(this.json);
   }
}

export Schema;
