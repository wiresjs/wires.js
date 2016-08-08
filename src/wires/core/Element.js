"use realm";

import Attribute, Common from wires.core;
import lodash as _ from utils;
import StringInterpolation from wires.expressions;
import Packer from wires.compiler;
import Directives as appDirectives from wires.runtime;

class Element extends Common {
   constructor(schema, scope, locals) {
      super();
      this.scope = scope;
      this.locals = locals;
      this.children = [];
      this.schema = schema;
      this.attrs = {};
      this.directives = {};
   }

   /**
    * createElement
    * Depending on schema type and directives we could create
    * either element or a placeholder
    *
    * @return {type}  description
    */
   create(children) {
      this.filterAttrs();

      var element;
      if (this.controllingDirective) {
         element = document.createComment('');
      } else {
         element = document.createElement(this.schema.name);
      }

      this.original = element;
      if (children) {

         this.inflate(children);
      }
      return element;
   }

   /**
    * initialize - Happens when we are ready to process schema
    *
    * @param  {type} parent description
    * @return {type}        description
    */
   initialize(parent) {
      var self = this;
      if (!this.schema) {
         throw "Cannot initialize an element without schema!"
      }

      if (!this.controllingDirective) {
         this.initAttrs();
         this.initDirectives();
      } else {
         var opts = this.controllingDirective.__proto__.constructor.compiler;
         this.controllingDirective.initialize(
            this.attrs[opts.name]
         );
      }

      if (!this.controllingDirective && !this.primaryDirective) {
         this.schema.inflate({
            scope: this.scope,
            locals: this.locals,
            schema: this.schema.children,
            target: this
         });
      }
      if (this.primaryDirective) {

         this.primaryDirective.inflate({
            transclude: this.schema.children
         });
      }
   }

   /**
    * initAttrs
    * Initializing attributes
    *
    * @return {type}  description
    */
   initAttrs() {
      _.each(this.attrs, function(attr, name) {
         attr.initialize();
      });
   }

   setPrimaryDirective(name, directive) {
      this.directives[name] = directive;
      this.primaryDirective = directive;
   }

   /**
    * initDirectives
    * initialize directives
    *
    * @return {type}  description
    */
   initDirectives() {
      var self = this;
      _.each(this.directives, function(attr, name) {
         attr.initialize(self.attrs[name]);
      });
   }

   /**
    * filterAttrs
    * Figuring out which directives are in control
    *
    * @return {type}  description
    */
   filterAttrs() {
      var self = this;

      // Go through attributes and check for directives' properties
      _.each(self.schema.attrs, function(item) {
         var attr = new Attribute(self, item.name, item.value);

         if (item.requires) {
            // If we have a custom directive here
            var Dir = appDirectives[item.requires];
            var opts = Dir.compiler;
            if (opts.attribute && opts.attribute.placeholder) {
               self.controllingDirective = new Dir(self);
               attr.directive = self.controllingDirective;
            } else {
               var anyDirective = new Dir(self);
               self.directives[item.name] = anyDirective;
               attr.directive = anyDirective;
            }
         }

         self.attrs[item.name] = attr;
      });
   }

   inflate(schema, scope, locals) {
      this.schema.inflate({
         target: this,
         schema: schema || this.schema.children,
         scope: scope || this.scope,
         locals: locals || this.locals
      });
   }

   /**
    * remove - Removes an element
    * Deatches all watchers
    *
    * @return {type}  description
    */
   remove() {
      this.detach(); // removing all watchers
      if (this.original && this.original.parentNode) {
         this.original.parentNode.removeChild(this.original);
      }
      this.children = [];
      this.directives = [];
   }

   detach() {

      this.__gc();
      _.each(this.children, function(item) {
         item.detach();
      });
      _.each(this.directives, function(item) {
         item.detach();
      });
   }

   /**
    * clone
    * Clones current element
    * Clones schema as well
    *
    * @param  {type} scope  description
    * @param  {type} locals description
    * @return {type}        description
    */
   clone(scope, locals) {
      return this.schema.init(this.schema.clone(), scope || this.scope, locals || this.locals);
   }

   newInstance(schema, scope, locals) {
      return new Element(schema, scope, locals);
   }

   setControllingDirective(directive) {
      this.controllingDirective = directive;
   }

   removeChildren() {
      _.each(this.children, function(child) {
         child.remove();
      });
   }

   // Generic element methods *********************************
   // ********************************************************

   /**
    * append - description
    *
    * @param  {type} target description
    * @return {type}        description
    */
   append(target) {

      this.children.push(target);
      if (!this.controllingDirective) {
         this.original.appendChild(target.original);
      }
   }

   appendTo(target) {
      if (target instanceof window.Element) {
         target.appendChild(this.original);
      } else {
         target.append(this);
      }
   }

   detachElement() {
      if (this.original && this.original.parentNode) {
         this.original.parentNode.removeChild(this.original);
      }
   }

   attachElement() {
      if (this.original && this.original.parentNode) {
         this.original.parentNode.appendChild(this.original);
      }
   }

   insertAfter(target) {
      target.original.parentNode
         .insertBefore(this.original, target.original.nextSibling);
   }

   setChildren(children) {
      this.children = children;
   }

   attr(name, value) {
      if (value === undefined) {
         return this.original.getAttribute(name)
      }
      this.original.setAttribute(name, value);
   }

   /**
    * hide - description
    *
    * @return {type}  description
    */
   hide() {
      this.original.style.display = "none";
   }

   /**
    * show - description
    *
    * @return {type}  description
    */
   show() {
      this.original.style.display = "";
   }

}

export Element;
