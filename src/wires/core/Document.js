module wires.core.Document;

var cheerio

if (isNode) {
   cheerio = require("cheerio");
}

class Element {
   append() {}
   addClass(clsName) {}
   removeClass() {}
}
class TextNode {
   setValue() {}
}
class BackendTextNode {
   constructor(text) {
      cheerio(text);
   }
}

class BackendElement extends Element {
   constructor(name) {
      super();

      this.el = cheerio('<' + name + '><' + name + '>');
   }
   append(element) {
      this.el.append(element);
   }
}

class NativeElement extends Element {
   constructor(name) {
      super();
      this.el = document.createElement(name);
   }
   append(element) {
      this.el.appendChild(element);
   }
}

class WiresDocument {
   createElement(name) {
      return new BackendElement(name);
   }
   createTextNode(text) {
      return window.document.createTextNode(text);
   }
}

class BackendDocument extends WiresDocument {
   createElement(name) {
      return new NativeElement(name);
   }
   createTextNode(text) {
      return cheerio(text);
   }
}
class NativeDocument extends WiresDocument {
   createElement(name) {
      return document.createElement(name);
   }
   createTextNode(text) {
      return document.createTextNode(text);
   }
}

export isNode ? BackendDocument : NativeDocument;
