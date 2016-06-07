"use realm";
import AttributeAnalyzer from wires.htmlparser;
import lodash as _ from utils;
class Tag {
   constructor(parent) {
      this.parent = parent;
      this.name = '';
      this.children = [];
      this.attrs = []

      this.raw = ""

   }
   addAttribute() {
      this.attrs.push(['', ''])
   }
   add2AttributeName(s) {
      var latest = this.attrs.length - 1
      this.attrs[latest][0] += s;
   }
   add2AttributeValue(s) {
      var latest = this.attrs.length - 1
      this.attrs[latest][1] += s;
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

   consume(tagAnalyzer) {
      var analyzer = new AttributeAnalyzer();
      for (var i = 0; i < this.raw.length; i++) {
         var symbol = this.raw[i];

         var state = analyzer.analyze(symbol);
         if (state.consumeName()) {
            this.name += symbol;
         }

         // attribute names
         if (state.startAttrName()) {
            this.addAttribute();
         }
         if (state.consumeAttrName()) {
            this.add2AttributeName(symbol);
         }

         if (state.consumeAttrValue()) {
            this.add2AttributeValue(symbol);
         }
      }

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
