realm.module("utils.lodash", function() {
   return $isBackend ? require("lodash") : window._;
});

realm.module("utils.Promise", function() {
   return $isBackend ? require("Promise") : window.Promise;
});
var nodeAsyncLib = $isBackend ? require("async-watch") : undefined;

realm.module("wires.AsyncWatch", function() {
   return $isBackend ? nodeAsyncLib.AsyncWatch : window.AsyncWatch;
});

realm.module("realm", function() {
   return realm;
});

realm.module("nodejs.utils.stream", function() {
   return $isBackend ? require("event-stream") : {}
})
realm.module("nodejs.utils.fs", function() {
   return $isBackend ? require("fs") : {};
});
realm.module("nodejs.utils.walk", function() {
   return $isBackend ? require("walk") : {};
});
realm.module("nodejs.utils.path", function() {
   return $isBackend ? require("path") : {};
});

realm.module("AsyncTransaction", function() {
   return $isBackend ? nodeAsyncLib.AsyncTransaction : window.AsyncTransaction;
});
