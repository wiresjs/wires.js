var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs.animation = Wires.BaseAttribute.extend({
		initialize : function()
		{
			Wires.attrs.animation.__super__.initialize.apply(this,arguments);
			var value = this.attr.value;
			$(this.element).data('animation', value );
		},
		setValue : function(newVariable, newValue) {
		},
	});
})();