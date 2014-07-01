var app = app || {};
(function() {
	'use strict';
	app.MainController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				index : 'index.html'
			}
		},
		initialize : function()
		{
			this.userIvan = { id : 1, name : 'ivan' };
			this.userJose = { id : 2, name : 'jose' };
		},
		index : function(params, render) {
			
			this.color = 'gray';
			this.users = [this.userIvan, this.userJose];
			render();
		}
	}, {displayName: 'Overview', controllerName: 'main'});
})();