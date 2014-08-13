var Wires = Wires || {};
var app = app || {};
(function() {
	'use strict';
	app.Item = Wires.Model.extend({
		_settings : {
			resource : '/items',
			schema : {
				id : {},
				name : {
					validate : function(value) {
						return value !== '';
					}
				},
				priority : {}
			}
		},
		onSelectedChanged : function(value)
		{
		
		}
	});
})();
