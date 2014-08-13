var app = app || {};
(function() {
	'use strict';
	app.CollectionController = Wires.MVC.Controller.extend({
		essentials : {
			views : {
				'*' : 'collection.html'
			}
		},
		interceptors : {
			auth : app.AuthInterceptor
		},
		initialize : function() {
			
			var user = new app.User().fetch();
			user.on("model:fetched", function(e, m){
				
			});
			
			
			this.items = new app.Item().fetchAll();
			this.items.on('fetch:success', function(e, collection) {
				collection.sortBy('priority');
			});
			this.items.on('model:removed', function(e, model) {
				console.log('removed', model);
			});
			this.items.on('model:added', function(e, model) {
				console.log('added', model);
			});
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
			render();
		}
	});
})(); 