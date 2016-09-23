(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("app.Server",["realm.server.Express"],function(Express){ var $_exports;/* @#realm-source:test-app/app/Server.js#*/

class Server extends Express {

   configure() {

      this.serve("/dependencies/", "@default");
      this.serve("/wires-dependencies/async-watch", "@home/node_modules/async-watch/");
      this.serve("/build/", "@home/build");

      this.addScripts([
         '/dependencies/lodash.min.js',
         '/dependencies/realm.js',
         '/dependencies/realm.router.js',
         '/wires-dependencies/async-watch/dist/async-watch.js',

         '/build/views.js',
         '/build/polyfills.js',
         '/build/universal.js',
         '/build/app/universal.js'
      ]);

      this.bindIndex(/^\/(?!api|_realm_|favicon.ico).*/, {
         application: 'app.Application',
         title: "Hello"
      });

      this.start();
   }
}

$_exports = Server

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());