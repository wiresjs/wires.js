var app = app || {};
(function() {
	'use strict';
	app.MainController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				'*' : 'index.html'
			}
		},
		initialize : function() {
			
		},
		index : function(params, render)
		{
			this.hello = "HELLO MOTHER FUCKER";
			this.pukka = {name : "test"};
			render();
		}
		
	});
	Wires.Controller.register("main", app.MainController);
})(); 