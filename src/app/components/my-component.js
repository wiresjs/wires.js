var app = app || {};
(function() {
	'use strict';
	var MyComponent = Wires.Component.extend({
		view : 'test-component.html',
		module : true,
		essentials : {
			
			collections : {
				users : app.User,
				items : app.Item
			}
		},
		initialize : function()
		{
			this.name = "test shit";
			console.log(this.items);
		}
	});
	Wires.Component.register("my-component", MyComponent);
})();