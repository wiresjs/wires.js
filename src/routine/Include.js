(function() {
   domain.service("Include", ['TagNode', '$loadView'], function(TagNode, $loadView) {
      var Include = TagNode.extend({
         initialize : function(data){
            Include.__super__.initialize.apply(this, [data.item, data.scope]);
            this.run = data.run;

         },
         create : function(){
            Include.__super__.create.apply(this, arguments);
            var el = this.element;
            var scope = this.scope;
            // getting the data from window.__wires_views__
            var structure;
            if ( (structure = window.__wires_views__[this.item.v]) ) {

               this.run({
                  structure : structure,
                  target : el,
                  scope : scope
               });
            }
         }
      });
      return Include;
   });
})();
