/*global $ */
/*jshint unused:false */
var app = app || {};

$(function() {
	'use strict';
	var history = new Wires.MVC.Router();
	Wires.Debug.enabled = true;
	
	history.register(null, app.MainController);
	history.register('test', app.TestController);
	
	
	history.on404(app.NotFoundController);
	
	history.start();
	

});