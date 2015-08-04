domain.service("TagAttribute", ['$evaluate'],function($evaluate){
   var TagAttribute =  Wires.Class.extend({
      initialize : function(opts){
         this.attr = opts.attr;
         this.name = opts.name;
         this.scope = opts.scope;
         this.element = opts.element;
      },
      create : function(){
         this.attribute = document.createAttribute(this.name);

         this.element.setAttributeNode(this.attribute);
         this.watcher = this.startWatching();
      },
      onValue : function(data){
         this.attribute.value = data.str;
      },
      startWatching : function(){
         var self = this;

         return $evaluate(this.attr, {
            scope: this.scope,
            changed: function(data) {
               // If we have a custom listener
               if ( self.onExpression ){
                  if ( data.expressions &&  data.expressions.length > 0){
                     self.onExpression.bind(self)( data.expressions[0] )
                  } else {
                     self.onExpression.bind(self)()
                  }
               } else {
                  if ( self.onValue ){
                     self.onValue.bind(self)(data);
                  }
               }
            }

         });
      }
   })
   return TagAttribute;
})
