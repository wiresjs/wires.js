module wires.core.TextNode
import StringInterpolation from wires.expressions;
import Watchable from wires.core;

class TextNode extends Watchable {

   constructor(schema, scope, locals) {
      super();
      this.schema = schema;
      this.scope = scope;
      this.locals = locals;
   }

   create() {
      this.original = document.createTextNode('');
      return this.original;
   }

   initialize() {
      var self = this;
      var model = StringInterpolation.compile(this.schema.text);
      model(this.scope, this.locals, function(value) {
         self.original.nodeValue = value;
      }, true);

   }
   insertAfter(target) {
      target.original.parentNode
         .insertBefore(this.original, target.original.nextSibling);
   }
   appendTo(target) {
      if (target instanceof window.Element) {
         target.appendChild(this.original);
      } else {
         target.append(this);
      }
   }

   detach() {
      return this.destroyWatchers();
   }
}
export TextNode;
