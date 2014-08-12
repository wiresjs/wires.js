var Wires = Wires || {};
(function() {
	'use strict';
	Wires.DOM = Wires.Class.extend({
	}, {
		components : {},
		storage : {},
		_obtain : function(html, done) {
			var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function(error, dom) {
				if (error) {
					console.log(error);
				} else {
					done(dom);
				}
			});
			var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
			parser.parseComplete(html);
		},
		getFromString : function(html, done, storageKey) {
			if (storageKey) {
				if (this.storage[storageKey]) {
					done(this.storage[storageKey]);
				} else {
					this._obtain(html, function(dom) {
						this.storage[storageKey] = dom;
						done(dom);
					});
				}
			} else {
				this._obtain(html, function(dom) {
					done(dom);
				});
			}
		}
	});
})();
