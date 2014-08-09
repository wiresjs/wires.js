var app = app || {};
(function() {
	'use strict';
	app.CollectionController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				'*' : 'collection.html'
			}
		},

		initialize : function() {
			this.items = new app.Item().fetchAll();

		},
		index : function(params,render) {
			render();
		}

	});
})();