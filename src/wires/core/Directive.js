module wires.core.Directive;

class Directive {

   constructor(element, scope, locals) {
      this.element = element;
      this.scope = scope;
      this.locals = locals;
   }
}

export Directive;
