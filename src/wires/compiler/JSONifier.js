module wires.compiler.JSONifier

import realm
import lodash as _ from utils;
import UniversalQuery from wires.utils;
import StringInterpolation as interpolate from wires.expressions;
import Packer from wires.compiler;
import Directives as appDirectives from wires.runtime;

/**
 * ViewCompiler
 * Compiles html string into JSON
 * Precompiles string templates (makes it easier for watchers)
 */
class JSONifier {
   constructor(directives) {
      this.directives = directives;
      this.json = [];
   }

   createTag(element) {
      const tag = {};
      const self = this;
      var name = (element.name || element.nodeName).toLowerCase()
      const directive = this.directives[name];
      const children = isNode ? element.children : element.childNodes;
      const attrs = {};
      var elAttrs = isNode ? element.attribs : element.attributes;

      _.each(elAttrs, function(attr, key) {
         var name = isNode ? key : attr.nodeName;
         var attrDirective = self.directives[name]
         var stringValue = isNode ? attr : attr.nodeValue;

         attrs[name] = {};
         if (attrDirective) {
            attrs[name].value = stringValue;
            attrs[name].requires = attrDirective.path;
         } else {
            attrs[name] = {
               value: interpolate.parse(stringValue),
            }
         }
      });
      tag.attrs = attrs;
      tag.type = "tag";
      if (directive) {
         tag.type = 'directive';
         tag.requires = directive.path;
      } else {
         tag.name = name;
      }
      tag.children = children.length ? this.iterateChildren(children) : [];
      return Packer.pack(tag);
   }
   createText(element) {
      var text = element.data || element.nodeValue;
      return Packer.pack({
         type: "text",
         text: interpolate.parse(text)
      });
   }

   /**
    * iterateChildren - a recursive function (private)
    *  Generates JSON
    * @return {type}  description
    */
   iterateChildren(children) {
      const result = [];
      const self = this;
      _.each(children, function(element) {
         var isTag = element.type === "tag" || element.nodeType == 1;
         var isText = element.type === "text" || element.nodeType == 3;

         if (isTag) {
            result.push(self.createTag(element));
         }
         if (isText) {
            result.push(self.createText(element));
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
      var $ = UniversalQuery.init(html);
      const compiler = new JSONifier(directives);
      const result = compiler.iterateChildren($.children());
      return result;
   }
}
export JSONifier;
