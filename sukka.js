var assert = require('assert')
var should = require('should');
var domain = require("wires-domain");
var WatchJS = require("watchjs")
var watch = WatchJS.watch;
require('require-all')(__dirname + "/src");
var test = {
   sukka: 1,
   user: {
      name: "ivan",
      age: 1

   },
   user2: {
      name: "jose",
      age: 2
   },
   a: {
      b: {
         c: 1
      }
   },
   b: {
      a: {
         c: 100
      }
   },
   c: {
      a: ["hello"]
   }
};
// watch(test, ['a', 'b', 'c'], function(prop, action, newvalue, oldvalue) {
//    var v = newvalue;
//    console.log(v);
// });
// test.a.b.c = 20;
// test.a = {
//    b: {
//       c: 100
//    }
// }

watch(test, ['c', 'a'], function(prop, action, newvalue, oldvalue) {
   var v = newvalue;
   console.log("new shit", JSON.stringify(v));
});

//test.c.a = [2]

test.c.a.push("world")
test.c.a.splice(1, 1)

//test.user2.age = 20;
test.user2 = {
   age: 1
}

//test.sukka = "lal"
