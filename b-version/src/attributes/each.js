var Wires = Wires || {};
Wires.attrs = Wires.attrs || {};
(function() {
	'use strict';
	Wires.attrs.each = Wires.Attr.extend({
		initialize : function(scope, dom, element, attr) {
			this.instance = scope.instance;
			this.scope = scope;
			this.element = element;
			this.attr = attr;
			this.dom = dom;
			this.condition = this.attr.value;
			// Get the essentials
			this.essentials = this.getEssentials();
			this.bindArrayEvents(this.essentials.collection);
			// Watch collection
			Wires.Watcher.spy(this.instance, this.essentials.collection, this);
		},
		addItem : function(item, index) {
			if (!index) {
				index = this.getArrayLength();
			}
			item[this.essentials.key.name] = index;
			item.parent = this.instance;
			var self = this;
			
			var newScope = Wires.World.attachParents(this.scope, item, self.essentials.value.param);
			Wires.World.parse(newScope, this.dom.children, this.element);
		},
		bindArrayEvents : function(collection) {
			this.array = collection.getValue();
			if (_.isArray(this.array)) {
				// Handle simple array
				this.array._WiresEach = this;
				this.array.push = function() {
					var target = arguments.length > 0 ? arguments[0] : null;
					if (target) {
						this._WiresEach.addItem(target);
					}
					return Array.prototype.push.apply(this, arguments);
				};
			}
			;
		},
		getArrayLength : function() {
			return this.array.length;
		},
		getEssentials : function() {
			var essentials = Wires.Variable.extract(this.scope, this.condition);
			if (essentials.length < 2) {
				console.error("Can't recognize expression!");
				return;
			}
			return {
				value : essentials[0],
				key : (essentials.length === 3 ? essentials[1] : {
					name : 'index',
					tag : '$index'
				}),
				collection : essentials[essentials.length === 3 ? 2 : 1]
			};
		},
		setValue : function(variable, newValue) {
			var self = this;
			var values = newValue ? newValue : variable.getValue();
			if (_.isArray(values) && self.dom.children) {
				_.each(values, function(item, index) {
					self.addItem(item, index);
				});
			}
		},
	}, {
		claimsChildren : true,
		addAttibute : false
	});
})();