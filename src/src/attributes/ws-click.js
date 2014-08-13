var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	 var WsClick = Wires.Attr.extend({
		initialize : function(scope, dom, element, attr) {
			this.scope = scope;
			this.element = element;
			this.attr = attr;
			this.condition = this.attr.value;
			this.bindEssentials(this.condition);
			
			var self = this;
			// Adding acts object to visible variables
			var currentAct = new Wires.Acts(self);
			
			this.variables.push({
				getValue : function() {
					return currentAct;
				},
				service : true,
				name : 'act'
			});
			// Binding click events
			this.bindEvents();
		},
		bindEvents : function() {
			var self = this;
			
			$(this.element).click(function() {
				this.executeStatement.bind(this)('', '', false);
			}.bind(this));
		},
		setValue : function(newVariable, newValue) {
		},
	}, {
		addAttibute : false
	});
	Wires.attrs['ws-click'] = WsClick;
})();