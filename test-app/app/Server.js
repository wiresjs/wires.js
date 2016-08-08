"use realm backend";
import Express from realm.server;

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
export Server
