var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.BaseAttribute = Wires.Attr.extend({
		initialize : function(scope, dom, element, attr, node) {
			this.scope = scope;
			this.node = node;
			this.instance = scope.instance;
			this.element = element;
			this.attr = attr;
			this.condition = this.attr.value;
			this.addAttibute = false;
			this.bindEssentials(this.condition);
		},
		setValue : function(newVariable, newValue) {
		},
	}, {
		addAttibute : false
	});
})();