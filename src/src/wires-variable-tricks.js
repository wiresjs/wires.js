var Wires = Wires || {};
(function() {
	'use strict';
	Wires.VariableTricks = Wires.Class.extend({
	},{
		changeWatchableTarget : function(result)
		{
			// Check for wires collection
			var isCollection = result instanceof Wires.Collection;
			if ( isCollection ){
				result = result.array;
			}
			return result;
		}
	});
})();