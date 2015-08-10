(function() {
   domain.service("$run", ['TagNode', 'TextNode', 'Repeater', 'Conditional', 'Include'],
      function(TagNode, TextNode, Repeater, Conditional, Include) {
         var run = function(opts) {

            opts = opts || {};
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
                     node = new TagNode(item, scope);
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
                  // If statement
                  if (item.t === 4) {
                     var conditional = new Conditional({
                        run : run,
                        item: item,
                        parent: parent,
                        scope: scope
                     });
                  }

                  // Include
                  if (item.t === 5) {
                     var include = new Include({
                        run : run,
                        item: item,
                        parent: parent,
                        scope: scope,
                        createElements : createElements
                     });
                     include.create(parent);
                  }
               });
            };

            var pNode = opts.parentNode || new TagNode(target);
            if ( !pNode.element){
               pNode.setElement(target);
            }
            createElements(structure, pNode);
         };
         return run;
      });
})();
