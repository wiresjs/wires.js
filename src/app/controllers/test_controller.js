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
			this.ivan = { name : "ivan"};
			this.roman = {name : "roman"}
			this.users = [ this.ivan, this.roman ]
			this.sukka = "kakka";
			render();
		}
	});
})();