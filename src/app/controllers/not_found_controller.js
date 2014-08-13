var app = app || {};
(function() {
	'use strict';
	app.NotFoundController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				index : 'not_found.html'
			}
		},
		index : function(params, render) {
			
			render();
		}
	});
})();