var Wires = Wires || {};
var app = app || {};
(function() {
	'use strict';
	app.Item = Wires.Model.extend({
		_settings : {
			resource : '/items'
		}
	});
})();