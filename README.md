wires.js
========

Wires.js - Wires your DOM


# How to install

Install it from bower:

    bower install wires.js
    
It will install dependencies, that you need to include into your project along with build.min.js from build folder

* Jquery
* wires-domain


## You app.js

All starts with the router
```js
domain.require(function($router){
		
	  $router.add('/:action?', 'BaseController',[
        
      ])

      $router.start();
})
```
    

