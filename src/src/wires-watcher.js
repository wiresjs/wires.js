var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Watcher = Wires.Class.extend({
		initialize : function(node, variable, instanceId) {
			this.nodeCollection = {};
			this.index = 1;
			this.node = node;
			this.variable = variable;
			this.instanceId = instanceId;

			if (!this.variable.isFunction && !this.variable.expression) {
				var instance = variable.target.instance;
				var property = variable.target.property;

				instance.watch(property, function(a, b, newvalue) {
					
					this.valueChanged(newvalue);
					
					// Trigger property change
					if ( instance.onPropertyChanged ){
						_.defer(function(){ instance.onPropertyChange(a, newvalue) })
					}
					// Trigger exclusively
					var methodName = 'on' + a.charAt(0).toUpperCase() + a.slice(1) + 'Changed';
					if ( instance[methodName] ){
						_.defer(function(){ instance[methodName](newvalue); });
					}
						
					return newvalue;
				}.bind(this));
			}
		},
		valueChanged : function(value) {
			var self = this;

			_.each(this.nodeCollection, function(node) {
				node.setValue(self.variable, value);
			});
		},
		setInitial : function(node) {
			node.setValue(this.variable, undefined, true);
		},
		add : function(node) {
			var self = this;
			var index = this.index++;
			var el = node.element;

			// TODO: Weired stuff going on here */
			
			var watchedElement = (this.node instanceof Wires.TextNode) ? node.element.parentNode || node.element
					: node.element;
			
			watchedElement.addEventListener("DOMNodeRemovedFromDocument", function() {
				delete self.nodeCollection[this.index];
			}.bind({
				index : index,
				node : node
			}), false);
			
			this.nodeCollection[index] = node;
		}
	}, {
		collections : {},
		unwatch : function(scope, variable, node) {
			console.log('unwatch', variable, node.element);
		},
		spy : function(scope, variable, node) {

			var instance = scope.instance;
			var variableName = variable.name;

			if (variable.expression)
				return;

			// Get real variable name
			// Otherwise we will listen twice for the same variable in instance
			var variableName = variable.target && variable.target.property ? variable.target.property : variable.name;

			// Refere to the correct instance
			instance = variable.target && variable.target.instance ? variable.target.instance : instance;

			// Numbers are ignored. They can't be watchable;
			// if ( _.isNumber(instance) ){
			// node.setValue(instance);
			// console.log(instance, 'is', 'number');
			// return;
			// }
			// console.log(instance.uniqueId, variableName);

			// Create unique listener
			var instanceId = instance.uniqueId;
			if (!this.collections[instance.uniqueId]) {
				var watcher = new Wires.Watcher(node, variable);
				this.collections[instanceId] = watcher;
			}

			if (!this.collections[instanceId][variableName]) {
				this.collections[instanceId][variableName] = new Wires.Watcher(node, variable, instanceId);
			}
			var singleWatcher = this.collections[instanceId][variableName];
			// Adding node to the watcher
			// console.log( node instanceof Wires.TextNode );
			singleWatcher.add(node);
			singleWatcher.setInitial(node);
		}
	});
})();