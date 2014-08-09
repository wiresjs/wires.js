var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Component = Wires.Class.extend({
		initialize : function() {

		},
		getDomStructure : function(done) {
			var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function(error, dom) {
				if (error) {
					console.log(error);
				} else {
					done(dom);
				}
			});
			var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
			Wires.MVC.fetchTemplate(this.view, function(html) {
				
				parser.parseComplete(html);
			});

		}
	}, {
		components : {},
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