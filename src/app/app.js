



$(function() {
	'use strict';

	domain.require(function($router){
		$router.add('/test/state1/:action?', 'BaseController',[
         $router.state('/test/state1/hello', 'HelloController')
      ])

      $router.add('/test/state2/:action?', 'BaseController2',[
         $router.state('/test/state2/hello', 'HelloController2')
      ])

      $router.start();
	})
});
