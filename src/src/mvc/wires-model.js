var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Model = Wires.Class.extend({
		_settings : {
			schema : [{
				id : {}
			}]
		},
		initialize : function(args) {
			this.assign(args);
			this._settings.parentClass = this.constructor;
		},
		assign : function(args) {
			var self = this;
			_.each(args, function(value, key) {
				self[key] = value;
			});
		},
		remove : function(done, fail) {
			var attrs = this._getAttributes();
			if (this._collection) {
				this._collection.remove(this);
			}
			if (this._settings.resource) {
				Wires.MVC.rest.del({
					url : this._settings.resource + "/" + attrs.id
				}, function(e) {
					done ? done(self) : '';
				}, function(e) {
					fail ? fail(self) : '';
				});
			}
		},
		_getAttributes : function() {
			var attrs = {};
			if (this._settings.schema) {
				var self = this;
				_.each(this._settings.schema, function(value, key) {
					if (self[key] !== undefined) {
						attrs[key] = self[key];
					}
				});
			}
			return attrs;
		},
		save : function(done, fail) {
			var attrs = this._getAttributes();
			if (attrs.id === undefined) {
				var self = this;
				Wires.MVC.rest.post({
					url : this._settings.resource,
					data : attrs
				}, function(e) {
					if (e.id) {
						self.id = e.id;
					}
					done ? done(self) : '';
				}, function(e) {
					fail ? fail(self) : '';
				});
			} else {
				Wires.MVC.rest.put({
					url : this._settings.resource + "/" + attrs.id,
					data : attrs
				}, function(e) {
					done ? done(self) : '';
				}, function(e) {
					fail ? fail(self) : '';
				});
			}
		},
		fetchAll : function(opt) {
			var path = this._settings.json || this._settings.resource;
			var opts = opt || {};
			// Create new collection
			this.collection = new Wires.Collection();
			var self = this;
			this.collection.fetch({
				resource : path,
				_class : this._settings.parentClass,
				success : opts.success,
				error : opts.error
			});
			return this.collection;
		},
		fetch : function(done) {
			if (!this._settings.resource)
				return;
			var self = this;
			
			var destinationModel = new this._settings.parentClass();
			
			Wires.MVC.rest.obtain(this._settings.resource, function(result) {
				destinationModel.assign(result);
				destinationModel.trigger("model:fetched", destinationModel);
				done ? done(destinationModel) : '';
			});
			return destinationModel;
		}
	});
})();
