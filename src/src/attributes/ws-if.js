domain.service("attributes.ws-if", function() {
	return WiresIF = Wires.BaseAttribute.extend({
		initialize: function() {

			WiresIF.__super__.initialize.apply(this, arguments);
		},
		onElementReady: function() {
			this.node.placeholderBefore.nodeValue = 'wires-if: ' + this.condition;
			this.node.placeholderAfter.nodeValue = '/wires-if: ' + this.condition;
		},
		setValue: function(newVariable, newValue) {
			var result = this.executeStatement(newVariable, newValue, 'return');
			var el = $(this.element);
			var self = this;
			if (result) {
				// Inserting before placeholder
				el.insertBefore(this.node.placeholderAfter);
				Wires.World.parse(this.scope, this.node.dom.children, this.element);
			} else {

				el.remove();
				// Bind the essentials back
			}
		},
	}, {
		persistWatch: true,
		shouldAppendElement: false,
		claimsChildren: false
	});
})
