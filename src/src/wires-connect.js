var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Connect = Wires.Class.extend({
	}, {
		// Execute a controller
		executeController : function(name, tpl, el) {
			Wires.Controller.getController(name, function(ctrl) {
				if (!ctrl) {
					console.error("Controller", name, "was not found!");
				} else {
					if (ctrl.index) {
						// Execute index
						ctrl.index({}, function() {
							var wires = new Wires.World({
								template : tpl,
								scope : {
									instance : ctrl
								},
								target : el
							});
						});
					}
				}
			});
		},
		// Wire controllers
		wireControllers : function() {
			this.bySelector("div[ws-controller]");
		},
		// Search controllers by selector
		bySelector : function(selector) {
			var elements = document.querySelectorAll(selector);
			var self = this;
			_.each(elements, function(el) {
				var controllerName = el.getAttribute("ws-controller");
				var html = el.innerHTML;
				
				$(el).empty();
				self.executeController(controllerName, html, el);
			});
		}
	});
})();
