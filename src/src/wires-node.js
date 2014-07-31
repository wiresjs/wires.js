var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Node = Wires.Class.extend({
		bindEssentials : function(text) {
			var self = this;
			this.variables = Wires.Variable.extract(this.scope, text);
			this.template = text;
			
			if (this.variables.length > 0) {
				_.each(this.variables, function(variable) {
					Wires.Watcher.spy(self.scope, variable, self);
				});
			} else {
				this.setValue();
			}
		},
		
		compileValue : function(incomingVar, newValue) {
			var template = this.template;
			var map = {};
			var self = this;
			var a = 0;
			_.each(this.variables, function(variable) {
				var value = variable.getValue(incomingVar, newValue);
				 if (newValue !== undefined) {
				 value = variable.equalsTo(incomingVar) ? newValue : value;
				 }
				if (value !== undefined) {
					map[variable.tag] = value;
					template = template.split(variable.name).join(value !== undefined ? value.toString() : '');
				}
			});
			return template;
		},
	});
})();