var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs['if'] = Wires.BaseAttribute.extend({
		initialize : function() {
			Wires.attrs['if'].__super__.initialize.apply(this, arguments);
		},
		onElementReady : function() {
			this.node.placeholderBefore.nodeValue = 'wires-if: ' + this.condition;
			this.node.placeholderAfter.nodeValue = '/wires-if: ' + this.condition;
		},
		setValue : function(newVariable, newValue) {
			var result = this.executeStatement(newVariable, newValue, 'return');
			var el = $(this.element);
			
			if (result) {
				
				el.insertBefore(this.node.placeholderAfter);
			} else {
				el.remove();
			}
		},
	}, {
		shouldAppendElement : false,
		claimsChildren : false
	});
})();