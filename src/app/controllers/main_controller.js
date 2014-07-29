var app = app || {};
(function() {
	'use strict';
	app.MainController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				'*' : 'index.html'
			}
		},
		initialize : function()
		{
			this.userIvan = { id : 1, name : 'ivan' };
			this.userJose = { id : 2, name : 'jose' };
			this.ids = 3;
			this.zero = 0;
			this.newUserName = 'Sam';
			
			this.numbers = [1,2,3,4];
			this.color = 'gray';
			 
			this.users = [this.userIvan, this.userJose];
			window.a = this;
		},
		test : function(params, render)
		{
			this.color = 'pink';
			render();
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
			
			this.color = 'blue';
			render();
		}
	}, {displayName: 'Overview', controllerName: 'main'});
})();