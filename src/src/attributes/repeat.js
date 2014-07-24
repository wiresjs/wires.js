var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs.repeat = Wires.attrs.each.extend({
		initialize : function() {
			Wires.attrs.repeat.__super__.initialize.apply(this, arguments);
			var self = this;
		},
		onElementReady : function() {
			this.node.placeholder.nodeValue = 'wires-repeat: ' + this.condition;
			if ( this.delayedAddFunction ){
				this.delayedAddFunction();
				this.delayedAddFunction = undefined;
			}
			
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
			Wires.World.parse(newScope, modifiedChildren, this.element, {
				insertBefore : this.node.placeholder
			});
		},
		// In order to avoid nasty blink and defered function
		// We need to wait initial value set and store it as delayed function
		// When the dom is ready it should be triggered
		setValue : function(variable, newValue, isInitial) {
			if ( isInitial ){
				this.delayedAddFunction = function(){
					Wires.attrs.repeat.__super__.setValue.apply(this._this, this.args);
				}.bind({ _this : this, args : arguments  });
			} else {
				Wires.attrs.repeat.__super__.setValue.apply(this, arguments);
			}
		},
	}, {
		shouldAppendElement : false
	});
})();