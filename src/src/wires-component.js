var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Component = Wires.Class.extend({
		_delayedInitialization : function(resolveInit) {
			this.__resolveInitialization = resolveInit;
		},
		initialize : function() {
		},
		getDom : function(node, done) {
			this.getDomStructure(node.name, function(data) {
				Wires.Component.searchForComponentDataAttribute(data, node.children);
				done(data);
			});
		},
		getDomStructure : function(componentName, done) {
			var view = this.view;
			var self = this;
			if (Wires.Component[componentName]) {
				done(Wires.Component[componentName]);
				return;
			}
			// In case of view is set
			if (view) {
				Wires.MVC.fetchTemplate(this.view, function(html) {
					Wires.DOM.getFromString(html, function(dom) {
						Wires.Component[componentName] = dom;
						done(dom);
					});
				});
			}
			// Template case
			var template = this.template;
			if (template) {
				Wires.DOM.getFromString(template, function(dom) {
					Wires.Component[componentName] = dom;
					done(dom);
				});
			}
			// Template from inner contents
			var sourceElement = this.sourceElement;
			if (sourceElement) {
				var el = document.querySelector(sourceElement);
				if (!el) {
					console.error("Cant fetch element for ", componentName, " with selector ", sourceElement);
				} else {
					Wires.DOM.getFromString(el.innerHTML, function(dom) {
						Wires.Component[componentName] = dom;
						done(dom);
						$(el).remove();
					}.bind(this));
				}
			}
		}
	}, {
		components : {},
		componentDom : {},
		register : function(name, _class) {
			this.components[name] = _class;
			/*document.registerElement(name, {
			 prototype : Object.create(HTMLElement.prototype)
			 });*/
		},
		// Searching for components special attributes
		// If attribute found component-data, all the top children go inside this element
		searchForComponentDataAttribute : function(data, children) {
			var each = function(nodes) {
				_.each(nodes, function(node) {
					_.each(node.attribs, function(attrValue, attrName) {
						if (attrName === 'component-data') {
							node.children = children;
						};
					});
					if (node.children) {
						each(node.children);
					}
				});
			};
			each(data);
		},
		getCustomComponent : function(name) {
			return this.components[name];
		}
	});
})();
