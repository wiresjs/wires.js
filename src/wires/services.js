domain.module("_", function() {
   return isNode ? require("lodash") : window._;
});

var nodeAsyncLib = isNode ? require("async-watch") : undefined;

domain.module("wires.AsyncWatch", function() {
   return isNode ? nodeAsyncLib.AsyncWatch : window.AsyncWatch;
});

domain.module("AsyncTransaction", function() {
   return isNode ? nodeAsyncLib.AsyncTransaction : window.AsyncTransaction;
});
