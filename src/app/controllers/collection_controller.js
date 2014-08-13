var app = app || {};
(function() {
	'use strict';
	app.CollectionController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				'*' : 'collection.html'
			}
		},

		initialize : function() {
			this.items = new app.Item().fetchAll();
			
		},
		onSelectAllChanged : function(value)
		{
			this.items.each(function(item){
				item.selected = value;
			});
		},
		sortIt : function()
		{
			this.items.sortBy('priority');
		},
		addUser : function()
		{
			
			if ( this.newUser ){
				var user = new app.Item({ name : this.newUser });
				this.items.add(user);
				user.save(function(){
					
				});
				this.newUser = '';
			}
		},
		index : function(params,render) {
			setTimeout(function(){
				this.items.sortBy('priority');
			}.bind(this),200);
			render();
		}

	});
})();