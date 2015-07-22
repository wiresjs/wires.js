domain.service("attributes.ws-class", function() {
	return Wires.BaseAttribute.extend({
		setValue: function(newVariable, newValue) {
			var conditions = this.executeStatement(newVariable, newValue, 'return');
			var self = this;
			_.each(conditions, function(shouldPresent, className) {
				if (shouldPresent) {
					$(self.element).addClass(className);
				} else {
					$(self.element).removeClass(className);
				}
			});
		},
	});
})
