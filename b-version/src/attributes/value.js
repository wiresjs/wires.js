var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs.value = Wires.Attr.extend({
		initialize : function(scope, dom, element, attr) {
			Wires.attrs.value.__super__.initialize.apply(this, arguments);
			this.element = element;
			this.scope = scope;
			this.instance = scope.instance;
			this.bindChanges();
		},
		bindChanges : function() {
			var self = this;
			this.element.addEventListener("keydown", function(evt) {
				if (evt.keyCode === 13) {
					if (self.variables.length > 0) {
						self.ignoreNodeSetValue = true;
						self.variables[0].setValue(this.value, {ignore : this.element});
					}
				}
			}, false);
		},
		setValue : function(variable, newValue) {
			if (this.ignoreNodeSetValue){
				this.ignoreNodeSetValue = false;
				return;
			}
			var result = this.executeStatement(variable, newValue, 'return');
			this.element.value = result;
		},
	});
})();