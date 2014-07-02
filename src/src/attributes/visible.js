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

			// If animation was set
			var animation = $(this.element).data('animation');
			var el = $(this.element);
			switch (animation) {
				case 'slide':
					result ? el.slideDown() : el.slideUp();
				break;
			case 'fade':
					result ? el.fadeIn() : el.fadeOut();
				break;
			default:
				// Default is just toggling
				el.css('display', result ? 'block' : 'none');
				break;
			}

		},
	}, {
		addAttibute : false
	});
})();