"use realm";

class Tag {
   constructor(parent) {
      this.parent = parent;
      this.name;
      this.children = [];
      this.raw = ""
   }

   /**
    * addTag - adds a "Tag" instance to children
    *
    * @param  {type} tag description
    * @return {type}     description
    */
   addTag(tag) {
      this.children.push(tag);
   }

   /**
    * addText - adds "text" instance to children
    *
    * @param  {type} text description
    * @return {type}      description
    */
   addText(text) {
      this.children.push(text);
   }

   /**
    * parse - accepts characters   
    *
    * @param  {type} s description
    * @return {type}   description
    */
   parse(s) {
      this.raw += s;
   }
}

export Tag;
