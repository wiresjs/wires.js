var app = app || {};
(function() {
	'use strict';
	app.RepeatController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				'*' : 'repeat.html'
			}
		},
		test : function()
		{
			this.users.splice(0,this.users.length );
			//this.users.push(this.userIvan);
		},
		remove : function(item)
		{
			var idx = item.user.index();
			this.users.splice(idx, 1);
		},
		addUser : function()
		{
			
			if ( this.newuser){
				this.users.add({id : 0, name : this.newuser});
			}
			this.newuser = '';
		},
		initialize : function()
		{
			window.a = this;
		},
		index : function(params, render) {
			var self = this;
			
			this.searchName = '';
			
			this.users = new app.User().fetchAll();

			
			$(this).on('property:changed',function(e, name, value){
				if ( name == 'searchName'){
					self.users.where(function(e){
						return e.name.toLowerCase().indexOf(value) >= 0;
					})
				}
			});
			render();
		}
	});
})();