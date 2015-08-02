wires.js
========

Wires.js - Wires your DOM


# How to install

Install it from bower:

    bower install wires.js

It will install dependencies, that you need to include into your project along with build.min.js from build folder

* Jquery
* wires-domain

## Resource
Resource, in essense, represents an object with magic methods attached. It can fetch data into the object, as well as reset all defined parameters. 

You can initialize resource 2 different ways:

Provide a string:

```js
this.user = $resource("/api/user/:id")
```

Provide initial data and options with endpoint property:

```js
this.user = $resource({name : "user"}, {endpoint : "/api/user/:id" })
```

:_id is the parameter that will be replaced with input parameters (if defined)

Let's load some data into resource

### Fetch

```js
this.user.$fetch({id : 1})
```

Makes a GET request to /api/user/1, Imagine if you don't supply $fetch with request parameters. :_id will be just ignored, and the GET request is going to look like /api/user. 

Fetch  automatically fulfills the array and returns a promise.

```js
this.user.$fetch({id : 1}).then(function(myData){
   // do anything you like
}).catch(function(e){
   // handle errors
})
```

### Reset

To erase all defined values use $reset
```js
this.user.$reset()
```

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
