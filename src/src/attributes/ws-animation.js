var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	var Animation = Wires.BaseAttribute.extend({
		initialize : function()
		{
			Animation.__super__.initialize.apply(this,arguments);
			var value = this.attr.value;
			$(this.element).data('animation', value );
		},
		setValue : function(newVariable, newValue) {
		},
	});
	
	Wires.attrs['ws-animation'] = Animation;
})();