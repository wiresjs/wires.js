module wires.core.TextNode
import StringInterpolation from wires.expressions;
import ConfigurableNode from wires.core;

class TextNode extends ConfigurableNode {

   initialize(config) {
      var text = document.createTextNode('');
      var model = StringInterpolation.compile(config.text);
      model(this.scope, this.locals, function(value) {

         text.nodeValue = value;
      });
      return text;
   }
   detach() {
      return this.destroyWatchers();
   }
}
export TextNode;
