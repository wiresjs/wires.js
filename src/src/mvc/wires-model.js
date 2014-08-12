var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Model = Wires.Class.extend({
		_settings : {
		},
		initialize : function(args) {
			var self = this;
			_.each(args, function(value, key){
				self[key] = value;
			});
			// Setting parent class
			this._settings.parentClass = this.constructor;
		},
		remove : function()
		{
			if ( this._collection ){
				this._collection.remove(this);
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
		}
	});
})();