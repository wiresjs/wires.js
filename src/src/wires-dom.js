var Wires = Wires || {};
(function() {
	'use strict';
	Wires.DOM = Wires.Class.extend({
	}, {
		components : {},
		getFromString : function(html, done) {
			var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function(error, dom) {
				if (error) {
					console.log(error);
				} else {
					done(dom);
				}
			});
			var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
			parser.parseComplete(html);
		}
	});
})();
