var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Collection = Wires.Class.extend({
		initialize : function() {
			this.array = [];
			this.db = [];
			this.conditions = {}
		},
		add : function(model)
		{
			model._collection = this;
			this.db.push(model);
			
			
			// IF we had conditions defined
			if ( this.conditions.where ){
				// Need to check if the model has to be displayed right away
				if ( _.where([model], this.conditions.where).length > 0 ){
					this.array.push(model);
				}
			} else {
				this.array.push(model);
			}	
		},
		refresh : function()
		{
			// Refresh conditions
			this.where();
		},
		_cleanUp : function()
		{
			this.array.splice(0, this.array.length);
		},
		// Setting view result
		// Cleaning up the current array
		// And populating it with sorted values
		_setViewResult : function(result)
		{
			var self = this;
			this._cleanUp();
			_.each(result, function(item){
				self.array.push(item);
			});
		},
		// where
		where : function(condition)
		{
			if ( !condition){
				if ( this.conditions.where ) 
					condition = this.conditions.where;
				else
					return;
			}
			
			this.conditions.where = condition;
			this._setViewResult( _.where(this.db, condition) );
		},
		sortBy : function(condition)
		{
			this.conditions.sortBy = condition;
			this._setViewResult( _.sortBy(this.array, condition) );
		},
		reset : function()
		{
			this._cleanUp();
			var self = this;
			
			this.conditions = {};
			_.each(this.db, function(item){
				self.array.push(item);
			})
		},
		remove : function(item)
		{
			// Remove from db
			var dbIndex = this.db.indexOf(item);
			this.db.splice(dbIndex,1);
			// Remove from view
			var viewIndex = this.array.indexOf(item);
			this.array.splice(viewIndex,1);
		},
		fetch : function(opts) {
			var res;
			var self = this;
			if ( opts.force ){
				// Reset the array and db storage
				this.array.splice(0, this.array.length )
				this.dn.splice(0, this.array.length )
			}
			Wires.MVC.rest.obtain(opts.resource, function(result) {
				if (_.isArray(result)) {
					res = [];
					_.each(result, function(item) {
						var item = new opts._class(item);
						item._collection = self;
						self.array.push(item);
						// Pushing collection to a db storage
						self.db.push(item);
					});
				} else {
					res = new opts.parentClass(result);
				}
				if (opts.success) {
					opts.success(res);
				}
			}, function(err) {
				if (opts.error)
					opts.error(error);
			});
		}

	});
})();