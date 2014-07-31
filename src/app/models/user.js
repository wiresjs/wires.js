var Wires = Wires || {};
var app = app || {};
(function() {
	'use strict';
	app.User = Wires.Model.extend({
		_settings : {
			json : '/app/test.json'
		}
	
	});
})();