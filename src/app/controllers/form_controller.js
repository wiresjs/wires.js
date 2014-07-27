var app = app || {};
(function() {
	'use strict';
	app.FormController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				index : 'form.html'
			}
		},
		addUser : function()
		{
			this.submitPressed = true;
			setTimeout(function(){
				this.submitPressed = false;
			}.bind(this), 500);
		},
		index : function(params, render) {
			
			render();
		}
	});
})();