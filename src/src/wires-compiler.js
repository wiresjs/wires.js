var Wires = Wires || {};
(function() {
	'use strict';
	Wires.World = Wires.Class.extend({
		initialize : function(options) {
			this.template = options.template;
			this.target = options.target;
			this.scope = options.scope;
			this.done = options.done;

			var self = this;
			if ( options.dom ){
				Wires.World.parse(self.scope, options.dom, self.target).then(function(){
					if ( options.done ){
						options.done();
					}
				})
			} else {
				var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function(error, dom) {
					if (error) {
						console.log(error);
					} else {
						Wires.World.parse(self.scope, dom, self.target).then(function(){
							if ( options.done ){
								options.done();
							}
						})
					}
				});
				var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
				parser.parseComplete(this.template);
			}


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
				parents : [parent],
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
			return domain.each(dom, function(item){
				if (item.type === 'text') {
					return new Wires.TextNode(scope, item, target, options);
				}
				if (item.type === 'tag') {
					var node = new Wires.TagNode(scope, item, target, options);
					return new Promise(function(resolve, reject){
						node.create(function() {
							return resolve(node);
						});
					})
				}
			})
		}
	});
})();
