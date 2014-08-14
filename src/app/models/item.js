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
				test : {
					defaultValue : "hello"
				},
				priority : {}
			}
		},
		validate : function()
		{
			
			if ( !this.name){
				
				return { message : "Name should be there "};
			}
			
		}
	});
})();
