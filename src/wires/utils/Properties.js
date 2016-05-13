"use realm";

class Properties {
   static defineHidden(obj, key, value) {
      Object.defineProperty(obj, key, {
         enumerable: false,
         value: value
      });
      return obj;
   }
}

export Properties;
