var app = app || {};
(function() {
	'use strict';
	var MyComponent = Wires.Component.extend({
		view : 'test-component.html',
		initialize : function()
		{
			
		},
	});
	
	Wires.Component.register("my-component", MyComponent);
})();