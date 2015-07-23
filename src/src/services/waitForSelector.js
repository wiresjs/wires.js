domain.service("$waitForSelector", function(){
   return function(parent, selector){
      return new Promise(function(resolve, reject){
         var found;
         if ( (found = document.querySelector(selector)) ){
            return resolve(found);
         }
         var className, tagName, id;
         if ( selector[0] === "."){
            className  = selector.slice(1, selector.length)
         } else if ( selector[0] === "#"){
            id = selector.slice(1, selector.length)
         } else {
            tagName = selector;
         }
         console.info("Waiting for ", selector, "to added to DOM...");
         var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
               _.each(mutation.addedNodes, function(node){
                  if (className){
                     if ( $(node).hasClass(className) ){
                        observer.disconnect()
                        return resolve(node)
                     }
                  }
                  if (id){
                     if ( $(node).attr("id") === id ){
                        observer.disconnect()
                        return resolve(node)
                     }
                  }
                  if (tagName){
                     if ( node.nodeName.toLowerCase() === tagName ){
                        observer.disconnect()
                        return resolve(node)
                     }
                  }
               })
            })
         })
         observer.observe(parent || document.body, {
            childList: true,
            subtree: true
         })
      })
   }
});
