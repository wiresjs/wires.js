realm.module("utils.lodash", function() {
   return isNode ? require("lodash") : window._;
});

var nodeAsyncLib = isNode ? require("async-watch") : undefined;

realm.module("wires.AsyncWatch", function() {
   return isNode ? nodeAsyncLib.AsyncWatch : window.AsyncWatch;
});

realm.module("realm", function() {
   return realm;
});

realm.module("AsyncTransaction", function() {
   return isNode ? nodeAsyncLib.AsyncTransaction : window.AsyncTransaction;
});
