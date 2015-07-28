(function() {
   domain.service("$run", ['TagNode', 'TextNode', 'Repeater'],
      function(TagNode, TextNode, Repeater) {
         var run = function(opts) {

            var opts = opts || {};
            var structure = opts.structure || [];
            var target = opts.target || document.querySelector("section");
            var scope = opts.scope || {};

            var createElements = function(children, parent) {
               
               _.each(children, function(item) {

                  var node;
                  if (item.type === "text") {
                     node = new TextNode(item, scope);
                     node.create(parent);
                  }
                  if (item.type === "tag") {
                     node = new TagNode(item, scope)
                     var element = node.create(parent);
                     if (item.children) {
                        createElements(item.children, node);
                     }
                  }
                  if (item.type === "repeater") {
                     var repeater = new Repeater({
                        run : run,
                        item: item,
                        parent: parent,
                        scope: scope
                     });
                  }
               })
            }
            var pNode = opts.parentNode || new TagNode(target);
            if ( !pNode.element){
               pNode.element = target;
            }
            createElements(structure, pNode);
         }
         return run;
      });
})();
