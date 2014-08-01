var app = app || {};
(function() {
	'use strict';
	app.AnimateController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				'*' : 'animate.html'
			}
		},
		index : function(params, render) {
			
			this.showQuote = false;
			render();
		}
	});
})();