var Wires = Wires || {};
var app = app || {};
(function() {
	'use strict';
	app.User = Wires.Model.extend({
		_settings : {
			resource : '/app/test.json',
			schema : {
				id : {},
				name : {},
				test : {
					defaultValue : "hello"
				}
			}
		},
		validate : function() {
			if (!this.name) {
				return {
					message : "Name should be there "
				};
			}
		}
	});
})();
