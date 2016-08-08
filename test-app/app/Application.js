"use realm";

import Router from wires;

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
export Application;
