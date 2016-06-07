"use realm";

import realm
import lodash as _ from utils;

import StringInterpolation as interpolate from wires.expressions;
import Packer from wires.compiler;
import Directives as appDirectives from wires.runtime;
import Parser from wires.htmlparser;

/**
 * ViewCompiler
 * Compiles html string into JSON
 * Precompiles string templates (makes it easier for watchers)
 */
class JSONifier {
   constructor(directives, elements) {
      this.directives = directives;
      this.elements = elements;
      this.json = [];
   }

   getResult() {
      return this.iterateChildren(this.elements)
   }

   createTag(element) {
      var tag = {};
      var self = this;
      var name = element.name;
      var directive = this.directives[name];
      var children = element.children;
      var attrs = {};
      _.each(element.attrs, function(value, name) {
         var attrDirective = self.directives[name]
         attrs[name] = {};
         if (attrDirective) {
            attrs[name].value = value;
            attrs[name].requires = attrDirective.path;
         } else {
            attrs[name] = {
               value: interpolate.parse(value),
            }
         }
      });
      tag.attrs = attrs;
      tag.type = "tag";
      if (directive) {
         tag.type = 'directive';
         tag.name = name;
         tag.requires = directive.path;
      } else {
         tag.name = name;
      }
      tag.children = children && children.length ? this.iterateChildren(children) : [];

      return Packer.pack(tag);
   }
   createText(element) {
      var text = element.value;

      if (text && !text.match(/^\s*$/g)) {
         return Packer.pack({
            type: "text",
            text: interpolate.parse(text)
         });
      }
   }

   /**
    * iterateChildren - a recursive function (private)
    *  Generates JSON
    * @return {type}  description
    */
   iterateChildren(children) {
      var result = [];
      var self = this;

      _.each(children, function(element) {

         var isTag = element.type === "tag"
         var isText = element.type === "text";
         if (isTag) {
            result.push(self.createTag(element));
         }
         if (isText) {
            var t = self.createText(element);
            if (t) {
               result.push(t);
            }
         }
      });
      return result;
   }

   /**
    * htmlString - convert raw html into a JSON
    *
    * @param  {type} html description
    * @return {type}      description
    */
   static htmlString(html) {
      var directives = {};
      _.each(appDirectives, function(directive, path) {
         directives[directive.compiler.name] = {
            opts: directive.compiler,
            cls: directive,
            path: path
         }
      });
      var elements = Parser.parse(html, true);
      const compiler = new JSONifier(directives, elements);
      const result = compiler.getResult();

      return result;
   }
}
export JSONifier;
