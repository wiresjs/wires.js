(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("app.Application",["wires.Router"],function(Router){ var $_exports;


class Application {
   static main() {
      let router = new Router({
         package: 'app.controllers'
      });

      router.root('BaseController -> base.html', [
         // users
         router.state('users/', 'UsersController -> users.html', [
            router.state(':id/', 'UsersDetails -> users_details.html')
         ]),
         // blogs
         router.state('blogs/', 'BlogsController -> blogs.html')
      ]);
      router.start();
   }
}

$_exports = Application;

return $_exports;
});
realm.module("app.routes.Root",["app.routes.UserRoute", "wires.app.Router"],function(UserRoute, Router){ var $_exports;

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
realm.module("app.routes.UserRoute",["wires.app.render", "wires.app.Router"],function(render, Router){ var $_exports;

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
realm.module("app.controllers.BaseController",[],function(){ var $_exports;

class BaseController {
   initialize() {

   }
}


$_exports = BaseController;

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());