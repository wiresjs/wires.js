domain.service("attributes.ws-repeat", function() {
	return Wires.Attr.extend({
		initialize: function(scope, dom, element, attr, node) {
			this.instance = scope.instance;
			this.scope = scope;
			this.element = element;
			this.attr = attr;
			this.node = node;
			this.dom = dom;
			this.condition = this.attr.value;
			// Get the essentials
			this.essentials = this.getEssentials();

			var arrayWasInitialized = this.essentials.collection.getTrickedValue()._WiresEach;
			this.bindArrayEvents(false);
			this.items = [];
			// Watch collection
			Wires.Watcher.spy(this.instance, this.essentials.collection, this);
		},
		onElementReady: function() {

			this.node.placeholderBefore.nodeValue = 'ws-repeat: ' + this.condition;
			this.node.placeholderAfter.nodeValue = '/ws-repeat: ' + this.condition;

			if (this.delayedAddFunction) {
				this.delayedAddFunction();
				this.delayedAddFunction = undefined;
			}
		},
		addItem: function(item, index) {
			// Setting getter for index
			item[this.essentials.key.param] = function() {
				return this.array.indexOf(this.item);
			}.bind({
				array: this.array,
				item: item
			});
			item.parent = this.instance;
			var self = this;
			// In order for the compiler to get the proper dom,
			// Including the current element, we need to mock children
			var modifiedDom = _.cloneDeep(this.dom);
			// Removing the repeat attribute, otherwise it'll go recursively
			delete modifiedDom.attribs['ws-repeat'];

			var modifiedChildren = [modifiedDom];
			var newScope = Wires.World.attachParents(this.scope, item, self.essentials.value.param);

			var child = Wires.World.parse(newScope, modifiedChildren, this.element, {
				insertBefore: this.node.placeholderAfter
			})

			self.items.push(child);

		},
		bindArrayEvents: function(arrayWasInitialized) {
			var collection = this.essentials.collection;
			this.array = collection.getTrickedValue();
			// IF array was initialized, but the class was reloaded, all the
			// instances have to be dropped
			// Because new elements are created
			if (arrayWasInitialized) {
				this.array._WiresEach = null;
			}
			if (_.isArray(this.array)) {
				// Prototype array only once
				if (!this.array._WiresEach) {
					this.array.clean = function() {
	               this.splice(0, this.length);
	            }

					this.array.remove = function() {
	               this.splice(0, this.length);
	            }

					this.array._WiresEach = [];
					this.array._WiresRepeat = this;

					this.array.add = function() {
	               this.push.apply(this, arguments)
	            }

					this.array.push = function() {
						var target = arguments.length > 0 ? arguments[0] : null;
						var push = Array.prototype.push.apply(this, arguments);
						if (target) {
							var ar = this;
							target.remove = function(){
	                     var index = ar.indexOf(this);
	                     ar.splice(index,1);
	                  }
							_.each(this._WiresEach, function(eachInstance) {
								eachInstance.addItem(target);
							});
						}

						return push;
					};

					this.array.splice = function(index, untill) {
						var self = this;

						_.each(this._WiresEach, function(eachInstance) {
							for (var i = index; i < index + untill; i++) {
								console.log(eachInstance.items[i])
								$(eachInstance.items[i].element).remove();
							}
							eachInstance.items.splice(index, untill);
						});
						return Array.prototype.splice.apply(this, arguments);
					};
				}
				this.array._WiresEach.push(this);
			}
		},
		getArrayLength: function() {
			return this.array.length;
		},
		getEssentials: function() {
			var essentials = Wires.Variable.extract(this.scope, this.condition);
			if (essentials.length < 2) {
				console.error("Can't recognize expression!");
				return;
			}
			return {
				value: essentials[0],
				key: (essentials.length === 3 ? essentials[1] : {
					name: '$index',
					param: 'index'
				}),
				collection: essentials[essentials.length === 3 ? 2 : 1]
			};
		},
		_setValue: function(variable, newValue) {
			var self = this;

			var values = newValue ? newValue : variable.getTrickedValue();
			if (_.isArray(values) && self.dom.children) {
				_.each(values, function(item, index) {
					self.addItem(item, index);
				});
			}
		},
		// Getting all the elements in the beetween placeholders
		// We don't know parent so the elements need to be collected
		removeElements: function() {
			var elements = [];
			var el = $(this.node.placeholderBefore);
			while (el[0] != undefined && el[0] != this.node.placeholderAfter) {
				el = el.next();
				elements.push(el);
			}
			_.each(elements, function(el) {
				el.remove();
			});
		},
		// In order to avoid nasty blink and defered function
		// We need to wait initial value set and store it as delayed function
		// When the dom is ready it should be triggered
		setValue: function(variable, newValue, isInitial) {
			if (isInitial) {
				this.delayedAddFunction = function() {
					this._this._setValue.apply(this._this, this.args);
				}.bind({
					_this: this,
					args: arguments
				});
			} else {
				this._setValue.apply(this, arguments);
			}
		},
	}, {
		addAttibute: false,
		ignoreRestAttributes: true,
		shouldAppendElement: false
	});
})
