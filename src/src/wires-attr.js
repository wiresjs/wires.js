var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Attr = Wires.Node.extend({
		initialize : function(scope, dom, element, attr) {
			this.instance = scope.instance;
			this.scope = scope;
			this.element = element;
			this.attr = attr;
			this.bindEssentials(this.attr.value);
		},
		setValue : function(variable, newValue) {
			var value = this.compileValue(variable, newValue);
			//this.async(function() {
				this.attr.value = value;
			//});
		},
		// Execute statement
		executeStatement : function(incomingVar, newValue, resultNeeded) {
			
			return Wires.Exec.expression({
				statement : this.attr.value,
				incomingVar : incomingVar,
				resultNeeded : resultNeeded,
				newValue : newValue,
				scope : this.scope,
				variables : this.variables
			});
		}
	}, {
		claimsChildren : false,
		addAttibute : true
	});
})();