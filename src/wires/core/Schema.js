module wires.core.Schema;

import Packer from wires.compiler;
import lodash as _ from utils;

class Schema {
   constructor(json) {
      this.json = json;
      var data = Packer.unpack(json);
      var self = this;
      _.each(data, function(value, key) {
         self[key] = value;
      });
   }

   detachAttribute(name) {
      _.remove(this.attrs, function(attrs) {
         return attrs.name === name
      });
   }

   clone() {
      return new Schema(this.json);
   }
}

export Schema;
