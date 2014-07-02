var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs.slide = Wires.BaseAttribute.extend({
		setValue : function(newVariable, newValue) {
			var result = this.executeStatement(newVariable, newValue, 'return');
			if (newValue === undefined) {
				$(this.element).css('display', result ? 'block' : 'none');
			} else {
				if (result) {
					console.log('slide up');
					$(this.element).slideDown();
				} else {
					console.log('slide down');
					$(this.element).slideUp();
				}
			}
		},
	});
})();