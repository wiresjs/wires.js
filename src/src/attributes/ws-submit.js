var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	var WsSubmit = Wires.BaseAttribute.extend({
		initialize : function() {
			WsSubmit.__super__.initialize.apply(this,arguments);
			this.setBindings();
		},
		setBindings : function()
		{
			$(this.element).submit(function(e){
				this.executeStatement();
				e.originalEvent.preventDefault();
			}.bind(this));
		}
	});
	Wires.attrs['ws-submit'] = WsSubmit;
})();