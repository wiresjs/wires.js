"use realm";
import UserRoute from app.routes;
import Router from wires.app;

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
export Root;
