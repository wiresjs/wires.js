var app = app || {};
(function() {
	'use strict';
	app.RepeatController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				'*' : 'repeat.html'
			}
		},
	
		remove : function(scope)
		{
			scope.user.remove();
		},
		addUser : function()
		{
			if ( this.newuser){
				var user = new app.User({id : 27, name : this.newuser});
				
				this.users.add(user);
			}
			this.newuser = '';
		},
		initialize : function()
		{
			this.users = new app.User().fetchAll();
		},
		onSearchNameChanged : function(value)
		{
			this.users.where(function(e){
				return e.name.toLowerCase().indexOf(value) >= 0;
			})
		},
		index : function(params, render) {
			var self = this;
			window.a = this;
			this.searchName = '';
		
			this.users.reset();
			
			render();
		}
	});
})();