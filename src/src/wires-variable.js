// All variable magic happens here
var Wires = Wires || {};
(function() {
	'use strict';

	// Extract parent variables from expression
	// Clean the path from it
	// Return the parent instance from the scope
	var extractParents = function(path, scope) {
		var parentsRegExp = new RegExp(/^(parent\.|parents\[(\d{1,4})\]\.)/m);
		var pMatch = path.match(parentsRegExp);
		var instance = scope.instance;
		if (pMatch) {
			var parentIndex;
			// If we get the index
			if ((parentIndex = parseInt(pMatch[2])) > 0) {
				if (scope.parent && scope.parents.length >= parentIndex) {

					// Attach instance if parent is found in parents array
					instance = scope.parents[parentIndex];
				}
			} else {

				// If it's just parent assign it directly
				instance = scope.parent;
			}
			// Replacing parent or parents to empty string
			// We don't need it any more
			path = path.replace(parentsRegExp, '');
		}
		return {
			instance : instance,
			path : path
		};
	};

	var getTargetVariable = function(s, p) {
		var parentsData = extractParents(p, s);
		var instance = parentsData.instance;
		var path = parentsData.path;
		
		var p = path.split('\.');
		if (p.length === 1) {
			return {
				instance : instance,
				property : p[0],
			};
		}
		var next = instance;
		var property = null;
		_.each(p, function(element, index) {
			if (next[element] !== undefined && index < p.length - 1) {
				next = next[element];
			}
			if (index === p.length - 1) {
				property = element;
			}
		});
		return {
			instance : next,
			property : property
		};
	};

	Wires.Variable = Wires.Class.extend({

		// The variable should be initialized after extraction
		// So at this point it's not recommended to create it manually
		initialize : function(scope, param, expression) {
			this.instance = scope.instance;
			this.parent = scope.parent;
			this.scope = scope;
			this.isFunction = false;
			this.name = param;

			// Expressions should be handled differently
			if (expression) {
				this.expression = param.replace('{#', '').replace('#}', '');
				this.expressionVariables = expression.variables;
				return;
			}

			// Removing first symbol (which is $)
			// Which is fake
			this.param = param.substring(1);

			// Simple detection for function
			if (param.indexOf('(') > -1) {
				this.isFunction = true;
			}
			this.target = getTargetVariable(this.scope, this.param);
			this.compileFunction();
		},
		compileFunction : function() {
			this.compiledFunction = Wires.Exec.variable(this.param);
		},
		equalsTo : function(someVar) {
			if (this.target && someVar.target) {
				if (this.target.instance.uniqueId == someVar.target.instance.uniqueId) {
					if (this.target.param == someVar.target.param)
						return true;
				}
			}
			return someVar.name === this.name;
		},
		_executeFunction : function() {
			var func = this.compiledFunction;
			
			var _this = Wires.Exec.getThisPointer(this.scope);
			
			var result = '';
			try {
				result = func.apply(_this);
			} catch (e) {
				Wires.Exec.failedMessage(e, {
					message : 'Failed to execute',
					param : this.expression ? this.expression : this.param,
					target : this.target,
					scope : this.scope
				});
			}
			return result;
		},
		// Gets the value of variable / expression
		getValue : function(incomingVar, newValue) {
			
			if (this.expression) {
				
				return Wires.Exec.expression({
					statement : this.expression,
					incomingVar : incomingVar,
					newValue : newValue,
					scope : this.scope,
					variables : this.expressionVariables
				});
			}
			if ( !_.isObject(this.target.instance) ){
				return this.target.instance;
			}
			if (!this.isFunction && this.target.instance[this.target.property] !== undefined) {
				return this._executeFunction();
			}
			
			if (this.isFunction) {
				return this._executeFunction();
			}
			
			return '';
		},
		setValue : function(value) {
			this.target.instance[this.target.property] = value;
		}
	}, {
		extract : function(scope, text) {
			var matches = text.match(/(\$[a-zA-Z0-9_.\[\]]+(\([$\w,\s'".]*\))?)/g);
			var self = this;
			var variables = [];
			if (matches) {
				matches = _.uniq(matches);
				_.each(matches, function(data) {
					variables.push(new Wires.Variable(scope, data));
				});
			}
			var expressions = [];
			// Extract expressions
			matches = text.match(/(\{#(.+?)#\})/g);
			if (matches) {
				matches = _.uniq(matches);
				_.each(matches, function(expression) {
					expressions.push(new Wires.Variable(scope, expression, {
						variables : variables
					}));
				});
			}
			var completeList = [];
			_.each(expressions, function(expr) {
				completeList.push(expr);
			});
			_.each(variables, function(variable) {
				completeList.push(variable);
			});
			return completeList;
		}
	});
})();