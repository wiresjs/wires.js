var utils = require('./utils');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

// Require mask
// Allows to have a scope, in case of
// var a = require('a') // @Global.b
// Line will be replaced with
// var a = Global.b

var requireMask = /((var)?\s+?(\w{1,20})\s?=\s?require\(.*?\)(;|,|$)?\s+?(\/\/\s*@(.*))?)/gi;

// Mask for obtaining module exports
// Getting the variable of it
var moduleExportsMask = /(module\.exports\s+?\=\s+?(\w{1,20}))/im;

// Settings hidden in .js file
// Should start with comment and next symbol @ (at)
// e.g // @scope GlobalVar
// $params will be replaced with values defined below
var paramatersMask = '\\/\\/\\s?@($params)\\s+?(.*)';

// Required parameters will be extracted accordingly
// This values will be extracted from the file
var requiredParameters = [ 'scope', 'exports' ];

// Returns a proper mask
var getParamsMask = function() {
	var stringMask = paramatersMask.replace('$params', requiredParameters.join('|'));
	return new RegExp(stringMask, 'gi');
};

var Exposer = utils.Class.extend({
	initialize : function(options) {
		this.path = options.path || "./";
		this.url = options.url || "/";
		_.bindAll(this);
	},
	// Express service for serving exposed files in particular directory
	express : function(req, res, next) {
		var url = req.url;

		if (url.indexOf(this.url) === 0) {
			var s = url.split(this.url);
			if (s.length === 2) {
				var relativePath = s[1];
				var contents = Exposer.exploseFile({
					file : path.join(this.path, relativePath)
				});
				res.set('Content-type', "application/javascript");
				res.send(contents);
			}
		} else
			next();
	},
}, {

	// Prepares variable to be exposed
	// Wires.utils is converted to
	// var Wires = Wires|| {};
	// var utils = Wires.utils|| {};
	// "utils" - is assign variable
	// 
	prepareVariable : function(variable, assign) {
		var sVar = variable.split('\.');
		var data = [];
		var s = '';
		_.each(sVar, function(stackVar, index) {
			if (index > 0) {
				s += '.';
			}
			s += stackVar;
			var targetVar = s;
			if (index === sVar.length - 1) {
				s = variable;
				targetVar = assign ? assign : s;
			}
			var addVar = index === 0 || (index === sVar.length - 1 && assign);
			data.push((addVar ? 'var ' : '') + targetVar + " = " + s + "|| {};");
		});
		return data.join('\n');
	},
	obtainMetaInfo : function(contents) {

		var mask = getParamsMask();
		var meta = {
			scope : 'window'
		};
		while (match = mask.exec(contents)) {
			var variable = match[1];
			var value = match[2];
			meta[variable] = value;
		}
		return meta;
	},
	exploseFile : function(params) {
		// Var reading file
		var contents = fs.readFileSync(params.file).toString();
		params = this.obtainMetaInfo(contents);
		var matches = [];
		while (match = requireMask.exec(contents)) {
			matches.push({
				str : match[0],
				variable : match[3],
				exposedVariable : match[6]
			});
		}
		var self = this;
		// Go through all the matches and replace requires to something
		// That could be recognized by the browser
		_.each(matches, function(item) {
			if (!item.exposedVariable) {
				contents = contents.replace(item.str, '');
			} else {
				var data = self.prepareVariable(item.exposedVariable, item.variable);
				contents = contents.replace(item.str, data);
			}
		});
		// Replacing module exports
		var mExports = contents.match(moduleExportsMask);
		var exportVariable = mExports[2];
		if (exportVariable) {
			contents = contents.replace(moduleExportsMask, (params.exports || params.scope) + '.' + exportVariable + " = "
					+ exportVariable);
		}

		var bc = [];
		if ( params.scope ){
			bc.push(self.prepareVariable(params.scope ));
		}
		if ( params.exports ){
			bc.push(self.prepareVariable(params.exports));
		}
		bc.push('(function(' + params.scope + '){');
		bc.push(contents);
		bc.push('})(' + params.scope + ');');
		return bc.join('\n');
	}
});

module.exports = Exposer;
