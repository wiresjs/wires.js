wires.js
========

Wires.js - Wires your DOM


# How to install

Install it from bower:

    bower install wires.js

It will install dependencies, that you need to include into your project along with build.min.js from build folder

* Jquery
* wires-domain


## Arrays

Wires has an $array object that provides necessary methods. Any array passed to the template will be converted. 
However it's more clear if you do it yourself. You can attach REST configuration if you need one.

```js
var user1 = {name : "user1"}
var user2 = {name : "user2"}
this.users = $array([user1, user2])
```

Basically means, that once your template is processed, this.users will be converted to $array, which methods described below.
If you want to access them right away, initialize your array like this:

```js
this.users = $array([user1, user2]);
```

### $add

Adds new values to array

```js
this.users.$add({name : "user3"}) // Object passed
this.users.$add([{name : "user4"}, {name : "user5"}]) // Array with objects
this.users.$add(user1, user2, user3, ...) // Also works
```
If rest configuration is attached - POST http request will be peformed.

### $remove

You can pass index or object respectfuly.
```js
this.users.$remove(0}) // First element will be removed
this.users.$remove(user1) // user1 object will be removed
```

If rest configuration is attached - DELETE http request will be peformed.

### $removeAll

Removes all elements from array
```js
this.users.$removeAll()
```

If REST configuration is attached - DELETE request will be ignored for the sake of security.



## You app.js


All starts with the router
```js
domain.require(function($router){

	  $router.add('/:action?', 'BaseController',[

      ])

      $router.start();
})
```
