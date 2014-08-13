var app = app || {};
(function() {
	'use strict';
	app.CollectionController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				'*' : 'collection.html'
			},
			collections : {
				items : app.Item
			}
		},
		interceptors : {
			auth : app.AuthInterceptor
		},
		initialize : function() {
			
			this.on('collections:ready', function() {
			
				this.items.on('fetch:success', function(e, collection) {
					collection.sortBy('priority');
				});
				this.items.on('model:removed', function(e, model) {
					console.log('removed', model);
				});
				this.items.on('model:added', function(e, model) {
					console.log('added', model);
				});
			}.bind(this));
		},
		onSelectAllChanged : function(value) {
			this.items.each(function(item) {
				item.selected = value;
			});
		},
		sortIt : function() {
			this.items.sortBy('priority');
		},
		addUser : function() {
			if (this.newUser) {
				var user = new app.Item({
					name : this.newUser
				});
				this.items.add(user);
				user.save(function() {
				});
				this.newUser = '';
			}
		},
		index : function(params, render) {
			console.log(this.items);
			render();
		}
	});
})();
