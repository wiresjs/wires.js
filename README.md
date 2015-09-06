
wires.js
========

Wires.js - Wires your DOM


# How to install

Install it from bower:

    bower install wires.js

It will install dependencies, that you need to include into your project along with build.min.js from build folder

* Jquery
* wires-domain

## Controllers
Controllers can be initialized manually or automatically through a router.
If you want a controller to be called through a router, package name "controllers" needs to be added.

### Through Router
```js
domain.service("controllers.MainController", function(Controller) {
   return Controller.extend({
      _view: 'main.html',
      initialize: function() {

      }
   });
});
```

User it in a router

```js
$router.add('/', 'MainController');
```


### Manual call
You can controllers naturally by injecting them and calling "render()" method

```js
domain.service("Alert", function(Controller) {
   return Controller.extend({
      _view: "alert.html -> body",
      initialize: function(msg) {
         this.msg = msg;
      }
   });
});
```


```js
var alert = new Alert();
alert.render();
```

The content of alert.html it going to be appended to the corresponding element.

```html
<div class="alert">
   $msg
   <hr>
   <div ws-click="{{ $destroy() }}" class="close">
      x
   </div>
</div>
```
User "destroy()" method to remove elements from the DOM.

```js
var alert = new Alert();
alert.render();
setTimeout(function(){
   alert.destroy();
},2000);
```

## Subscribe to data changes
You can track if variable is changed by defining "$changed" function to an object.
For example:

```js
this.form = {};
this.form.$changed = function(key, oldValue, newValue){

}
```
Any time value is changed withing the object, you are going to be notified

## Validation

Form validation is powerful mechanism that allows you to create custom validation objects and adjust behaviours.
Wires.js does not come with defined validation, you have to do it yourself. "ws-validation" attribute takes place in case of defined ws-value attribute.
In fact it is being processed there. In any other case, attribute will be completely ignored.



```html
<input type="text" ws-value="$form.name" ws-validate="testEmail()">
```

In this version validator just toggles a class name. "testEmail" is a default validator (it is the only one that comes along with this release).

To create you own validator, register a service.

```js
domain.service("validators.simple", function() {
   return {
      cls: "nice-error",
      validate: function(arg1) {
         if (this.str === arg1){ // Input string cannot be equal to the first argument
            return true;
         }
      }
   };
});
```

```html
<input type="text" ws-value="$form.name" ws-validate="simple('hello')">
```
In this example, typing hello will add "nice-error" class.  You con't need to specify any arguments if you don't need them.
Multiple validators are allowed as well.

```html
<input type="text" ws-value="$form.name" ws-validate="simple, email, minLength(1)">
```

If a string contains non-valid javascript, validations won't work, and you will get a traceback (in the backend side )

Any response of "validate" function that differs from undefined will be taken is failure.


"this.str" - is the actual value.

Validator has 500ms delay. It waits for the user to type something before actually submmiting for validation.
Let's have some decency and let user to type his own email without being stressed out of red and annoying input.

Syntax is being compiled in the backend using (jsep)[http://jsep.from.so/] library. Therefore be cautious "1omnomo()" will spit out a backend error Nothing to be worried about though, Attribute will be just ignored.


## Dynamic Watchers
A function in a template that returns object with $watch key will silently try to watch the given variables.
For example

```html
<h1>{{  $someThingHere('myDynamicVariable') }}</h1>
<input type="text" ws-value="{{ $someThingHere('myDynamicVariable') }}"/><br>
<input type="text" ws-value="$myDynamicVariable"/>
```

According controller's function

```js
this.myDynamicVariable = "Hello";
this.someThingHere = function(path) {
     return {
        $watch: [path],
        $scope: this
    };
};
```
$watch should return an array with object's path. In this case it is going to be myDynamicVariable of "this" scope.

$scope is an optional parameter. Parent scope of a template is inhereted by default.

After running this template, the output should be like

```html
<h1>Hello</h1>
```

myDynamicVariable is now watched in all 3 preset nodes ( Header and 2 inputs, which are initialized through a macro and an expression accordingly ).


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
