var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs.submit = Wires.BaseAttribute.extend({
		initialize : function() {
			Wires.attrs.submit.__super__.initialize.apply(this,arguments);
			this.setBindings();
		},
		setBindings : function()
		{
			$(this.element).submit(function(e){
				this.executeStatement();
				e.originalEvent.preventDefault();
			}.bind(this))
		}
	});
})();