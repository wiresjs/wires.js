var app = app || {};
(function() {
	'use strict';
	app.BaseController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				'*' : 'collection.html'
			}
		},
		initialize : function() {
			
		}
	});
})();