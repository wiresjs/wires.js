"use realm";

import lodash as _ from utils;

class NumType {
   constructor(types) {
      this.types = types;
      this.inverted = _.invert(types)
   }
   pack(str) {
      return this.types[str] || 0;
   }
   unpack(num) {
      return this.inverted[num];
   }
}
class TagTypes extends NumType {
   constructor() {
      super({
         tag: 0,
         text: 1,
         directive: 2,
         include: 3
      });
   }
}

var tags = new TagTypes();

class Packer {
   // Packing readable format into unreadable
   static pack(opts) {
      opts = opts || {};
      var type = opts.type;
      var name = opts.name
      var requires = opts.requires;
      var attrs = [];
      var children = opts.children || [];
      _.each(opts.attrs, function(item, key) {
         let attr = [key, item.value];
         if (item.requires) {
            attr.push(item.requires);
         }
         attrs.push(attr);
      });
      if (type === "text") {
         return [tags.pack(type), opts.text]
      }

      var data = [tags.pack(type), requires || 0, name, attrs];
      if (children) {
         data.push(children)
      }
      return data;
   }

   // Unpacking
   static unpack(item) {
      var type = tags.unpack(item[0])
      if (type === "text") {
         return {
            type: 'text',
            text: item[1]
         }
      }

      var _attrs = item[3];

      var attrs = [];
      _.each(_attrs, function(attr) {
         var a = {
            name: attr[0],
            value: attr[1]
         };
         if (attr[2]) {
            a.requires = attr[2];
         }
         attrs.push(a)
      });
      var data = {
         type: type,
         name: item[2],
         attrs: attrs,
         children: item[4] || []
      }
      if (item[1]) {
         data.requires = item[1]
      }
      return data;
   }
}

export Packer;
