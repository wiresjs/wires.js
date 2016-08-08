"use realm";
import render from wires.app;
import Router from wires.app;

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
export UserRoute;
