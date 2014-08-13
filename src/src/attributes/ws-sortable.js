var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	var WsSortable = Wires.BaseAttribute.extend({
		initialize : function() {
			WsSortable.__super__.initialize.apply(this, arguments);
			this.options = this.executeStatement(null, null, 'return');
			this.setBindings();
		},
		setBindings : function() {
			var options = this.options;
			var positionStart;
			$(this.element).sortable({
				axis : "y",
				start : function(event, ui) {
					positionStart = ui.item.position().top;
				},
				update : function(event, ui) {
					var round_number = function(num, dec) {
						return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
					};
					
					var el = ui.item;
					var stop = el.position().top;
					var movingDirection = positionStart < stop ? -1.0 : 1.0;
					var property = options.property;
					var autoSave = options.autoSave;
					if (property) {
						// need to obtain element after and get the model
						var nextElement = el.next();
						var prevElement = el.prev();
						var currentElementNode = ui.item.data("wires-node");
						var min = 0;
						var max = 1;
						if (prevElement.length) {
							var node = prevElement.data("wires-node");
							var variable = Wires.Variable.getTargetVariable(node.scope, property);
							min = variable.instance[variable.property];
						}
						if (nextElement.length) {
							var node = nextElement.data("wires-node");
							var variable = Wires.Variable.getTargetVariable(node.scope, property);
							max = variable.instance[variable.property];
						} else {
							max = min + 1;
						}
						// Calculating  number in between
						var sec = ((max - min) / 2 + min);
						sec = round_number(sec, 5);
						var currentVariable = Wires.Variable.getTargetVariable(currentElementNode.scope, property);
						currentVariable.instance[currentVariable.property] = sec;
						if (autoSave) {
							currentVariable.instance.save();
						}
					}
				}
			});
		}
	});
	Wires.attrs['ws-sortable'] = WsSortable;
})();
