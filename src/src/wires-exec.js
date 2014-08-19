// Executions in Wires.js comes to this module
// All the functions should come to have their birth here
var Wires = Wires || {};
(function() {

	'use strict';

	Wires.Exec = Wires.Class.extend({}, {
		// Compiling and execuing given expression
		// All parameters should be given
		expression : function(options) {
			// STRING: The actual statement
			var statement = options.statement;

			// STRING: The new variable that's coming
			var incomingVar = options.incomingVar;

			var resultNeeded = options.resultNeeded !== undefined ? options.resultNeeded : true;

			// STRING: New value that has to be set
			var newValue = options.newValue;

			// Current scope
			var scope = options.scope;

			// Attached variables
			var variables = options.variables;

			var data = {};

			// Going through given parameters
			// In order to user $ it's essential to pass the arguments to function
			// However the variables with a nested objects can't be passed as is
			// It's needed to be in a proper variable format
			// Replacing . (DOT) sign with underscore solves this problem

			_.each(variables, function(variable) {

				var value = variable.getValue ? variable.getValue() : variable;
				if (newValue !== undefined && !variable.service) {
					value = variable.equalsTo(incomingVar) ? newValue : value;
				}
				var key = variable.name.replace(/[\[.\]]/ig, '_');

				data[key] = value;
				statement = statement.split(variable.name).join(key);
			});

			// Creating function
			var func = '(function(' + _.keys(data) + '){ ' + (resultNeeded ? 'return' : '') + ' ' + statement + '})';
			var result = '';

			// Getting "this"
			var _this = this.getThisPointer(scope);

			try {

				result = eval(func).apply(_this, _.values(data));
				

			} catch (e) {
				// Fallback - nice print to console
				this.failedMessage(e, {
					message : "Failed to execute expression",
					code : statement,
					scope : scope,
					variables : data,
					func : func
				});
			}
			return result;
		},
		// Compiling regular variable execution (or single function)
		// The executiong does not happen here, cuz the function needs to be
		// cached somewhere else
		variable : function(param) {
			return eval('(function(){return this.' + param + '})');
		},

		// this argument
		// The critical point of any compiled function
		// Passing parent (current object)
		// Along with the list of parents
		getThisPointer : function(scope) {
			var _this = scope.instance;
			if (scope.parent || scope.parents) {
				_this = scope.instance;
				_this.parent = scope.parent;
				_this.parents = scope.parents;
			}
			return _this;
		},

		// Failed message
		// Grouped in console for a clear view and understanding an error
		failedMessage : function(e, options) {
			Wires.Debug.showError(e, options.func);
			console.groupCollapsed(options.message, options.param || '');
			console.error(e.message);
			console.error(e.stack ? e.stack : e);
			if (options.code) {
				console.error(options.code);
			}
			if (options.variables) {
				console.error('Local variables', options.variables);
			}
			if (options.target) {
				console.error('Destination instance:', options.target || {});
				console.error('Destination property:', options.target.property || {});
			}
			console.error('Registered scope:', options.scope || {});
			if (options.scope && options.scope.parent) {
				console.info('Maybe you meant $parent?');
			}
			console.groupEnd();
		},
	});
})();