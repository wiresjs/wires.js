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
			render();
		}

	});
})();