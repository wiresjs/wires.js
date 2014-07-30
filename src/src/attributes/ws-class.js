var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs['ws-class'] = Wires.BaseAttribute.extend({
		setValue : function(newVariable, newValue) {
			var conditions = this.executeStatement(newVariable, newValue, 'return');
			var self = this;
			_.each(conditions, function(shouldPresent, className){
				if ( shouldPresent ){
					$(self.element).addClass(className);
				} else {
					$(self.element).removeClass(className);
				}
				
			})
		},
	});
})();