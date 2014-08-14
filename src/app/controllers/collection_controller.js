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
			window.a = this;
			this.errors = new Wires.Collection();
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
			
			this.errors.removeAll();
			
			var self = this;
			var item = new app.Item({
				name : this.newUser
			});
			
			
			item.on("save:blocker", function(e, errors) {
				self.errors.addAll(errors);
				
			});
			item.save();
			
			item.on("save:success", function(e, isNew) {
				self.newUser = '';
				if ( isNew ){
				 self.items.add(item);
				}
			});
		},
		index : function(params, render) {
			
			render();
		}
	});
})();
