var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs.submit = Wires.BaseAttribute.extend({
		initialize : function() {
			this.__parent__('initialize', arguments);
			
			this.setBindings();
		},
		setBindings : function()
		{
			var self = this;
			$(this.element).submit(function(e){
				console.log(1);
				var result = self.executeStatement();
				//e.originalEvent.preventDefault();
			});
		},
		setValue : function(newVariable, newValue) {
			
		},
	});
})();