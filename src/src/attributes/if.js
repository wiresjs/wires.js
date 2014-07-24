var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs['if'] = Wires.BaseAttribute.extend({
		initialize : function() {
			Wires.attrs['if'].__super__.initialize.apply(this, arguments);
			var self = this;
			// Using defer, cuz at the current moment we don't have it in the DOM
			_.defer(function() {
				self.node.placeholder.nodeValue = 'wires-if: ' + self.condition;
			});

		},
		setValue : function(newVariable, newValue) {
			var result = this.executeStatement(newVariable, newValue, 'return');
			var el = $(this.element);
			if (result) {
				el.insertBefore(this.node.placeholder);
			} else {
				el.remove();
			}
		},
	}, {
		shouldAppendElement : false
	});
})();