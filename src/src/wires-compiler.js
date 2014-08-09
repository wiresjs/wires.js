var Wires = Wires || {};
(function() {
	'use strict';
	Wires.World = Wires.Class.extend({
		initialize : function(options) {
			this.template = options.template;
			this.target = options.target;
			this.scope = options.scope;
			var self = this;
			var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function(error, dom) {
				if (error) {
					console.log(error);
				} else {
					Wires.World.parse(self.scope, dom, self.target);
				}
			});
			var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
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
			if (param !== undefined) {
				newScope.instance = {}
				newScope.instance[param] = instance;
			}
			if (scope.parents) {
				newScope.parents = _.union(newScope.parents, scope.parents);
			}
			return newScope;
		},
		parse : function(scope, dom, target, options) {

			var node;
			var iterateAsync = function(index) {
				if (index === undefined && dom.length > 0) {
					index = 0;
				}
				var item = dom[index];
				if (item.type === 'text') {
					node = new Wires.TextNode(scope, item, target, options);
					if (index < dom.length - 1) {
						index++;
						iterateAsync(index);
					}
				}
				if (item.type === 'tag') {
					node = new Wires.TagNode(scope, item, target, options);
					node.create(function(){
						if (index < dom.length - 1) {
							index++;
							iterateAsync(index);
						}
					})
				}
			}

			iterateAsync();
			return node;
		}
	});
})();