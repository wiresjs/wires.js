var Wires = Wires || {};
var app = app || {};
(function() {
	'use strict';
	app.User = Wires.Model.extend({
		_settings : {
			resource : '/app/test.json',
			schema : {
				id : {},
				name : {}
			}
		},
		validate : function()
		{
			console.log('ddd', this.name)
			if ( !this.name){
				
				return { message : "Name should be there "};
			}
			
		}
	});
})(); 