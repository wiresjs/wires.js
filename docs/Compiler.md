# Wires Compiler
Wires String compiler uses angular expressions to compile and evaluate strings.
However wires.js has its own module that handle watching and variable extracting.


## Compile and watch a string with expressions

Say, we have a string template

```
Hello, i am {{user.name}}, I am {{user.age}} years old
```

I think particular example 2 variables are going to be watched.
StringInterpolation service will compile it into a function


```js
domain.require(function(StringInterpolation) {
   var str = 'Hello, i am {{user.name}}, I am {{user.age}} years old';
   var model = StringInterpolation.compile(str);
});
```
After a string is compiled, we are ready to initialize watchers

```js
var scope = {
   user : {
      name : "John",
      age : 20
   }
}
model(scope, function(compiledString) {

});
```

Initially models' callback with a compiled string is called on the next tick (once all variables are set within the current tick). So, for example:

```js
var scope = {
   user : {
      name : "John",
      age : 20
   }
}
scope.user.name = "Jose"
scope.user.name = "Bob"
scope.user.name = "Juan"
```

Will result in only one call. However:

```js
scope.user.name = "Juan"
setTimeout(function(){
   scope.user.name = "Peter"
},0);
```

Will result in 2 calls

```js
Hello, i am Juan, I am 20 years old
Hello, i am Peter, I am 20 years old
```
