var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs.visible = Wires.Attr.extend({
		initialize : function(scope, dom, element, attr) {
			this.scope = scope;
			this.instance = scope.instance;
			this.element = element;
			this.attr = attr;
			this.condition = this.attr.value;
			this.addAttibute = false;
			this.bindEssentials(this.condition);
		},
		setValue : function(newVariable, newValue) {
			var result = this.executeStatement(newVariable, newValue, 'return');
			
			$(this.element).css('display', result ? 'block' : 'none');
			
		},
	},{addAttibute : false});
})();