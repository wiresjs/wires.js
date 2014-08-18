var app = app || {};
(function() {
	'use strict';
	var MyComponent = Wires.Component.extend({
		//template : '<div><b>$user.name</b></div>',
		//sourceElement : '#test',
		view : 'test-component.html',
		initialize : function()
		{
			console.log(this);
		},
		test : function()
		{
			alert('test');
		}
	});
	
	Wires.Component.register("my-component", MyComponent);
})();