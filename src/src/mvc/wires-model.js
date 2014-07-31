var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Model = Wires.Class.extend({
		initialize : function() {
		
		},
		_fetch : function()
		{
			var path = this.json || this.resource;
		},
		all : function()
		{
			// Create new collection
			this.collection = new Wires.Collection();
			collection.fetchAll(this.json || this.resource);
		}
	});
})();