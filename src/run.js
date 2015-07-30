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
                  // type TEXT
                  if (item.t === 1) {
                     node = new TextNode(item, scope);
                     node.create(parent);
                  }
                  // type TAG
                  if (item.t === 2) {
                     node = new TagNode(item, scope)
                     var element = node.create(parent);
                     if (item.c) {
                        createElements(item.c, node);
                     }
                  }

                  // Type Repeater
                  if (item.t === 3) {
                     var repeater = new Repeater({
                        run : run,
                        item: item,
                        parent: parent,
                        scope: scope
                     });
                  }
               })
            }

            var detached = document.createElement("div");

            var pNode = opts.parentNode || new TagNode(target);
            if ( !pNode.element){
               pNode.element = target;
            }
            createElements(structure, pNode);
         

         }
         return run;
      });
})();
