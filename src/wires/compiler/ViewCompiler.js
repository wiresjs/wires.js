module wires.compiler.ViewCompiler

import UniversalQuery from wires.utils;

const ViewCompiler = class {
   constructor() {
      this.json = [];
   }

   /**
    * iterateChildren - a recursive function (private)
    *  Generates JSON
    * @return {type}  description
    */
   iterateChildren() {

   }

   /**
    * htmlString - convert raw html into a JSON
    *
    * @param  {type} html description
    * @return {type}      description
    */
   static htmlString(html) {

      var $ = UniversalQuery.init(html);

      const compiler = new ViewCompiler();
      const result = compiler.iterateChildren($.children);

      return result;
   }
}
export ViewCompiler;
