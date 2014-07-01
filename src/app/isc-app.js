// @scope Wires
var utils = Wires.utils; // @Wires.utils
var Router = require('../wires/router/router'); // @Wires.Router


var IsomorphicApp = utils.Class.extend({
	initialize : function()
	{
		console.log(Wires);
		this.router = new Router();
	}
});
var app = new IsomorphicApp();

module.exports = app;