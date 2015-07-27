(function() {
   domain.service("$run", ['TagNode', 'TextNode'],
      function(TagNode, TextNode) {
         return function(opts) {
            var opts = opts || {};
            var structure = opts.structure || [];
            var target = opts.target || document.querySelector("section");

            var scope = opts.scope || {};
            return new Promise(function(resolve, reject) {
               var createElements = function(children, parent){
                  _.each(children, function(item){
                     var node;
                     if ( item.type === "text"){
                        node = new TextNode(item, scope);
                        node.create(parent);
                     }
                     if ( item.type === "tag"){
                        node = new TagNode(item, scope)
                        var element = node.create(parent);
                        if ( item.children ){
                           createElements(item.children, node);
                        }
                     }
                  })
               }
               var pNode = new TagNode(target);
               pNode.element = target;

               createElements(structure, pNode)
            })
         }
      });
})();
