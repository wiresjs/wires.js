var app = app || {};
(function() {
	'use strict';
	var MyComponent = Wires.Component.extend({
		view : 'test-component.html',
		initialize : function()
		{
			this.testVar = 'Hello test var from component';
		},
	});
	
	Wires.Component.register("my-component", MyComponent);
})();