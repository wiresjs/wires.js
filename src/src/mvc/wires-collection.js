var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Collection = Wires.Class.extend({
		initialize : function(data) {
			this.array = [];
			this.db = [];
			this.conditions = {};
			this.size = 0;
			this._fetched = false;
			if (data) {
				this.addAll(data);
			}
		},
		add : function(model) {
			model = model instanceof Wires.Model ? model : new Wires.Model(model);
			model._collection = this;
			this.db.push(model);
			// IF we had conditions defined
			if (this.conditions.where) {
				// Need to check if the model has to be displayed right away
				if (_.where([model], this.conditions.where).length > 0) {
					this.array.push(model);
				}
			} else {
				this.array.push(model);
			}
			this.updateSize();
			this.trigger("model:added", model);
		},
		addAll : function(items) {
			var self = this;
			if (_.isArray(items)) {
				_.each(items, function(item) {
					self.add(item);
				});
			} else {
				self.add(items);
			}
		},
		refresh : function() {
			// Refresh conditions
			this.where();
		},
		_cleanUp : function() {
			this.array.splice(0, this.array.length);
		},
		// Setting view result
		// Cleaning up the current array
		// And populating it with sorted values
		_setViewResult : function(result) {
			var self = this;
			this._cleanUp();
			_.each(result, function(item) {
				self.array.push(item);
			});
		},
		filter : function(condition) {
			if (!condition) {
				if (this.conditions.where)
					condition = this.conditions.where;
				else
					return;
			}
			this.conditions.where = condition;
			this._setViewResult(_.where(this.db, condition));
		},
		// Finds model my id
		findById : function(id) {
			if (id) {
				id = id * 1;
				var result = this.where({
					id : id
				});
				if (result.length > 0) {
					return result[0];
				}
			}
		},
		where : function(condition) {
			return _.where(this.db, condition);
		},
		sortBy : function(condition) {
			this.conditions.sortBy = condition;
			this._setViewResult(_.sortBy(this.array, condition));
		},
		reset : function() {
			this._cleanUp();
			var self = this;
			this.conditions = {};
			_.each(this.db, function(item) {
				self.array.push(item);
			});
		},
		each : function(cb) {
			_.each(this.db, cb);
		},
		removeWhere : function(condition) {
			var items = [];
			var items = _.where(this.db, condition);
			_.each(items, function(item) {
				item.remove();
			});
		},
		remove : function(item) {
			// Remove from db
			var dbIndex = this.db.indexOf(item);
			this.db.splice(dbIndex, 1);
			// Remove from view
			var viewIndex = this.array.indexOf(item);
			this.array.splice(viewIndex, 1);
			this.trigger("model:removed", item);
			this.updateSize();
		},
		removeAll : function() {
			var self = this;
			var cloned = _.clone(this.db);
			_.each(cloned, function(item) {
				self.remove(item);
			});
		},
		updateSize : function() {
			this.size = this.array.length;
		},
		fetch : function(opts) {
			var res;
			var self = this;
			if (opts.force) {
				this.removeAll();
			}
			Wires.MVC.rest.obtain(opts.resource, function(result) {
				self._fetched = true;
				if (_.isArray(result)) {
					res = [];
					_.each(result, function(item) {
						var item = new opts._class(item);
						item._collection = self;
						self.array.push(item);
						// Pushing collection to a db storage
						self.db.push(item);
						self.updateSize();
					});
				} else {
					res = new opts._class(result);
				}
				if (opts.success) {
					opts.success(res);
				}
				self.trigger("fetch:success", self);
			}, function(err) {
				self.trigger("fetch:error", error);
				if (opts.error) {
					opts.error(error);
				}
			});
		}
	});
})();
