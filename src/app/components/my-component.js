var app = app || {};
(function() {
	'use strict';
	var MyComponent = Wires.Component.extend({
		view : 'test-component.html',
		module : true,
		initialize : function()
		{
			this.name = "test shit";
		}
	});
	Wires.Component.register("my-component", MyComponent);
})();