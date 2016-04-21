var isNode = typeof module !== 'undefined' && module.exports;
(function(domain) {
   domain.module("_", function() {
      return isNode ? require("lodash") : window._;
   });

   var nodeAsyncLib = isNode ? require("async-watch") : undefined;

   domain.module("AsyncWatch", function() {
      return isNode ? nodeAsyncLib.AsyncWatch : window.AsyncWatch;
   });

   domain.module("AsyncTransaction", function() {
      return isNode ? nodeAsyncLib.AsyncTransaction : window.AsyncTransaction;
   });

})(isNode ? require('wires-domain') : window.domain);
