"use realm";

import lodash as _ from utils;
import TagAnalyzer, Tag, Text from wires.htmlparser;

const AUTO_CLOSED_TAGS = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]
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
   static parse(html, json) {

      var analyzer = new TagAnalyzer();
      var root = new Tag();
      var text;

      for (var i = 0; i < html.length; i++) {
         var symbol = html[i];
         var last = i === html.length - 1;
         analyzer.analyze(symbol, last);

         if (analyzer.isCreated()) {
            var tag = new Tag(root);
            tag.parse(symbol);
            root.addTag(tag);
            root = tag;
         } else if (analyzer.isOpened()) {
            root.parse(symbol);
         } else if (analyzer.isClosed()) {
            if (!root.consumed) {
               root.consume(analyzer);
            }
            if (root.name) {
               root = root.parent;
            }
         } else if (analyzer.isConsumed()) {
            root.consume(analyzer);
            root.consumed = true;
            if (_.indexOf(AUTO_CLOSED_TAGS, root.name) > -1) {
               root.autoClosed = true;
               root = root.parent;
            }
         } else if (analyzer.isText()) {
            text = text || '';
            text += symbol;
            if (last && root) {
               root.addText(new Text(text))
            }
         } else if (analyzer.isTextEnd()) {
            if (root) {
               root.addText(new Text(text))
            }
            text = undefined;
         }
      }
      return root ? json ? Parser.toJSON(root.children) : root.children : []
   }

   static toJSON(data) {
      var items = [];
      _.each(data, function(item) {
         var obj = {};
         var isTag = item instanceof Tag;
         obj.type = isTag ? "tag" : 'text';
         var attrs = {};
         _.each(item.attrs, function(item) {
            attrs[item[0]] = item[1];
         });
         if (_.keys(attrs).length) {
            obj.attrs = attrs;
         }
         if (item.str) {
            obj.value = item.str;
         }
         if (item.name) {
            obj.name = item.name;
         }
         if (item.children && item.children.length) {
            obj.children = Parser.toJSON(item.children);
         }
         if (isTag || !isTag && obj.value) {
            items.push(obj);
         }
      });
      return items;
   }
}

export Parser;
