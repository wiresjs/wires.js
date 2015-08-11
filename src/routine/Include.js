(function() {
   domain.service("Include", ['TagNode', '$pathObject'], function(TagNode, $pathObject) {
      var Include = TagNode.extend({
         initialize : function(data){
            Include.__super__.initialize.apply(this, [data.item, data.scope]);
            this.run = data.run;

         },
         create : function(){
            Include.__super__.create.apply(this, arguments);
            var el = this.element;
            var attrs = this.item.a;
            var scope = this.scope;
            // getting the data from window.__wires_views__
            var structure;
            if ( (structure = window.__wires_views__[this.item.v]) ) {

               if ( attrs && attrs["ws-bind"] ){
                  var wsBind = attrs["ws-bind"];

                  if ( _.values(wsBind.vars).length > 0 ){

                     scope = $pathObject( _.values(wsBind.vars)[0].p, this.scope).value;
                     
                  }
               }

               this.run({
                  structure : structure,
                  target : el,
                  scope : scope
               });
            } else {
               console.error(this.item.v + " was not found!");
            }
         }
      });
      return Include;
   });
})();
