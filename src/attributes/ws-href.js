(function() {


   domain.service("attrs.ws-href", ['TagAttribute', '$history'],
      function(TagAttribute, $history) {
         var WsVisible = TagAttribute.extend({
            // Overriding default method
            // (we don't need to create an attribute for this case)
            create: function() {
               this.watcher = this.startWatching();
            },
            detach : function(){
               if ( this.element ){
                  this.element.removeEventListener("click", this.clickListener);
               }
            },
            onValue: function(v) {
               if (v && v.str) {
                  var link = v.str;

                  if (this.element.nodeName === "A") {
                     this.element.setAttribute("href", link);
                  }
                  this.clickListener = this.element.addEventListener("click", function(event){
                     event.preventDefault();
                     $history.go(link);
                  })
               }
            }
         });
         return WsVisible;
      })
})();
