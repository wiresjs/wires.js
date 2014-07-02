var Wires = Wires || {};
(function() {
	'use strict';
	Wires.Acts.prototype.toggle = function(_this, variable) {

		var scope = this.node.scope.instance;
		if (variable === undefined) {
			variable = _this;
		} else {
			scope = _this;
		}
		if (!scope[variable]) {
			scope[variable] = true;
		} else {
			scope[variable] = false;
		}
	};
})();