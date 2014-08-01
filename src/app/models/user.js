var Wires = Wires || {};
var app = app || {};
(function() {
	'use strict';
	app.User = Wires.Model.extend({
		_settings : {
			json : '/app/test.json'
		},
		initialize : function()
		{
			
			app.User.__super__.initialize.apply(this, arguments);
		},
		onNameChanged : function(value)
		{
			this._collection.trigger('nameChanged', value)
		}
	
	});
})();