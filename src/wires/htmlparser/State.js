"use realm";

class State {
   constructor() {
      this.$states = new Set();
   }

   /**
    * set - description
    *
    * @return {type}  description
    */
   set() {
      for (var i = 0; i < arguments.length; i++) {
         var name = arguments[i];
         if (!this.$states.has(name)) {
            this.$states.add(name)
         }
      }
   }

   /**
    * clean - description
    *
    * @return {type}  description
    */
   clean() {
      for (var i = 0; i < arguments.length; i++) {
         var name = arguments[i];
         this.$states.delete(name);
      }
   }

   /**
    * has - description
    *
    * @param  {type} name description
    * @return {type}      description
    */
   has(name) {
      return this.$states.has(name);
   }

   /**
    * once - description
    *
    * @param  {type} name description
    * @return {type}      description
    */
   once(name) {
      var valid = this.$states.has(name);
      if (valid) {
         this.$states.delete(name)
      }
      return valid;
   }

   /**
    * unset - description
    *
    * @return {type}  description
    */
   unset() {
      for (var i = 0; i < arguments.length; i++) {
         var name = arguments[i];
         this.$states.delete(name);
      }
   }
}
export State;
