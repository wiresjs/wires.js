module wires.core.Universe;

import Element from wires.core;

import lodash as _ from utils;
import StringInterpolation from wires.expressions;

class Universe {
   constructor(contents, scope, locals, target) {
      this.scope = scope;
      this.locals = locals;

      var parent = new Element(target, scope, locals);
      parent.initialize();

      parent.inflateChildren(contents);
   }

   static inflate(contents, scope, local, target) {
      var universe = new Universe(contents, scope, local, target);
      return universe;
   }

}

export Universe;
