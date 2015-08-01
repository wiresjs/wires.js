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

Any array you create is going to be converted to $array object. It's going to have some magic methods that you can take advantage of.

Say, we have variables defined.

```js
var user1 = {name : "user1"}
var user2 = {name : "user2"}
this.users = [user1, user2]
```

Basically means, that once your template is processed, this.users will be converted to $array, that methods described below.
If you want to access them right away, initialize your array like this:

```js
this.users = $array([user1, user2]);
```

### $add

Adds new values to array

```js
this.users.$add({name : "user3"}) // Object passed
this.users.$add([{name : "user4"}, {name : "user5"}]) // Array with objects
```



## You app.js


All starts with the router
```js
domain.require(function($router){

	  $router.add('/:action?', 'BaseController',[

      ])

      $router.start();
})
```
