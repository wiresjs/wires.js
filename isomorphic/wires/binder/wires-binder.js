// @scope Wires
var htmlparser = require("htmlparser");
var utils = require('../utils'); // @Wires.utils
var _ = require('underscore');

var Binder = utils.Class.extend({
	initialize : function(options) {
		this.template = options.template;
		this.target = options.target;
		this.scope = options.scope;
		var self = this;
		var handler = new htmlparser.DefaultHandler(function(error, dom) {
			Binder.parse(self.scope, dom, self.target);
		});
		var parser = new htmlparser.Parser(handler);
		parser.parseComplete(this.template);
	},
// At this point we are having our DOM in json
}, {
	cleanUp : function(element) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	},
	attachParents : function(scope, instance, param) {
		var parent = scope.instance;
		var newScope = {
			instance : instance,
			parents : [ parent ],
			parent : scope.instance,
			param : param
		};
		if (scope.parents) {
			newScope.parents = _.union(newScope.parents, scope.parents);
		}
		return newScope;
	},
	parse : function(scope, dom, target) {
		_.each(dom, function(item) {
			if (item.type === 'text') {
				new Wires.TextNode(scope, item, target);
			}
			if (item.type === 'tag') {
				new Wires.TagNode(scope, item, target);
			}
		});
	},
	registerAttribute : function(name, attributeHandler) {
	}
});

module.exports = Binder;
