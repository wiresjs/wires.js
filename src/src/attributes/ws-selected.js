domain.service("attributes.ws-selected", function() {
	return WsSelected = Wires.BaseAttribute.extend({
		initialize: function() {
			WsSelected.__super__.initialize.apply(this, arguments);
		},

		setValue: function(newVariable, newValue) {
			var result = this.executeStatement(newVariable, newValue, 'return');
			var el = $(this.element);
			if (result) {
				el.attr('selected', '');
			} else {
				el.removeAttr('selected');
			}
		},
	}, {
		addAttibute: false
	});
})
