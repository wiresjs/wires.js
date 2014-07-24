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
			this.ids = 3;
			this.newUserName = 'Sam';
			window.a = this;
		},
		addUser : function()
		{
			
			if ( this.newUserName ) {
				this.ids++;
				this.users.push({id : this.ids, name : this.newUserName});
			}
			this.newUserName = "";
		},
		index : function(params, render) {
			
			this.numbers = [1,2,3,4];
			this.color = 'gray';
			//this.showdiv = true; 
			this.users = [this.userIvan, this.userJose];
			render();
		}
	}, {displayName: 'Overview', controllerName: 'main'});
})();