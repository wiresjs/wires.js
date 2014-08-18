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
			this.setHasManyMethods();
			this.assign(args);
			this._fetched = false;
			this._settings.parentClass = this.constructor;
			// Setting default values
			var attributes = this._getAttributes();
		},
		setHasManyMethods : function() {
			var self = this;
			this.__hasMany = {};
			_.each(this._settings.hasMany, function(data, key) {
				var modelClass = data();
				
				var modelInstance = new modelClass();
				self.__hasMany[key] = modelInstance;
				self[key] = modelInstance.getCollection();
			});
		},
		// Fetch many
		fetchMany : function(key) {
			if (this.__hasMany[key]) {
				var modelInstance = this.__hasMany[key];
				modelInstance.fetchAll({
					path : this._settings.resource + "/" + this.id + "/" + key
				});
			}
		},
		assign : function(args) {
			var self = this;
			_.each(args, function(value, key) {
				self[key] = value;
			});
		},
		validate : function() {
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
				_.each(this._settings.schema, function(options, key) {
					if (self[key] !== undefined) {
						attrs[key] = self[key];
					} else {
						// Setting default value
						if (options.defaultValue !== undefined) {
							self[key] = options.defaultValue;
							attrs[key] = self[key];
						}
					}
				});
			}
			return attrs;
		},
		save : function(done, fail) {
			var self = this;
			if (!this._settings.resource)
				return;
			var validation;
			if (( validation = this.validate() )) {
				this.trigger('save:blocker', validation);
				return;
			}
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
					self.trigger('save:success', true);
					done ? done(self) : '';
				}, function(e) {
					self.trigger('save:failed', e);
					fail ? fail(self) : '';
				});
			} else {
				Wires.MVC.rest.put({
					url : this._settings.resource + "/" + attrs.id,
					data : attrs
				}, function(e) {
					self.trigger('save:success', false);
					done ? done(self) : '';
				}, function(e) {
					self.trigger('save:failed', e);
					fail ? fail(self) : '';
				});
			}
		},
		getCollection : function() {
			this._collection = this._collection || new Wires.Collection();
			return this._collection;
		},
		fetchAll : function(opt) {
			
			if (!opt.force && this._fetched)
				return;
			var path = this._settings.json || this._settings.resource;
			if (opt && opt.path) {
				path = opt.path;
			}
			var self = this;
			var opts = opt || {};
			// Create new collection
			var collection = this.getCollection();
			var self = this;
			collection.fetch({
				resource : path,
				_class : this._settings.parentClass,
				success : function(){
					opts.success ? opts.success() : null;
				},
				error : opts.error
			});
			self._fetched = true;
			return collection;
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
