
wires.js
========

Wires.js - Wires your DOM


# How to install

Install it from bower:

    bower install wires.js

It will install dependencies, that you need to include into your project along with build.min.js from build folder

* Jquery
* wires-domain

## Subscribe to changes
You can track if variable is changed by defining "$changed" function to an object.
For example:

```js
this.form = {};
this.form.$changed = function(key, oldValue, newValue){

}
```
Any time value is changed withing the object, you are going to be notified



## Including external views
Use ws-include attribute.
```html
<div ws-include="myView.html"></div>
```
Parent scope will be automatically applied. Children will be ignored. (for now). It's planned to have "section" with inner contents in future.

Repeaters and Conditional statements won't work directly with ws-include. It has to be wrapped.

For example:
```html
<div ws-repeat="$user in $users">
   <div ws-include="myView.html"></div>
</div>
```


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

### Fetch resource

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

### Reset resource

To erase all defined values use $reset
```js
this.user.$reset()
```

### Remove resource
If a parent array is attached calles array.$remove(obj)

If restful endpoint is attached pefrorms a DELETE request
```js
this.user.$remove()
```

## Arrays

Arrays are the most smartest objects in entire framework. They automate data interaction with RESTful service.
Any array passed to the template will be converted to $array object.

```js
var user1 = {name : "user1"}
var user2 = {name : "user2"}
this.users = $array([user1, user2])
```

Once your template is processed, this.users will be converted to $array, which methods described below.

```js
this.users = $array([user1, user2]);
```

### Initialize with RESTful endpoint
You can easily tell $array to fetch data from RESTful service. To do that initialize $array object like so:
```js
this.users = $array("/api/user/:_id"); // First arguments is a string
this.users = $array({ endpoint :"/api/user/:_id"} ); // First argument is an object
```

It's important for you to leave :id parameter (or any other, e.g :slug) in order to remove items automatically

### Fetch
```js
this.users.$fetch({ someQuery : "hello"})
```
Will peform a request to /api/user?someQuery=hello

Returns a promise

```js
this.users.$fetch({ someQuery : "hello"}).then(function(arr){
 // do whatever you like.
 // At this point all models are injected into the dom if (ws-repeat) was defined
}).catch(function(e){
 // Catch an error
})
```

### $add

Adds new values to array

```js
this.users.$add({name : "user3"}) // Object passed
this.users.$add([{name : "user4"}, {name : "user5"}]) // Array with objects
this.users.$add(user1, user2, user3, ...) // Also works
```
If rest configuration is attached - POST http request will be peformed.

Returns a promise
```js
this.users.$add(user).then(function(){
  // User has been sucessfully added
}).catch(function(e){
 // Handles errors here
})
```

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
