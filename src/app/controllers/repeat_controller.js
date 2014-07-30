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
				this.ids++;
				
				this.users.push({id : this.ids, name : this.newuser});
			}
			
			this.newuser = '';
			
		},
		click1 : function()
		{
			console.log('click 1')
		},
		click2 : function()
		{
			console.log('click 2')
		},
		
		addTag : function()
		{
			console.log('adding new tag', this.newtag);
			if ( this.newtag)
				this.tags.push(this.newtag);
			this.newtag = '';
		},
		initialize : function()
		{
			window.a = this;
			this.ids = 2;
			this.newtag = '';
			this.tags = ['hello', 'world']
			this.userIvan = { id : 1, name : 'ivan' };
			this.userJose = { id : 2, name : 'jose' };
			this.users = [this.userIvan, this.userJose];
		},
		index : function(params, render) {
			render();
		}
	});
})();