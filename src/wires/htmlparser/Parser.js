"use realm";

import lodash as _ from utils;
import TagAnalyzer, Tag, Text from wires.htmlparser;

class Parser {

   /**
    * parse  parses html into an object with "root" and children
    *
    *    <div id="test">hello <s>my</s> world</div>'
    *
    * will give a structure
    *    Tag (test)
    *       children:
    *          Text "hello "
    *          Tag (s)
    *             children:
    *                Text "my"
    *          Text " world"
    * @param  {type} html description
    * @return {type}      description
    */
   static parse(html) {
      var analyzer = new TagAnalyzer();
      var root = new Tag();
      var text;
      for (var i = 0; i < html.length; i++) {
         var symbol = html[i];
         analyzer.analyze(symbol);
         if (analyzer.isCreated()) {
            var tag = new Tag(root);
            tag.parse(symbol);
            root.addTag(tag);
            root = tag;
         } else if (analyzer.isOpened()) {
            root.parse(symbol);
         } else if (analyzer.isClosed()) {
            root = root.parent;
         } else if (analyzer.isText()) {
            text = text || '';
            text += symbol;
         } else if (analyzer.isTextEnd()) {
            root.addText(new Text(text))
            text = undefined;
         }
      }
      console.log(root)
   }
}

export Parser;
