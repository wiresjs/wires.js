var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs['selected'] = Wires.BaseAttribute.extend({
		initialize : function() {
			Wires.attrs.selected.__super__.initialize.apply(this, arguments);
		},
		
		setValue : function(newVariable, newValue) {
			var result = this.executeStatement(newVariable, newValue, 'return');
			var el = $(this.element);
			if (result) {
				el.attr('selected','');
			} else {
				el.removeAttr('selected');
			}
		},
	}, {addAttibute : false});
})();