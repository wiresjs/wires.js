var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs.visible = Wires.BaseAttribute.extend({
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
				if ( result ){
					el.show();
				} else {
					el.hide();
				}
				//el.css('display', result ? 'block' : 'none');
				break;
			}
		},
	});
})();