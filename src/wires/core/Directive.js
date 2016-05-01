module wires.core.Directive;
import Schema as userSchemas from wires.runtime;
import Properties as prop from wires.utils;
class Directive {

   constructor(element, name, value) {
      this.element = element;
      this.name = name;
      this.value = value;
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

   detach() {

   }
}

export Directive;
