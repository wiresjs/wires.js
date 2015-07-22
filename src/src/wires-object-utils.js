

Object.defineProperty(Object.prototype, "watch", {
	enumerable : false,
	configurable : true,
	writable : false,
	value : function(prop, handler) {
		var oldval = this[prop], newval = oldval, getter = function() {
			return newval;
		}, setter = function(val) {
			oldval = newval;
			return newval = handler.call(this, prop, oldval, val);
		};
		if (delete this[prop]) { // can't watch constants
			Object.defineProperty(this, prop, {
				get : getter,
				set : setter,
				enumerable : true,
				configurable : true
			});
		}
	}
});

id_counter = 1;
//  Unique id  helper
Object.defineProperty(Object.prototype, "__uniqueId", {
	writable : true
});
Object.defineProperty(Object.prototype, "uniqueId", {
	get : function() {
		if (this.__uniqueId == undefined)
			this.__uniqueId = id_counter++;
		return this.__uniqueId;
	}
});

Object.defineProperty(Object.prototype, "unwatch", {
	enumerable : false,
	configurable : true,
	writable : false,
	value : function(prop) {
		var val = this[prop];
		delete this[prop]; // remove accessors
		this[prop] = val;
	}
});

// request animations frame polifil
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
			|| function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
})();
