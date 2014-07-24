var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs.repeat = Wires.attrs.each.extend({
		initialize : function() {
			Wires.attrs.repeat.__super__.initialize.apply(this, arguments);
		},
		addItem : function(item, index) {
			
			if (!index) {
				index = this.getArrayLength();
			}
			item[this.essentials.key.name] = index;
			item.parent = this.instance;
			var self = this;
			
			
			// In order for the compiler to get the proper dom,
			// Including the current element, we need to mock children
			var modifiedDom = this.dom;
			// Removing the repeat attribute, otherwise it'll go recursively
			delete modifiedDom.attribs.repeat;
			
			var modifiedChildren = [ modifiedDom ];
			
			var newScope = Wires.World.attachParents(this.scope, item, self.essentials.value.param);
			
			_.defer(function(){
				
				Wires.World.parse(newScope, modifiedChildren, this.element, { insertBefore : this.node.placeholder });
			}.bind(this));
		}
	}, {
		shouldAppendElement : false
	});
})();