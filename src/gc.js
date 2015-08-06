(function() {
   var observer;
   // Garbage collector based on MutationObserver

   $(function(){
      var target = document.querySelector('body');

      // create an observer instance
      observer = new MutationObserver(function(mutations) {
         mutations.forEach(function(mutation) {
            if ( mutation.removedNodes ){
               _.each(mutation.removedNodes, function(node){
                  if ( node.$tag ){
                     if ( node.$tag  && node.$tag.gc){
                        
                        node.$tag.gc(true);
                     }
                  }
               })
            }
         });
      });

      // configuration of the observer:
      var config = {
         childList: true,
         subtree : true
      };

      // pass in the target node, as well as the observer options
      observer.observe(target, config);
   });


})();
