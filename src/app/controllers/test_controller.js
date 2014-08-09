var app = app || {};
(function() {
	'use strict';
	app.TestController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				index : 'test.html'
			}
		},
		index : function(params, render) {
			this.users = [ {
				name : "ivan"
			}, {
				name : "roman"
			} ];
			this.sukka = "kakka";
			render();
		}
	});
})();