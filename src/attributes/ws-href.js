domain.service("attrs.ws-href", ['TagAttribute', '$history'],
   function(TagAttribute, $history) {
      var WsVisible = TagAttribute.extend({
         // Overriding default method
         // (we don't need to create an attribute for this case)
         create: function() {
            this.watcher = this.startWatching();
         },
         onValue: function(v) {

            if ( v && v.str){
               var link = v.str;

               if ( this.element.nodeName === "A"){
                  $(this.element)
                     .attr("href", link)
               }

                  $(this.element).click(function(event){
                     event.preventDefault();
                     $history.go(link);
                  })
            }
         }
      });
      return WsVisible;
   })
