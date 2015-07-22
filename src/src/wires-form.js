var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Form = Wires.Class.extend({
		initialize: function(attrs) {
			var self = this;
			_.each(attrs, function(v, k) {
				self[k] = v;
			});
		},
		// Reseting form values
		reset: function() {
			var self = this;
			_.each(this, function(v, k) {
				if (self.hasOwnProperty(k)) {
					if (!k.indexOf('_') !== 0) {
						self[k] = null;
					}
				}
			});
		},
		// Getting form values
		getValues: function() {
			var values = {};
			var self = this;
			_.each(this, function(v, k) {
				if (self.hasOwnProperty(k)) {
					if (!k.indexOf('_') !== 0) {
						values[k] = v;
					}
				}
			});
			return values;
		}
	});
})();
