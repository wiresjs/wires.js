domain.service("attributes.ws-href", ['$history'], function($history){
   return Wires.BaseAttribute.extend({
		setValue : function(newVariable, newValue) {
			var link = this.compileValue(newVariable,newValue);
         var self = this;
         $(self.element).attr("href", link);
         $(self.element).click(function(event){
            event.preventDefault();
            $history.go(link);
         });
		},
	});
})
