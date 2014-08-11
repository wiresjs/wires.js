var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Controller = Wires.Class.extend({
	}, {
		controllers : {},
		instances : {},
		getController : function(name, done)
		{
			if ( this.controllers[name] ){
				if ( !this.instances[name] ){
					this.instances[name] = new this.controllers[name](); 
				}
				done(this.instances[name]);
			} else {
				done(null);
			}
		},
		register : function(controller, _class) {
			this.controllers[controller] = _class;
		}
	});
})(); 