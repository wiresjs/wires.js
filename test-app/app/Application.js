"use realm";

import Schema from wires.core;
import test from wires.schema;
import Schema as userSchemas from wires.runtime;

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
export Application;
