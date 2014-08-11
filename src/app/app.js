/*global $ */
/*jshint unused:false */
var app = app || {};

$(function() {
	'use strict';
	var history = new Wires.MVC.Router();
	
	//history.register(new RegExp('.*?'), app.BaseController);
	/*history.register('', app.MainController);
	
	history.register('animate', app.AnimateController);
	history.register('form', app.FormController);
	history.register('repeat', app.RepeatController);
	history.register('collection', app.CollectionController);
	
	history.register('test', app.TestController);
	
	history.start();*/
	
	Wires.Connect.wireControllers();
});