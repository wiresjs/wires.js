var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Component = Wires.Class.extend({
		initialize : function() {
		},
		getDomStructure : function(done) {
			var view = this.view;
			var self = this;
			// In case of view is set
			if (view) {
				if (Wires.Component[view]) {
					done(Wires.Component[view]);
				} else {
					Wires.MVC.fetchTemplate(this.view, function(html) {
						Wires.DOM.getFromString(html, function(dom) {
							Wires.Component[view] = dom;
							done(dom);
						});
					});
				}
			}
			var template = this.template;
			if (template) {
				if (!self.__dom) {
					Wires.DOM.getFromString(template, function(dom) {
						self.__dom = dom;
						done(dom);
					});
				} else {
					done(self.__dom);
				}
			}
		}
	}, {
		components : {},
		componentDom : {},
		register : function(name, _class) {
			this.components[name] = _class;
			document.registerElement(name, {
				prototype : Object.create(HTMLElement.prototype)
			});
		},
		getCustomComponent : function(name) {
			return this.components[name];
		}
	});
})();
