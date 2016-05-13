"use realm";

import Schema as userSchemas from wires.runtime;
import Properties as prop from wires.utils;
import Common from wires.core;

class Directive extends Common {

   constructor(element) {
      super();
      this.element = element;
   }

   inflate(info) {
      info = info || {};
      var transclude = info.transclude;
      var locals = info.locals || this.element.locals;
      var scope = info.scope || this;

      // adding transclude schema to the scope;
      if (transclude) {

         prop.defineHidden(scope, '$$transcluded', transclude);

      }
      var opts = this.__proto__.constructor.compiler;

      if (opts.schema && userSchemas[opts.schema]) {
         var locals = locals || this.element.locals;
         this.element.inflate(userSchemas[opts.schema], scope, locals)
      }
   }

   /**
    * detach
    * Destorying watchers from directives and attributes
    *
    * @return {type}  description
    */
   detach() {
      this.__gc();
   }
}

export Directive;
