var app = app || {};
(function() {
	'use strict';
	app.UserController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				index : 'test.html'
			}
		},
		index : function(params, render) {
			this.user = "ivan";
			render();
		}
	}, {displayName: 'Overview', controllerName: 'main'});
})();