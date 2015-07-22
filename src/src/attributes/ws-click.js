domain.service("attributes.ws-click", function() {
	return Wires.Attr.extend({
		initialize: function(scope, dom, element, attr) {
			this.scope = scope;
			this.element = element;
			this.attr = attr;
			this.condition = this.attr.value;
			this.bindEssentials(this.condition);

			var self = this;
			// Binding click events
			this.bindEvents();
		},
		bindEvents: function() {
			var self = this;

			$(this.element).click(function() {
				this.executeStatement.bind(this)('', '', false);
			}.bind(this));
		},
		setValue: function(newVariable, newValue) {},
	}, {
		addAttibute: false
	});
})
