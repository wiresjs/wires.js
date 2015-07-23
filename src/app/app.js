$(function() {
	'use strict';



	domain.require(function($router, $waitForSelector) {


		$waitForSelector(null, '.pukka').then(function(){
		//	console.log("Bitch was found");
		});
		var pukka = $("<div class='pukka'/>");
		pukka.appendTo("body");



		$router.add('/test/state1/:action?', 'BaseController', [
			$router.state('/test/state1/hello', 'HelloController')
		])

		$router.add('/test/state2/:action?', 'BaseController2', [
			$router.state('/test/state2/hello', 'HelloController2')
		])


		$router.add('/test/:action/:', 'State3Controller', [

		])

		$router.start();
	})
});
