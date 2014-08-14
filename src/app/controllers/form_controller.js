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
			window.a = this;
			//this.opinion = 2;
			//this.opinion = 'It is really cool';
			this.list = [ {id : 2, name : "pukka"}, {id : 1, name : "sukka"}, {id : 3, name : "runka"} ];
			render();
		}
	});
})();