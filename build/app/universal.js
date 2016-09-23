(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("app.Application",["wires.core.Schema", "wires.schema.test", "wires.runtime.Schema"],function(Schema, test, userSchemas){ var $_exports;/* @#realm-source:test-app/app/Application.js#*/


class TestController {
   constructor()
   {
      let self = this;
      let index = 0;
      this.name = "Foo";
      setTimeout(() => {
         self.name += index;
         index++;
      },1000)
   }
}
class Application {
   static main() {

      console.log('here')
      Schema.inflate({
         scope : new TestController(),
         target : document.querySelector("body"),
         schema : userSchemas["index.html"]
      })

   }
}

$_exports = Application;

return $_exports;
});
realm.module("app.TestInflate",[],function(){ var $_exports;/* @#realm-source:test-app/app/TestInflate.js#*/

class TestInflate {
   static main() {

   }

}

$_exports = TestInflate;

return $_exports;
});
realm.module("app.routes.Root",["app.routes.UserRoute", "wires.app.Router"],function(UserRoute, Router){ var $_exports;/* @#realm-source:test-app/app/routes/Root.js#*/

class Root extends Router {

   initialize() {
      this.name = "ivan";

      console.log("render root");
      return 'index.html';
   }

   onUser() {
      console.log("onUser (root)");
      return new UserRoute();
   }

   onProfile(id) {
      console.log("onProfile (root)");
      return 'profile.html';
   }
}

$_exports = Root;

return $_exports;
});
realm.module("app.routes.UserRoute",["wires.app.render", "wires.app.Router"],function(render, Router){ var $_exports;/* @#realm-source:test-app/app/routes/UserRoute.js#*/

class UserRoute extends Router {
   initialize() {
      console.log("UserRoute initialize")
      this.name = "sukka"
      return 'user.html';
   }

   onOne() {
      console.log("UserRoute onOne")
      return 'user/one.html';
   }
   onTwo() {
      console.log("UserRoute onTwo")
      return 'user/two.html';
   }
}

$_exports = UserRoute;

return $_exports;
});
realm.module("app.controllers.BaseController",[],function(){ var $_exports;/* @#realm-source:test-app/app/controllers/BaseController.js#*/

class BaseController {
   initialize() {

   }
}


$_exports = BaseController;

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());