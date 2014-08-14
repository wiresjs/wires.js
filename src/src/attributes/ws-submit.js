var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	var WsSubmit = Wires.BaseAttribute.extend({
		initialize : function() {
			WsSubmit.__super__.initialize.apply(this, arguments);
			this.setBindings();
		},
		setBindings : function() {
			$(this.element).submit( function(e) {
				$(this.element).find("select").each(function() {
					var attrs = $(this).data('wires-node').attributes;
					var wsValue = attrs['ws-value'];
					if (wsValue && wsValue.variables.length) {
						var currentValue = wsValue.variables[0].getValue();
						if (currentValue === undefined || currentValue === '') {
							
							var cel = $(this).find("option:selected");
							if (cel.length) {
								var currentElement = $(cel).data("wires-node");
								// Setting value
								var neededValue = currentElement.attributes['ws-value'];
								if (neededValue && neededValue.variables.length > 0) {
									var valueToBeSet = neededValue.variables[0].getValue();
									wsValue.variables[0].setValue(valueToBeSet);
								}
							}
							
						}
					}
				});
				this.executeStatement();
				e.originalEvent.preventDefault();
			}.bind(this));
		}
	});
	Wires.attrs['ws-submit'] = WsSubmit;
})(); 