realm.module("utils.lodash", function() {
   return isNode ? require("lodash") : window._;
});

realm.module("utils.Promise", function() {
   return isNode ? require("Promise") : window.Promise;
});
var nodeAsyncLib = isNode ? require("async-watch") : undefined;

realm.module("wires.AsyncWatch", function() {
   return isNode ? nodeAsyncLib.AsyncWatch : window.AsyncWatch;
});

realm.module("realm", function() {
   return realm;
});

realm.module("nodejs.utils.stream", function() {
   return isNode ? require("event-stream") : {}
})
realm.module("nodejs.utils.fs", function() {
   return isNode ? require("fs") : {};
});
realm.module("nodejs.utils.walk", function() {
   return isNode ? require("walk") : {};
});
realm.module("nodejs.utils.path", function() {
   return isNode ? require("path") : {};
});

realm.module("AsyncTransaction", function() {
   return isNode ? nodeAsyncLib.AsyncTransaction : window.AsyncTransaction;
});
