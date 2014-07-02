var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Watcher = Backbone.Model.extend({
		initialize : function(node, variable) {
			this.nodeCollection = {};
			this.index = 1;
			this.node = node;
			this.variable = variable;

			if (!this.variable.isFunction && !this.variable.expression) {
				var instance = variable.target.instance;
				var property = variable.target.property;

				instance.watch(property, function(a, b, newvalue) {
					
					this.valueChanged(newvalue);
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
			//console.log('set initial', node.element);
			node.setValue(this.variable);
		},
		add : function(node) {
			var self = this;
			var index = this.index++;
			var el = node.element;

			/*el.addEventListener("DOMNodeInserted", function() {
				var watchedElement = (this.node instanceof Wires.TextNode) ? node.element.parentNode || node.element
						: node.element;
				watchedElement.addEventListener("DOMNodeRemoved", function() {
					delete self.nodeCollection[this.index];
				}.bind({
					index : index
				}), false);

			}.bind({
				index : index,
				node : node
			}), false);*/

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
			// Create unique listener
			if (!this.collections[instance.uniqueId]) {
				this.collections[instance.uniqueId] = new Wires.Watcher(node, variable);// {};
			}
			if (!this.collections[instance.uniqueId][variableName]) {
				this.collections[instance.uniqueId][variableName] = new Wires.Watcher(node, variable);
			}
			var singleWatcher = this.collections[instance.uniqueId][variableName];
			// Adding node to the watcher
			// console.log( node instanceof Wires.TextNode );
			singleWatcher.add(node);
			singleWatcher.setInitial(node);
		}
	});
})();