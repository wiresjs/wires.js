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
				
				this.userCollection.add({id : this.ids, name : this.newuser});
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
			
			var self = this;
			
			
			
			//this.users = [this.userIvan, this.userJose];
		},
		search : function()
		{
		
		},
		propertyChanged : function(event, name, value)
		{
			console.log(name, value);
		},
		index : function(params, render) {
			var self = this;
			
			this.searchName = '';
			this.userCollection = new app.User().fetchAll().collection;
			this.users = this.userCollection.array;
			
			$(this).on('property:changed',function(e, name, value){
				if ( name == 'searchName'){
					
						self.userCollection.where(function(e){
							return e.name.toLowerCase().indexOf(value) >= 0;
						})
					
				}
			});
			render();
		}
	});
})();