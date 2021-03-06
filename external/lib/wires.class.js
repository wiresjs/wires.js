var Wires = Wires || {};
(function() {
	var extend = function(protoProps, staticProps) {
		var parent = this;
		var child;
		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if (protoProps && _.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function() {
				return parent.apply(this, arguments);
			};
		}
		// Add static properties to the constructor function, if supplied.
		_.extend(child, parent, staticProps);
		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function() {
			this.constructor = child;
		};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;
		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps)
			_.extend(child.prototype, protoProps);
		// Set a convenience property in case the parent's prototype is needed
		// later.
		child.__super__ = parent.prototype;
		// Providing a method that can call a parent's method
		child.prototype.__parent__ = function(method, args) {
			child.__super__[method].apply(child.prototype, args);
		};
		return child;
	};
	var Class = function(protoProps, staticProps) {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};
	Class.extend = extend;
	// _.extend(Class.prototype, Wires.Events);
	Wires.Class = Class;
})();
