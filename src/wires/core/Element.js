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

   /**
    * initialize - Happens when we are ready to process schema
    *
    * @param  {type} parent description
    * @return {type}        description
    */
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
         this.initDirectives();
      } else {
         this.controllingDirective.initialize(
            this.attrs[this.controllingDirective.name]
         );
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
         var attr = new Attribute(self, item.name, item.value);;
         if (item.requires) {
            // If we have a custom directive here
            var Dir = appDirectives[item.requires];
            if (Dir.compiler.placeholder) {
               self.controllingDirective = new Dir(self, item.name, item.value);
               attr.directive = self.controllingDirective;
            } else {
               var anyDirective = new Dir(self, item.name, item.value);
               self.directives[item.name] = anyDirective;
               attr.directive = anyDirective;
            }
         }

         self.attrs[item.name] = attr;
      });
   }

   /**
    * createElement
    * Depending on schema type and directives we could create
    * either element or a placeholder
    *
    * @return {type}  description
    */
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

   /**
    * remove - Removes an element
    * Deatches all watchers
    *
    * @return {type}  description
    */
   remove() {
      if (this.original && this.original.parentNode) {
         this.original.parentNode.removeChild(this.original);
      }
      this.detach(); // removing all watchers
   }

   /**
    * detach
    * Destorying watchers from directives and attributes
    *
    * @return {type}  description
    */
   detach() {
      this.destroyWatchers();
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
      return new Element(this.schema.clone(), scope || this.scope, locals || this.locals);;
   }

   /**
    * inflateNode - description
    *
    * @param  {type} item description
    * @return {type}      description
    */
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

   removeChildren() {
      _.each(this.children, function(child) {
         child.remove();
      });

   }

   /**
    * inflateChildren - description
    *
    * @param  {type} children description
    * @return {type}          description
    */
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
      this.original.appendChild(target.original);
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
