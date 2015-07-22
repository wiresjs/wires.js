domain.service("attributes.ws-animation", function() {
	return Animation = Wires.BaseAttribute.extend({
		initialize: function() {
			Animation.__super__.initialize.apply(this, arguments);
			var value = this.attr.value;
			$(this.element).data('animation', value);
		},
		setValue: function(newVariable, newValue) {},
	});
})
