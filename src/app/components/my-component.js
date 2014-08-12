var app = app || {};
(function() {
	'use strict';
	var MyComponent = Wires.Component.extend({
		template : '<div><b>$user.name</b></div>',
		initialize : function()
		{
			this.testVar = 'Hello test var from component';
		},
	});
	
	Wires.Component.register("my-component", MyComponent);
})();