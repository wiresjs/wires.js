(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("wires.Router",["utils.lodash"],function(_){ var $_exports;

class Router {
   constructor(config) {
      this.package = config.package || '';
   }

   getURLSnippets() {
      var data = window.location.pathname.split("/");
      data = data.splice(1, data.length);
      if (data.length === 1) {
         return [];
      }
      return data;
   }

   /**
    * root - description
    *
    * @param  {type} data   description
    * @param  {type} states description
    * @return {type}        description
    */
   root(data, states) {
      this.root = this.state("/", data, states);
      return this;
   }

   /**
    * state - description
    *
    * @param  {type} path   description
    * @param  {type} data   description
    * @param  {type} states description
    * @return {type}        description
    */
   state(path, data, states) {
      let arr = data.split(/\s+->\s+/);
      let ctrl = arr[0];

      ctrl = (this.package ? this.package + "." : '') + ctrl;

      let view = arr[1];
      return {
         ctrl: ctrl,
         view: view,
         path: path,
         states: states
      }
   }

   start() {
      var url = this.getURLSnippets();
      console.log(url)
      console.log(this.root);
   }
}


$_exports = Router;

return $_exports;
});
realm.module("utils.lodash", function() {
   return $isBackend ? require("lodash") : window._;
});

realm.module("utils.Promise", function() {
   return $isBackend ? Promise : window.Promise;
});
var nodeAsyncLib = $isBackend ? require("async-watch") : undefined;

realm.module("wires.AsyncWatch", function() {
   return $isBackend ? nodeAsyncLib.AsyncWatch : window.AsyncWatch;
});

realm.module("realm", function() {
   return realm;
});

realm.module("nodejs.utils.stream", function() {
   return $isBackend ? require("event-stream") : {}
})
realm.module("nodejs.utils.fs", function() {
   return $isBackend ? require("fs") : {};
});
realm.module("nodejs.utils.walk", function() {
   return $isBackend ? require("walk") : {};
});
realm.module("nodejs.utils.path", function() {
   return $isBackend ? require("path") : {};
});

realm.module("AsyncTransaction", function() {
   return $isBackend ? nodeAsyncLib.AsyncTransaction : window.AsyncTransaction;
});

realm.module("wires.utils.DotNotation",["wires.AsyncWatch"],function(AsyncWatch){ var $_exports;


var DotNotation = {
   nextTick: function(cb) {
      return isNode ? process.nextTick(cb) : window.requestAnimationFrame(cb);
   },
   dotNotation: function(path) {
      if (path instanceof Array) {
         return {
            path: path,
            str: path.join('.')
         }
      }
      if (typeof path !== 'string') {
         return;
      }
      return {
         path: path.split('\.'),
         str: path
      }
   },
   hasProperty: function(obj, path) {
      if (path && path.length === 0 || obj === undefined) {
         return false;
      }
      var notation = this.dotNotation(path);
      if (!notation) {
         return false;
      }
      path = notation.path;
      var validNext = true;
      for (var i = 0; i < path.length; i++) {
         if (validNext && obj.hasOwnProperty(path[i])) {
            obj = obj[path[i]];
            if (obj === undefined) {
               validNext = false;
            }
         } else {
            return false;
         }
      }
      return true;
   },
   getPropertyValue: function(obj, path) {

      if (path.length === 0 || obj === undefined) {
         return undefined;
      }
      var notation = this.dotNotation(path);
      if (!notation) {
         return;
      }
      path = notation.path;
      for (var i = 0; i < path.length; i++) {
         obj = obj[path[i]];
         if (obj === undefined) {
            return undefined;
         }
      }
      return obj;
   }
}

$_exports = DotNotation;

return $_exports;
});
realm.module("wires.utils.Properties",[],function(){ var $_exports;

class Properties {
   static defineHidden(obj, key, value) {
      Object.defineProperty(obj, key, {
         enumerable: false,
         value: value
      });
      return obj;
   }
}


$_exports = Properties;

return $_exports;
});
realm.module("wires.services.Watch",["wires.expressions.AngularExpressions", "wires.expressions.WatchBatch", "utils.lodash"],function(AngularExpressions, WatchBatch, _){ var $_exports;



var Watch = (o, expression, fn, instant) => {
   var scope = o.scope || {};
   var locals = o.locals || {};
   var variables = AngularExpressions.extract(expression);
   var model = AngularExpressions.compile(expression);
   var oldValue;
   if (instant) {
      oldValue = model(scope, locals);
      fn(oldValue, undefined, {});
   }

   return WatchBatch({
      locals: locals,
      scope: scope,
      batch: variables
   }, function(changes) {
      var result = model(scope, locals);

      fn(result, oldValue, changes);
      oldValue = result;
   });
}

$_exports = Watch;

return $_exports;
});
realm.module("wires.runtime.Directives",["realm"],function(realm){ var $_exports;



$_exports = realm.requirePackage('wires.directives');

return $_exports;
});
realm.module("wires.runtime.Schema",["utils.lodash"],function(_){ var $_exports;

var data = {};


$_exports = realm.requirePackage('wires.schema').then(function(items) {
   var schemas = {};

   _.each(items, function(packg) {
      schemas = _.merge(schemas, packg);
   });
   return schemas;
});

return $_exports;
});
realm.module("wires.htmlparser.AttributeAnalyzer",["wires.htmlparser.State"],function(State){ var $_exports;

var s = 0;
const NAME_PENDING = (s++).toString();
const NAME_CONSUMING = (s++).toString();
const NAME_CLOSED = (s++).toString();
const ATTR_NAME_PENDING = (s++).toString();
const ATTR_NAME_STARTED = (s++).toString();
const ATTR_NAME_CONSUMING = (s++).toString();
const ATTR_NAME_CLOSED = (s++).toString();
const ATTR_VALUE_PENDING = (s++).toString();
const ATTR_VALUE_MIGHT_START = (s++).toString();
const ATTR_VALUE_STARTING = (s++).toString();
const ATTR_VALUE_CONSUMING = (s++).toString();
const ATTR_VALUE_PAUSED = (s++).toString();
const ATTR_VALUE_CLOSED = (s++).toString();

const ATTR_CLOSED = (s++).toString();

class AttributeAnalyzer {
   constructor() {
      this.state = new State();
      this.state.set(NAME_PENDING);
   }

   consumeName() {
      return this.state.has(NAME_CONSUMING);
   }

   closeName() {
      return this.state.has(NAME_CLOSED);
   }

   startAttrName() {
      return this.state.has(ATTR_NAME_STARTED);
   }

   consumeAttrName() {
      return this.state.has(ATTR_NAME_CONSUMING);
   }

   closeAttrName() {
      return this.state.has(ATTR_NAME_CLOSED);
   }

   consumeAttrValue() {
      return this.state.has(ATTR_VALUE_CONSUMING);
   }
   closeAttrValue() {
      return this.state.has(ATTR_VALUE_CONSUMING);
   }

   analyze(i) {
      var state = this.state;
      state.clean(NAME_CLOSED, ATTR_NAME_STARTED, ATTR_NAME_CLOSED);

      if (i === undefined) {
         return this;
      }
      if (state.has(ATTR_VALUE_CONSUMING)) {
         if (i === "\\") {

            state.unset(ATTR_VALUE_CONSUMING)
            state.set(ATTR_VALUE_PAUSED)
         }
         if (i === this.quote) {
            state.unset(ATTR_VALUE_CONSUMING)
            state.set(ATTR_VALUE_CLOSED, ATTR_NAME_PENDING)
         }
      }
      if (state.has(ATTR_VALUE_PAUSED)) {
         if (i === this.quote) {
            state.unset(ATTR_VALUE_PAUSED)
            state.set(ATTR_VALUE_CONSUMING)
         }
      }

      if (state.has(ATTR_VALUE_STARTING)) {

         state.unset(ATTR_VALUE_STARTING);

         state.set(ATTR_VALUE_CONSUMING)
      }

      if (state.has(ATTR_VALUE_PENDING)) {

         if (!i.match(/[=\s"']/)) {
            state.unset(ATTR_VALUE_PENDING, ATTR_VALUE_MIGHT_START);
            state.set(ATTR_NAME_PENDING)
         } else {
            if (state.has(ATTR_VALUE_MIGHT_START)) {
               if (i === "'" || i === '"') {

                  this.quote = i;
                  state.unset(ATTR_VALUE_PENDING, ATTR_VALUE_MIGHT_START);

                  state.set(ATTR_VALUE_STARTING)
               }
            }
            if (i === "=") {
               state.set(ATTR_VALUE_MIGHT_START);
            }
         }

      }

      if (state.has(ATTR_NAME_CONSUMING)) {
         if (!i.match(/[a-z0-9_-]/)) {
            state.unset(ATTR_NAME_CONSUMING);
            state.set(ATTR_NAME_CLOSED, ATTR_VALUE_PENDING)
            if (i === "=") {
               state.set(ATTR_VALUE_MIGHT_START);
            }
         }
      }

      // starting attribute NAME
      if (state.has(ATTR_NAME_PENDING)) {
         if (i.match(/[a-z0-9_-]/)) {
            state.unset(ATTR_NAME_PENDING);

            state.set(ATTR_NAME_STARTED, ATTR_NAME_CONSUMING)
         }
      }

      if (state.has(NAME_PENDING)) {
         if (i.match(/[a-z0-9_-]/)) {
            state.unset(NAME_PENDING);
            state.set(NAME_CONSUMING)
         }
      }
      if (state.has(NAME_CONSUMING)) {
         if (!i.match(/[a-z0-9_-]/)) {
            state.unset(NAME_CONSUMING);
            state.set(NAME_CLOSED)
            state.set(ATTR_NAME_PENDING)
         }
      }
      this.prev = i;

      return this;

   }
}

$_exports = AttributeAnalyzer;

return $_exports;
});
realm.module("wires.htmlparser.Parser",["utils.lodash", "wires.htmlparser.TagAnalyzer", "wires.htmlparser.Tag", "wires.htmlparser.Text"],function(_, TagAnalyzer, Tag, Text){ var $_exports;


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


$_exports = Parser;

return $_exports;
});
realm.module("wires.htmlparser.State",[],function(){ var $_exports;

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

$_exports = State;

return $_exports;
});
realm.module("wires.htmlparser.Tag",["wires.htmlparser.AttributeAnalyzer", "utils.lodash"],function(AttributeAnalyzer, _){ var $_exports;
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


$_exports = Tag;

return $_exports;
});
realm.module("wires.htmlparser.TagAnalyzer",["wires.htmlparser.State"],function(State){ var $_exports;


const TAG_OPENED = "1";
const TAG_CLOSING = "2";
const TAG_CLOSED = "3";
const TAG_CREATED = "4";
const TAG_OPENING = "5";
const TAG_TEXT_OPENING = "6";
const TAG_TEXT = "7";
const TAG_TEXT_END = "8";
const TAG_CONSUMED = "9";

class TagAnalyzer {
   constructor() {
      this.state = new State();
   }

   /**
    * isCreated - returns true or false based on it tag has been just created
    * Triggers only once
    *
    * @return {type}  description
    */
   isCreated() {
      return this.state.has(TAG_CREATED);
   }

   /**
    * isOpened - if a tag has been opened (meaning that everything beetween <> will get there)
    *
    * @return {type}  description
    */
   isOpened() {
      return this.state.has(TAG_OPENED);
   }

   /**
    * isClosed - when a tag is closed
    *
    * @return {type}  description
    */
   isClosed() {
      return this.state.has(TAG_CLOSED);
   }

   /**
    * isText - if text can be consumed
    *
    * @return {type}  description
    */
   isText() {
      return this.state.has(TAG_TEXT);
   }

   isConsumed() {
      return this.state.has(TAG_CONSUMED);
   }

   /**
    * isTextEnd - when text consuming should be ended
    *
    * @return {type}  description
    */
   isTextEnd() {
      return this.state.has(TAG_TEXT_END);
   }

   closeTag() {
      this.state.unset(TAG_OPENING, TAG_OPENED, TAG_OPENED);
      this.state.set(TAG_CONSUMED);
   }

   /**
    * analyze - analyzer, set states based on known/existing states
    *
    *
    * @param  {type} i description
    * @return {type}   description
    */
   analyze(i, last) {
      var state = this.state;
      // if (last) {
      //    if (state.has(TAG_OPENED)) {
      //       state.unset(TAG_OPENED)
      //       state.set(TAG_CLOSED)
      //    }
      //    if (state.has(TAG_TEXT)) {
      //       state.set(TAG_TEXT_END)
      //    }
      //    return this;;
      // }
      if (state.has(TAG_TEXT_OPENING)) {
         state.set(TAG_TEXT);
      }
      state.clean(TAG_CLOSED, TAG_TEXT_END, TAG_TEXT_OPENING, TAG_CONSUMED);

      if (i === "/" && state.has(TAG_OPENING)) {
         state.set(TAG_CLOSING);
         state.unset(TAG_OPENING, TAG_OPENED)
      }

      if (state.has(TAG_CREATED)) {
         state.unset(TAG_CREATED);
         state.set(TAG_OPENED);
      }
      if (state.has(TAG_OPENING)) {
         state.set(TAG_CREATED)
         state.unset(TAG_OPENING);
      }
      if (i === "<") {
         if (!state.has(TAG_OPENED)) {
            state.set(TAG_OPENING);
         }
         if (state.has(TAG_TEXT)) {
            state.set(TAG_TEXT_END);
         }
         state.unset(TAG_TEXT, TAG_TEXT_OPENING);
      }

      if (i === ">") {
         state.set(TAG_TEXT_OPENING);
         if (state.once(TAG_CLOSING)) {
            state.unset(TAG_OPENED);
            return state.set(TAG_CLOSED)
         } else {
            state.set(TAG_CONSUMED)
         }
         if (state.has(TAG_OPENED)) {
            state.unset(TAG_OPENED)
         }
      }
   }
}

$_exports = TagAnalyzer;

return $_exports;
});
realm.module("wires.htmlparser.Text",[],function(){ var $_exports;

/**
 * Just Text
 */
class Text {
   constructor(str) {
      this.str = str;
   }
   closed() {

   }
}


$_exports = Text;

return $_exports;
});
realm.module("wires.expressions.AngularExpressionParser",[],function(){ var $_exports;

// We don't want to lint angular's code...
/* eslint-disable */

// Angular environment stuff
// ------------------------------
function noop() {}

// Simplified extend() for our use-case
function extend(dst, obj) {
   var key;

   for (key in obj) {
      if (obj.hasOwnProperty(key)) {
         dst[key] = obj[key];
      }
   }

   return dst;
}

function isDefined(value) {
   return typeof value !== 'undefined';
}

function valueFn(value) {
   return function() {
      return value;
   };
}

function $parseMinErr(module, message, arg1, arg2, arg3) {
   var args = arguments;

   message = message.replace(/{(\d)}/g, function(match) {
      return args[2 + parseInt(match[1])];
   });

   throw new SyntaxError(message);
}

function lowercase(string) {
   return typeof string === "string" ? string.toLowerCase() : string;
}

// Simplified forEach() for our use-case
function forEach(arr, iterator) {
   arr.forEach(iterator);
}

// Sandboxing Angular Expressions
// ------------------------------
// Angular expressions are generally considered safe because these expressions only have direct
// access to $scope and locals. However, one can obtain the ability to execute arbitrary JS code by
// obtaining a reference to native JS functions such as the Function constructor.
//
// As an example, consider the following Angular expression:
//
//   {}.toString.constructor(alert("evil JS code"))
//
// We want to prevent this type of access. For the sake of performance, during the lexing phase we
// disallow any "dotted" access to any member named "constructor".
//
// For reflective calls (a[b]) we check that the value of the lookup is not the Function constructor
// while evaluating the expression, which is a stronger but more expensive test. Since reflective
// calls are expensive anyway, this is not such a big deal compared to static dereferencing.
//
// This sandboxing technique is not perfect and doesn't aim to be. The goal is to prevent exploits
// against the expression language, but not to prevent exploits that were enabled by exposing
// sensitive JavaScript or browser apis on Scope. Exposing such objects on a Scope is never a good
// practice and therefore we are not even trying to protect against interaction with an object
// explicitly exposed in this way.
//
// A developer could foil the name check by aliasing the Function constructor under a different
// name on the scope.
//
// In general, it is not possible to access a Window object from an angular expression unless a
// window or some DOM object that has a reference to window is published onto a Scope.

function ensureSafeMemberName(name, fullExpression) {
   if (name === "constructor") {
      throw $parseMinErr('isecfld',
         'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}',
         fullExpression);
   }
   return name;
}

function ensureSafeObject(obj, fullExpression) {
   // nifty check if obj is Function that is fast and works across iframes and other contexts
   if (obj) {
      if (obj.constructor === obj) {
         throw $parseMinErr('isecfn',
            'Referencing Function in Angular expressions is disallowed! Expression: {0}',
            fullExpression);
      } else if ( // isWindow(obj)
         obj.document && obj.location && obj.alert && obj.setInterval) {
         throw $parseMinErr('isecwindow',
            'Referencing the Window in Angular expressions is disallowed! Expression: {0}',
            fullExpression);
      } else if ( // isElement(obj)
         obj.children && (obj.nodeName || (obj.prop && obj.attr && obj.find))) {
         throw $parseMinErr('isecdom',
            'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}',
            fullExpression);
      }
   }
   return obj;
}

var OPERATORS = {
   /* jshint bitwise : false */
   'null': function() {
      return null;
   },
   'true': function() {
      return true;
   },
   'false': function() {
      return false;
   },
   undefined: noop,
   '+': function(self, locals, a, b) {
      a = a(self, locals);
      b = b(self, locals);
      if (isDefined(a)) {
         if (isDefined(b)) {
            return a + b;
         }
         return a;
      }
      return isDefined(b) ? b : undefined;
   },
   '-': function(self, locals, a, b) {
      a = a(self, locals);
      b = b(self, locals);
      return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
   },
   '*': function(self, locals, a, b) {
      return a(self, locals) * b(self, locals);
   },
   '/': function(self, locals, a, b) {
      return a(self, locals) / b(self, locals);
   },
   '%': function(self, locals, a, b) {
      return a(self, locals) % b(self, locals);
   },
   '^': function(self, locals, a, b) {
      return a(self, locals) ^ b(self, locals);
   },
   '=': noop,
   '===': function(self, locals, a, b) {
      return a(self, locals) === b(self, locals);
   },
   '!==': function(self, locals, a, b) {
      return a(self, locals) !== b(self, locals);
   },
   '==': function(self, locals, a, b) {
      return a(self, locals) == b(self, locals);
   },
   '!=': function(self, locals, a, b) {
      return a(self, locals) != b(self, locals);
   },
   '<': function(self, locals, a, b) {
      return a(self, locals) < b(self, locals);
   },
   '>': function(self, locals, a, b) {
      return a(self, locals) > b(self, locals);
   },
   '<=': function(self, locals, a, b) {
      return a(self, locals) <= b(self, locals);
   },
   '>=': function(self, locals, a, b) {
      return a(self, locals) >= b(self, locals);
   },
   '&&': function(self, locals, a, b) {
      return a(self, locals) && b(self, locals);
   },
   '||': function(self, locals, a, b) {
      return a(self, locals) || b(self, locals);
   },
   '&': function(self, locals, a, b) {
      return a(self, locals) & b(self, locals);
   },
   //    '|':function(self, locals, a,b){return a|b;},
   '|': function(self, locals, a, b) {
      return b(self, locals)(self, locals, a(self, locals));
   },
   '!': function(self, locals, a) {
      return !a(self, locals);
   }
};
/* jshint bitwise: true */
var ESCAPE = {
   "n": "\n",
   "f": "\f",
   "r": "\r",
   "t": "\t",
   "v": "\v",
   "'": "'",
   '"': '"'
};

/////////////////////////////////////////

/**
 * @constructor
 */
var Lexer = function(options) {
   this.options = options;
};

Lexer.prototype = {
   constructor: Lexer,

   lex: function(text) {
      this.text = text;

      this.index = 0;
      this.ch = undefined;
      this.lastCh = ':'; // can start regexp

      this.tokens = [];

      var token;
      var json = [];

      while (this.index < this.text.length) {
         this.ch = this.text.charAt(this.index);
         if (this.is('"\'')) {
            this.readString(this.ch);
         } else if (this.isNumber(this.ch) || this.is('.') && this.isNumber(this.peek())) {
            this.readNumber();
         } else if (this.isIdent(this.ch)) {
            this.readIdent();
            // identifiers can only be if the preceding char was a { or ,
            if (this.was('{,') && json[0] === '{' &&
               (token = this.tokens[this.tokens.length - 1])) {
               token.json = token.text.indexOf('.') === -1;
            }
         } else if (this.is('(){}[].,;:?')) {
            this.tokens.push({
               index: this.index,
               text: this.ch,
               json: (this.was(':[,') && this.is('{[')) || this.is('}]:,')
            });
            if (this.is('{[')) json.unshift(this.ch);
            if (this.is('}]')) json.shift();
            this.index++;
         } else if (this.isWhitespace(this.ch)) {
            this.index++;
            continue;
         } else {
            var ch2 = this.ch + this.peek();
            var ch3 = ch2 + this.peek(2);
            var fn = OPERATORS[this.ch];
            var fn2 = OPERATORS[ch2];
            var fn3 = OPERATORS[ch3];
            if (fn3) {
               this.tokens.push({
                  index: this.index,
                  text: ch3,
                  fn: fn3
               });
               this.index += 3;
            } else if (fn2) {
               this.tokens.push({
                  index: this.index,
                  text: ch2,
                  fn: fn2
               });
               this.index += 2;
            } else if (fn) {
               this.tokens.push({
                  index: this.index,
                  text: this.ch,
                  fn: fn,
                  json: (this.was('[,:') && this.is('+-'))
               });
               this.index += 1;
            } else {
               this.throwError('Unexpected next character ', this.index, this.index + 1);
            }
         }
         this.lastCh = this.ch;
      }
      return this.tokens;
   },

   is: function(chars) {
      return chars.indexOf(this.ch) !== -1;
   },

   was: function(chars) {
      return chars.indexOf(this.lastCh) !== -1;
   },

   peek: function(i) {
      var num = i || 1;
      return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
   },

   isNumber: function(ch) {
      return ('0' <= ch && ch <= '9');
   },

   isWhitespace: function(ch) {
      // IE treats non-breaking space as \u00A0
      return (ch === ' ' || ch === '\r' || ch === '\t' ||
         ch === '\n' || ch === '\v' || ch === '\u00A0');
   },

   isIdent: function(ch) {
      return ('a' <= ch && ch <= 'z' ||
         'A' <= ch && ch <= 'Z' ||
         '_' === ch || ch === '$');
   },

   isExpOperator: function(ch) {
      return (ch === '-' || ch === '+' || this.isNumber(ch));
   },

   throwError: function(error, start, end) {
      end = end || this.index;
      var colStr = (isDefined(start) ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']' : ' ' + end);
      throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].',
         error, colStr, this.text);
   },

   readNumber: function() {
      var number = '';
      var start = this.index;
      while (this.index < this.text.length) {
         var ch = lowercase(this.text.charAt(this.index));
         if (ch == '.' || this.isNumber(ch)) {
            number += ch;
         } else {
            var peekCh = this.peek();
            if (ch == 'e' && this.isExpOperator(peekCh)) {
               number += ch;
            } else if (this.isExpOperator(ch) &&
               peekCh && this.isNumber(peekCh) &&
               number.charAt(number.length - 1) == 'e') {
               number += ch;
            } else if (this.isExpOperator(ch) &&
               (!peekCh || !this.isNumber(peekCh)) &&
               number.charAt(number.length - 1) == 'e') {
               this.throwError('Invalid exponent');
            } else {
               break;
            }
         }
         this.index++;
      }
      number = 1 * number;
      this.tokens.push({
         index: start,
         text: number,
         json: true,
         fn: function() {
            return number;
         }
      });
   },

   readIdent: function() {
      var parser = this;

      var ident = '';
      var start = this.index;

      var lastDot, peekIndex, methodName, ch;

      while (this.index < this.text.length) {
         ch = this.text.charAt(this.index);
         if (ch === '.' || this.isIdent(ch) || this.isNumber(ch)) {
            if (ch === '.') lastDot = this.index;
            ident += ch;
         } else {
            break;
         }
         this.index++;
      }

      //check if this is not a method invocation and if it is back out to last dot
      if (lastDot) {
         peekIndex = this.index;
         while (peekIndex < this.text.length) {
            ch = this.text.charAt(peekIndex);
            if (ch === '(') {
               methodName = ident.substr(lastDot - start + 1);
               ident = ident.substr(0, lastDot - start);
               this.index = peekIndex;
               break;
            }
            if (this.isWhitespace(ch)) {
               peekIndex++;
            } else {
               break;
            }
         }
      }

      var token = {
         index: start,
         text: ident
      };

      // OPERATORS is our own object so we don't need to use special hasOwnPropertyFn
      if (OPERATORS.hasOwnProperty(ident)) {
         token.fn = OPERATORS[ident];
         token.json = OPERATORS[ident];
      } else {
         var getter = getterFn(ident, this.options, this.text);
         token.fn = extend(function(self, locals) {
            return (getter(self, locals));
         }, {
            assign: function(self, value) {
               return setter(self, ident, value, parser.text, parser.options);
            }
         });
      }

      this.tokens.push(token);

      if (methodName) {
         this.tokens.push({
            index: lastDot,
            text: '.',
            json: false
         });
         this.tokens.push({
            index: lastDot + 1,
            text: methodName,
            json: false
         });
      }
   },

   readString: function(quote) {
      var start = this.index;
      this.index++;
      var string = '';
      var rawString = quote;
      var escape = false;
      while (this.index < this.text.length) {
         var ch = this.text.charAt(this.index);
         rawString += ch;
         if (escape) {
            if (ch === 'u') {
               var hex = this.text.substring(this.index + 1, this.index + 5);
               if (!hex.match(/[\da-f]{4}/i))
                  this.throwError('Invalid unicode escape [\\u' + hex + ']');
               this.index += 4;
               string += String.fromCharCode(parseInt(hex, 16));
            } else {
               var rep = ESCAPE[ch];
               if (rep) {
                  string += rep;
               } else {
                  string += ch;
               }
            }
            escape = false;
         } else if (ch === '\\') {
            escape = true;
         } else if (ch === quote) {
            this.index++;
            this.tokens.push({
               index: start,
               text: rawString,
               string: string,
               json: true,
               fn: function() {
                  return string;
               }
            });
            return;
         } else {
            string += ch;
         }
         this.index++;
      }
      this.throwError('Unterminated quote', start);
   }
};

/**
 * @constructor
 */
var Parser = function(lexer, $filter, options) {
   this.lexer = lexer;
   this.$filter = $filter;
   this.options = options;
};

Parser.ZERO = function() {
   return 0;
};

Parser.prototype = {
   constructor: Parser,

   parse: function(text) {
      this.text = text;

      this.tokens = this.lexer.lex(text);

      var value = this.statements();

      if (this.tokens.length !== 0) {
         this.throwError('is an unexpected token', this.tokens[0]);
      }

      value.literal = !!value.literal;
      value.constant = !!value.constant;

      return value;
   },
   tokenize: function(text) {
      this.text = text;
      //2
      this.tokens = this.lexer.lex(text);
      return this.tokens;
   },

   primary: function() {
      var primary;
      if (this.expect('(')) {
         primary = this.filterChain();
         this.consume(')');
      } else if (this.expect('[')) {
         primary = this.arrayDeclaration();
      } else if (this.expect('{')) {
         primary = this.object();
      } else {
         var token = this.expect();
         primary = token.fn;
         if (!primary) {
            this.throwError('not a primary expression', token);
         }
         if (token.json) {
            primary.constant = true;
            primary.literal = true;
         }
      }

      var next, context;
      while ((next = this.expect('(', '[', '.'))) {
         if (next.text === '(') {
            primary = this.functionCall(primary, context);
            context = null;
         } else if (next.text === '[') {
            context = primary;
            primary = this.objectIndex(primary);
         } else if (next.text === '.') {
            context = primary;
            primary = this.fieldAccess(primary);
         } else {
            this.throwError('IMPOSSIBLE');
         }
      }
      return primary;
   },

   throwError: function(msg, token) {
      throw $parseMinErr('syntax',
         'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].',
         token.text, msg, (token.index + 1), this.text, this.text.substring(token.index));
   },

   peekToken: function() {
      if (this.tokens.length === 0)
         throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
      return this.tokens[0];
   },

   peek: function(e1, e2, e3, e4) {
      if (this.tokens.length > 0) {
         var token = this.tokens[0];
         var t = token.text;
         if (t === e1 || t === e2 || t === e3 || t === e4 ||
            (!e1 && !e2 && !e3 && !e4)) {
            return token;
         }
      }
      return false;
   },

   expect: function(e1, e2, e3, e4) {
      var token = this.peek(e1, e2, e3, e4);
      if (token) {
         this.tokens.shift();
         return token;
      }
      return false;
   },

   consume: function(e1) {
      if (!this.expect(e1)) {
         this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
      }
   },

   unaryFn: function(fn, right) {
      return extend(function(self, locals) {
         return fn(self, locals, right);
      }, {
         constant: right.constant
      });
   },

   ternaryFn: function(left, middle, right) {
      return extend(function(self, locals) {
         return left(self, locals) ? middle(self, locals) : right(self, locals);
      }, {
         constant: left.constant && middle.constant && right.constant
      });
   },

   binaryFn: function(left, fn, right) {
      return extend(function(self, locals) {
         return fn(self, locals, left, right);
      }, {
         constant: left.constant && right.constant
      });
   },

   statements: function() {
      var statements = [];
      while (true) {
         if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']')) {
            statements.push(this.filterChain());
         }
         if (!this.expect(';')) {
            // optimize for the common case where there is only one statement.
            // TODO(size): maybe we should not support multiple statements?
            return (statements.length === 1) ? statements[0] : function(self, locals) {
               var value;
               for (var i = 0; i < statements.length; i++) {
                  var statement = statements[i];

                  if (statement) {
                     value = statement(self, locals);
                  }
               }
               return value;
            };
         }
      }
   },

   filterChain: function() {
      var left = this.expression();
      var token;
      while (true) {
         if ((token = this.expect('|'))) {
            left = this.binaryFn(left, token.fn, this.filter());
         } else {
            return left;
         }
      }
   },

   filter: function() {
      var token = this.expect();
      var fn = this.$filter(token.text);
      var argsFn = [];
      while (true) {
         if ((token = this.expect(':'))) {
            argsFn.push(this.expression());
         } else {
            var fnInvoke = function(self, locals, input) {
               var args = [input];
               for (var i = 0; i < argsFn.length; i++) {
                  args.push(argsFn[i](self, locals));
               }
               return fn.apply(self, args);
            };
            return function() {
               return fnInvoke;
            };
         }
      }
   },

   expression: function() {
      return this.assignment();
   },

   assignment: function() {
      var left = this.ternary();
      var right;
      var token;
      if ((token = this.expect('='))) {
         if (!left.assign) {
            this.throwError('implies assignment but [' +
               this.text.substring(0, token.index) + '] can not be assigned to', token);
         }
         right = this.ternary();
         return function(scope, locals) {
            return left.assign(scope, right(scope, locals), locals);
         };
      }
      return left;
   },

   ternary: function() {
      var left = this.logicalOR();
      var middle;
      var token;
      if ((token = this.expect('?'))) {
         middle = this.ternary();
         if ((token = this.expect(':'))) {
            return this.ternaryFn(left, middle, this.ternary());
         } else {
            this.throwError('expected :', token);
         }
      } else {
         return left;
      }
   },

   logicalOR: function() {
      var left = this.logicalAND();
      var token;
      while (true) {
         if ((token = this.expect('||'))) {
            left = this.binaryFn(left, token.fn, this.logicalAND());
         } else {
            return left;
         }
      }
   },

   logicalAND: function() {
      var left = this.equality();
      var token;
      if ((token = this.expect('&&'))) {
         left = this.binaryFn(left, token.fn, this.logicalAND());
      }
      return left;
   },

   equality: function() {
      var left = this.relational();
      var token;
      if ((token = this.expect('==', '!=', '===', '!=='))) {
         left = this.binaryFn(left, token.fn, this.equality());
      }
      return left;
   },

   relational: function() {
      var left = this.additive();
      var token;
      if ((token = this.expect('<', '>', '<=', '>='))) {
         left = this.binaryFn(left, token.fn, this.relational());
      }
      return left;
   },

   additive: function() {
      var left = this.multiplicative();
      var token;
      while ((token = this.expect('+', '-'))) {
         left = this.binaryFn(left, token.fn, this.multiplicative());
      }
      return left;
   },

   multiplicative: function() {
      var left = this.unary();
      var token;
      while ((token = this.expect('*', '/', '%'))) {
         left = this.binaryFn(left, token.fn, this.unary());
      }
      return left;
   },

   unary: function() {
      var token;
      if (this.expect('+')) {
         return this.primary();
      } else if ((token = this.expect('-'))) {
         return this.binaryFn(Parser.ZERO, token.fn, this.unary());
      } else if ((token = this.expect('!'))) {
         return this.unaryFn(token.fn, this.unary());
      } else {
         return this.primary();
      }
   },

   fieldAccess: function(object) {
      var parser = this;
      var field = this.expect().text;
      var getter = getterFn(field, this.options, this.text);

      return extend(function(scope, locals, self) {
         return getter(self || object(scope, locals));
      }, {
         assign: function(scope, value, locals) {
            var o = object(scope, locals);
            if (!o) object.assign(scope, o = {}, locals);
            return setter(o, field, value, parser.text, parser.options);
         }
      });
   },

   objectIndex: function(obj) {
      var parser = this;

      var indexFn = this.expression();
      this.consume(']');

      return extend(function(self, locals) {
         var o = obj(self, locals),
            i = indexFn(self, locals),
            v, p;

         if (!o) return undefined;
         v = ensureSafeObject(o[i], parser.text);
         return v;
      }, {
         assign: function(self, value, locals) {
            var key = indexFn(self, locals);
            // prevent overwriting of Function.constructor which would break ensureSafeObject check
            var o = ensureSafeObject(obj(self, locals), parser.text);
            if (!o) obj.assign(self, o = [], locals);
            return o[key] = value;
         }
      });
   },

   functionCall: function(fn, contextGetter) {
      var argsFn = [];
      if (this.peekToken().text !== ')') {
         do {
            argsFn.push(this.expression());
         } while (this.expect(','));
      }
      this.consume(')');

      var parser = this;

      return function(scope, locals) {
         var args = [];
         var context = contextGetter ? contextGetter(scope, locals) : scope;

         for (var i = 0; i < argsFn.length; i++) {
            args.push(argsFn[i](scope, locals));
         }

         var fnPtr = fn(scope, locals, context) || noop;

         ensureSafeObject(context, parser.text);
         ensureSafeObject(fnPtr, parser.text);

         // IE stupidity! (IE doesn't have apply for some native functions)
         var v = fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]);

         return ensureSafeObject(v, parser.text);
      };
   },

   // This is used with json array declaration
   arrayDeclaration: function() {
      var elementFns = [];
      var allConstant = true;
      if (this.peekToken().text !== ']') {
         do {
            if (this.peek(']')) {
               // Support trailing commas per ES5.1.
               break;
            }
            var elementFn = this.expression();
            elementFns.push(elementFn);
            if (!elementFn.constant) {
               allConstant = false;
            }
         } while (this.expect(','));
      }
      this.consume(']');

      return extend(function(self, locals) {
         var array = [];
         for (var i = 0; i < elementFns.length; i++) {
            array.push(elementFns[i](self, locals));
         }
         return array;
      }, {
         literal: true,
         constant: allConstant
      });
   },

   object: function() {
      var keyValues = [];
      var allConstant = true;
      if (this.peekToken().text !== '}') {
         do {
            if (this.peek('}')) {
               // Support trailing commas per ES5.1.
               break;
            }
            var token = this.expect(),
               key = token.string || token.text;
            this.consume(':');
            var value = this.expression();
            keyValues.push({
               key: key,
               value: value
            });
            if (!value.constant) {
               allConstant = false;
            }
         } while (this.expect(','));
      }
      this.consume('}');

      return extend(function(self, locals) {
         var object = {};
         for (var i = 0; i < keyValues.length; i++) {
            var keyValue = keyValues[i];
            object[keyValue.key] = keyValue.value(self, locals);
         }
         return object;
      }, {
         literal: true,
         constant: allConstant
      });
   }
};

//////////////////////////////////////////////////
// Parser helper functions
//////////////////////////////////////////////////

function setter(obj, path, setValue, fullExp) {
   var element = path.split('.'),
      key;
   for (var i = 0; element.length > 1; i++) {
      key = ensureSafeMemberName(element.shift(), fullExp);
      var propertyObj = obj[key];
      if (!propertyObj) {
         propertyObj = {};
         obj[key] = propertyObj;
      }
      obj = propertyObj;
   }
   key = ensureSafeMemberName(element.shift(), fullExp);
   obj[key] = setValue;
   return setValue;
}

var getterFnCache = {};

/**
 * Implementation of the "Black Hole" variant from:
 * - http://jsperf.com/angularjs-parse-getter/4
 * - http://jsperf.com/path-evaluation-simplified/7
 */
function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp) {
   ensureSafeMemberName(key0, fullExp);
   ensureSafeMemberName(key1, fullExp);
   ensureSafeMemberName(key2, fullExp);
   ensureSafeMemberName(key3, fullExp);
   ensureSafeMemberName(key4, fullExp);

   return function cspSafeGetter(scope, locals) {
      var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope;

      if (pathVal == null) return pathVal;
      pathVal = pathVal[key0];

      if (!key1) return pathVal;
      if (pathVal == null) return undefined;
      pathVal = pathVal[key1];

      if (!key2) return pathVal;
      if (pathVal == null) return undefined;
      pathVal = pathVal[key2];

      if (!key3) return pathVal;
      if (pathVal == null) return undefined;
      pathVal = pathVal[key3];

      if (!key4) return pathVal;
      if (pathVal == null) return undefined;
      pathVal = pathVal[key4];

      return pathVal;
   };
}

function simpleGetterFn1(key0, fullExp) {
   ensureSafeMemberName(key0, fullExp);

   return function simpleGetterFn1(scope, locals) {
      if (scope == null) return undefined;
      return ((locals && locals.hasOwnProperty(key0)) ? locals : scope)[key0];
   };
}

function simpleGetterFn2(key0, key1, fullExp) {
   ensureSafeMemberName(key0, fullExp);
   ensureSafeMemberName(key1, fullExp);

   return function simpleGetterFn2(scope, locals) {
      if (scope == null) return undefined;
      scope = ((locals && locals.hasOwnProperty(key0)) ? locals : scope)[key0];
      return scope == null ? undefined : scope[key1];
   };
}

function getterFn(path, options, fullExp) {
   // Check whether the cache has this getter already.
   // We can use hasOwnProperty directly on the cache because we ensure,
   // see below, that the cache never stores a path called 'hasOwnProperty'
   if (getterFnCache.hasOwnProperty(path)) {
      return getterFnCache[path];
   }

   var pathKeys = path.split('.'),
      pathKeysLength = pathKeys.length,
      fn;

   // When we have only 1 or 2 tokens, use optimized special case closures.
   // http://jsperf.com/angularjs-parse-getter/6
   if (pathKeysLength === 1) {
      fn = simpleGetterFn1(pathKeys[0], fullExp);
   } else if (pathKeysLength === 2) {
      fn = simpleGetterFn2(pathKeys[0], pathKeys[1], fullExp);
   } else if (options.csp) {
      if (pathKeysLength < 6) {
         fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp,
            options);
      } else {
         fn = function(scope, locals) {
            var i = 0,
               val;
            do {
               val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++],
                  pathKeys[i++], fullExp, options)(scope, locals);

               locals = undefined; // clear after first iteration
               scope = val;
            } while (i < pathKeysLength);
            return val;
         };
      }
   } else {
      var code = 'var p;\n';
      forEach(pathKeys, function(key, index) {
         ensureSafeMemberName(key, fullExp);
         code += 'if(s == null) return undefined;\n' +
            's=' + (index
               // we simply dereference 's' on any .dot notation
               ? 's'
               // but if we are first then we check locals first, and if so read it first
               : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ';\n';
      });
      code += 'return s;';

      /* jshint -W054 */
      var evaledFnGetter = new Function('s', 'k', 'pw', code); // s=scope, k=locals, pw=promiseWarning
      /* jshint +W054 */
      evaledFnGetter.toString = valueFn(code);
      fn = evaledFnGetter;
   }

   // Only cache the value if it's not going to mess up the cache object
   // This is more performant that using Object.prototype.hasOwnProperty.call
   if (path !== 'hasOwnProperty') {
      getterFnCache[path] = fn;
   }
   return fn;
}


$_exports = {
   Lexer: Lexer,
   Parser: Parser
}

return $_exports;
});
realm.module("wires.expressions.AngularExpressions",["wires.expressions.AngularExpressionParser", "utils.lodash"],function(AngularExpressionParser, _){ var $_exports;

var parse = AngularExpressionParser;
var filters = {};
var Lexer = parse.Lexer;
var Parser = parse.Parser;
var lexer = new Lexer({});
var parser = new Parser(lexer, function getFilter(name) {
   return filters[name];
});

/**
 * Compiles src and returns a function that executes src on a target object.
 * The compiled function is cached under compile.cache[src] to speed up further calls.
 *
 * @param {string} src
 * @returns {function}
 */
function compile(src) {
   var cached;

   if (typeof src !== "string") {
      throw new TypeError("src must be a string, instead saw '" + typeof src + "'");
   }

   if (!compile.cache) {
      return parser.parse(src);
   }

   cached = compile.cache[src];

   if (!cached) {
      cached = compile.cache[src] = parser.parse(src);
   }

   return cached;
}

function extract(src) {
   if (typeof src !== "string") {
      throw new TypeError("src must be a string, instead saw '" + typeof src + "'");
   }
   var tokens = parser.tokenize(src);
   var variables = {}
   var nested = false;
   var latest;
   for (var i in tokens) {
      var item = tokens[i];

      if (_.isString(item.text) && item.text.match(/[a-z0-9\.$]+/i)) {

         if (nested) {
            if (latest) {
               if (item.string) {
                  latest.str = item.string
               } else {
                  latest.nested = {};
                  latest.nested[item.text] = {};
                  latest = latest.nested[item.text];
               }
               nested = false;
            }
         } else {
            if (!item.json) {
               latest = variables[item.text] = {};
            }

         }
      }
      if (item.text === "[") {
         nested = true;
      }
   }
   return variables;
}

/**
 * A cache containing all compiled functions. The src is used as key.
 * Set this on false to disable the cache.
 *
 * @type {object}
 */
compile.cache = {};


$_exports = {
   Lexer: Lexer,
   Parser: Parser,
   extract: extract,
   compile: compile,
   filters: filters
}

return $_exports;
});
realm.module("wires.expressions.StringInterpolation",["utils.lodash", "wires.expressions.AngularExpressions", "wires.expressions.WatchBatch", "wires.utils.DotNotation"],function(_, AngularExpressions, WatchBatch, DotNotation){ var $_exports;


var StringInterpolation = {
   /**
    * compile - Compile a string
    * var model = parser.compile('Hello {{name}}');
    * model({ name : "John" }, function(str){
    *
    * })
    *
    * @param  {type} lines string or a list of compiled statements
    * @return {type}       callback when changes are made
    */
   compile: function(lines) {
      if (!_.isArray(lines)) {
         lines = this.parse(lines);
      }
      return function(arg1, arg2, arg3, instant) {
         var $scope = arg1 || {};
         var $locals = arg3 ? arg2 : {};
         var cb = arguments.length >= 3 ? arg3 : arg2;

         var watchable = _.chain(lines).map(function(item) {
            return item.v || false;
         }).compact().value();
         if (watchable.length === 0) {
            return cb(lines.join(''));
         }
         var oldValue;
         var trigger = function() {
            var strings = _.map(lines, function(item) {
               return item.e ? AngularExpressions.compile(item.e)($scope, $locals) : item;
            });
            var value = strings.join('');
            cb(value, oldValue);
            oldValue = value;
         }
         if (instant) {
            trigger();
         }
         return WatchBatch({
            locals: $locals,
            scope: $scope,
            batch: watchable
         }, trigger);
      }
   },

   /**
    * parse - Parsing input string
    * Extrating expressions and regular string
    * "Hello {{user.name}}" will give an array
    * ['Hello', {e : 'user.name', v {}}]
    *       e - raw expression
    *       v - extracted variable names (for watchers)
    * @param  {type} str user string
    * @return {type}     Array
    */
   parse: function(str) {
      if (!_.isString(str)) {
         return [];
      }
      var re = /({{\s*[^}]+\s*}})/g;
      var list = str.split(re).map(function(x) {
         var expr;
         if ((expr = x.match(/{{\s*([^}]+)\s*}}/))) {
            var expressionString = expr[1].trim();
            return {
               e: expressionString,
               v: AngularExpressions.extract(expressionString)
            }
         }
         return x;
      });
      return _.filter(list, function(x) {
         return x ? x : undefined
      });
   }
}


$_exports = StringInterpolation;

return $_exports;
});
realm.module("wires.expressions.WatchBatch",["utils.lodash", "wires.AsyncWatch", "wires.utils.DotNotation"],function(_, AsyncWatch, DotNotation){ var $_exports;



$_exports = function(opts, cb) {
   opts = opts || {};
   var $locals = opts.locals || {};
   var $scope = opts.scope || {};

   var batch = opts.batch ? [].concat(opts.batch) : [];

   var paths = [];

   _.each(batch, function(item) {
      var key = _.keys(item)[0];
      var prop = item[key];
      paths.push(key);
   });
   var a = false;

   var anyValueChanged = function(value) {

   }

   var watchers = [];
   // collecting watchers
   _.each(paths, function(path) {

      if (DotNotation.hasProperty($locals, path)) {
         watchers.push(AsyncWatch($locals, path, anyValueChanged));
      } else {
         watchers.push(AsyncWatch($scope, path, anyValueChanged));
      }
   });
   watchers = _.compact(watchers);

   return watchers.length && cb ? AsyncWatch.subscribe(watchers, cb) : {} //

}

return $_exports;
});
realm.module("wires.directives.Click",["wires.core.Directive"],function(Directive){ var $_exports;


class Click extends Directive {
   static get compiler() {
      return {
         name: 'ng-click'
      }
   }
   initialize(attr) {

      var callback = attr.asFunction();
      var scope = this.element.scope;
      this.element.bindEvent("click", function() {
         callback.bind(scope)({
            event: event
         })
      });
   }
}


$_exports = Click;

return $_exports;
});
realm.module("wires.directives.Conditional",["wires.core.Directive"],function(Directive){ var $_exports;


class Conditional extends Directive {

   static get compiler() {
      return {
         name: 'ng-if',
         type: 'attribute',
         attribute: {
            placeholder: true
         }
      }
   }

   initialize(attr) {
      var self = this;
      var el = this.element;
      this.$initialized = false;
      attr.watchExpression((value) => {
         value ? self.createNodes() : self.removeNodes();
      }, true);
   }

   removeNodes() {
      if (this.clone) {
         this.clone.remove();
      }
   }

   createNodes() {
      var self = this;
      this.clone = this.element.clone();
      this.clone.schema.detachAttribute("ng-if");
      this.clone.create();
      this.clone.insertAfter(this.element);
      this.clone.initialize();
   }
}

$_exports = Conditional;

return $_exports;
});
realm.module("wires.directives.IncludeView",["wires.core.Directive", "wires.runtime.Schema"],function(Directive, userSchemas){ var $_exports;


class IncludeView extends Directive {
   static get compiler() {
      return {
         name: 'ng-include'
      }
   }
   initialize(attr) {

      var self = this;
      var el = this.element;
      this.inflated = false;
      this.isElementDirective = false;
      if (!attr) {
         attr = this.element.attrs["src"];
         this.isElementDirective = true;
      }
      if (!attr) {
         throw "Directive needs either src attribute or self value!";
      }
      if (attr) {
         attr.watchString((fname) => {
            if (self.inflated) {
               self.element.removeChildren()
            }
            if (userSchemas[fname]) {
               self.createSchema(userSchemas[fname])
            }
         }, true);
      }

   }
   createSchema(json) {
      this.element.inflate(json);
   }

}

$_exports = IncludeView;

return $_exports;
});
realm.module("wires.directives.Model",["wires.expressions.AngularExpressions", "wires.core.Directive"],function(AngularExpressions, Directive){ var $_exports;


class Model extends Directive {
   static get compiler() {
      return {
         name: 'ng-model'
      }
   }
   initialize(attr) {

      var el = this.element.original;
      var type = "text";
      var typeAttribute = this.element.attrs["type"];
      var selfAssign = false;
      if (typeAttribute) {
         type = typeAttribute.value[0];
      }
      if (el.nodeName.toLowerCase() === "select") {
         type = "select";
      }

      attr.watchExpression(function(value) {
         if (type === "text") {
            el.value = value;
         }
         if (type === "checkbox") {
            el.checked = value;
         }

         if (type === "select") {
            el.value = value;
         }
         if (type === "radio") {
            if (value === el.value) {
               el.checked = true;
            }
         }
      });

      // Bind events ************************
      if (type === "text") {
         this.bindEvent("keyup", function() {
            attr.assign(el.value);
         });
      }
      // checkbox
      if (type === "checkbox") {
         this.bindEvent("click", function() {
            attr.assign(el.checked);
         });
      }
      // select
      if (type === "select") {
         this.bindEvent("change", function() {
            attr.assign(el.value);
         });
      }
      if (type === "radio") {
         this.bindEvent("click", function() {
            attr.assign(el.value);
         });
      }
   }
}

$_exports = Model;

return $_exports;
});
realm.module("wires.directives.MyDirective",["wires.core.Directive"],function(Directive){ var $_exports;


class MyDirective extends Directive {
   static get compiler() {
      return {
         name: 'my-directive',
         schema: 'other/my-directive.html'
      }
   }
   initialize() {
      this.myName = "This is my name";
   }

}

$_exports = MyDirective;

return $_exports;
});
realm.module("wires.directives.Show",["wires.core.Directive"],function(Directive){ var $_exports;


class Show extends Directive {
   static get compiler() {
      return {
         name: 'ng-show'
      }
   }
   initialize() {
      var self = this;
      var el = this.element;
      var attr = el.attrs['ng-show'];

      attr.watchExpression(function(value, oldValue, changes) {
         if (value) {
            self.show();
         } else {
            self.hide();
         }
      }, true);
   }
   hide() {
      this.element.hide();
   }
   show() {
      this.element.show();
   }
}

$_exports = Show;

return $_exports;
});
realm.module("wires.directives.ToggleClass",["wires.core.Directive"],function(Directive){ var $_exports;


class ToggleClass extends Directive {
   static get compiler() {
      return {
         name: 'ng-class'
      }
   }
   constructor() {
      super();
   }
   initialize($parent, attrs) {

   }
}


$_exports = ToggleClass;

return $_exports;
});
realm.module("wires.directives.Transclude",["wires.core.Directive"],function(Directive){ var $_exports;


class Transclude extends Directive {
   static get compiler() {
      return {
         name: 'ng-transclude'
      }
   }
   initialize() {
      if (this.element.scope.$$transcluded) { // swap children to transclusion
         this.element.schema.children = this.element.scope.$$transcluded;
      }
   }
   hide() {
      this.element.hide();
   }
   show() {
      this.element.show();
   }
}

$_exports = Transclude;

return $_exports;
});
realm.module("wires.directives.WsLink",["wires.core.Directive", "wires.app.PushState"],function(Directive, PushState){ var $_exports;

//import Dispatcher as dispatcher from wires.app;

class WsLink extends Directive {
   static get compiler() {
      return {
         name: 'ws-link'
      }
   }
   initialize(attr) {
      var self = this;
      this.element.bindEvent("click", function(e) {
         e.preventDefault();
         e.stopPropagation();
         var link = self.element.attr("href");
         PushState.force({}, link);
      })
      attr.watchString(function(value) {
         self.element.attr("href", value);
      }, true);
   }

}

$_exports = WsLink;

return $_exports;
});
realm.module("wires.directives.WsRoute",["wires.core.Directive"],function(Directive){ var $_exports;

//import Dispatcher as dispatcher from wires.app;

class WsRoute extends Directive {
   static get compiler() {
      return {
         name: 'ws-route'
      }
   }
   initialize(attr) {
      var self = this;
      var route = this.element.scope;
      var $router = route.$$router;
      this.element.schema.children = [];
      if ($router && $router.dispatcher) {
         $router.dispatcher.register(this.element, route);
      }
   }

}

$_exports = WsRoute;

return $_exports;
});
realm.module("wires.core.Attribute",["wires.expressions.StringInterpolation", "wires.expressions.AngularExpressions", "wires.expressions.WatchBatch", "wires.services.Watch", "wires.core.Common"],function(StringInterpolation, AngularExpressions, WatchBatch, Watch, Common){ var $_exports;


class Attribute extends Common {
   constructor(element, name, value) {
      super();
      this.element = element;
      this.name = name;
      this.value = value;
      this.watchers = [];
      this.model;
   }
   initialize() {
      // Must ignore regular initialization if an attribute is linked to a directive
      if (this.directive) {
         return;
      }
      var original = document.createAttribute(this.name);
      this.original = original;
      this.element.original.setAttributeNode(original);
      var self = this;
      this.registerWatcher(this.watchString(function(value) {
         self.original.value = value;
      }));
   }

   assign(value) {
      if (!this.model) {
         this.model = AngularExpressions.compile(this.value);
      }
      this.model.assign(this.element.scope, value);
   }

   asFunction() {
      var compiled = AngularExpressions.compile(this.value);
      var scope = this.element.scope;
      return function(locals) {
         compiled(scope, locals)
      }
   }

   watchExpression(cb, instant) {

      var watcher = Watch({
         locals: this.element.locals,
         scope: this.element.scope
      }, this.value, function(value, oldValue, changes) {

         if (value !== oldValue || oldValue === undefined) {
            return cb(value, oldValue, changes);
         }
      }, instant);

      this.registerWatcher(watcher);
   }

   asString(cb) {
      var model = StringInterpolation.compile(this.value);
      return model(this.element.scope, this.element.locals);
   }
   watchString(cb, instant) {
      var model = StringInterpolation.compile(this.value);
      var watcher = model(this.element.scope, this.element.locals, function(value, oldValue) {
         if (value !== oldValue || oldValue === undefined) {
            return cb(value, oldValue);
         }
      }, instant)
      this.registerWatcher(watcher);
   }
}

$_exports = Attribute;

return $_exports;
});
realm.module("wires.core.Common",["utils.lodash"],function(_){ var $_exports;

class Common {
   constructor() {
      this.__events = [];
   }

   bindEvent(name, cb) {
      var target = this.element ? this.element.original : this.original;
      if (target) {
         target.addEventListener(name, cb, false)
         this.__events.push({
            name: name,
            cb: cb
         });
      }
   }

   /**
    * "GarbageCollector"
    * Removes listeners and watchers
    */
   __gc() {
      this.destroyWatchers()
      this.destroyListeners();
   }
   destroyListeners() {
      var self = this;
      var target = this.element ? this.element.original : this.original;
      if (target) {
         _.each(this.__events, function(item, index) {
            target.removeEventListener(item.name, item.cb);
            self.__events[index] = undefined;
         });
         this.__events = {};
      }
   }
   registerWatcher(watcher) {
      this.watchers = this.watchers || [];
      this.watchers.push(watcher);
   }
   destroyWatchers() {
      _.each(this.watchers, function(watcher) {
         watcher.destroy();
      });
   }
}

$_exports = Common

return $_exports;
});
realm.module("wires.core.Directive",["wires.runtime.Schema", "wires.utils.Properties", "wires.core.Common"],function(userSchemas, prop, Common){ var $_exports;


class Directive extends Common {

   constructor(element) {
      super();
      this.element = element;
   }

   inflate(info) {
      info = info || {};
      var transclude = info.transclude;
      var locals = info.locals || this.element.locals;
      var scope = info.scope || this;

      // adding transclude schema to the scope;
      if (transclude) {

         prop.defineHidden(scope, '$$transcluded', transclude);

      }
      var opts = this.__proto__.constructor.compiler;

      if (opts.schema && userSchemas[opts.schema]) {
         var locals = locals || this.element.locals;
         this.element.inflate(userSchemas[opts.schema], scope, locals)
      }
   }

   /**
    * detach
    * Destorying watchers from directives and attributes
    *
    * @return {type}  description
    */
   detach() {
      this.__gc();
   }
}


$_exports = Directive;

return $_exports;
});
realm.module("wires.core.Element",["wires.core.Attribute", "wires.core.Common", "utils.lodash", "wires.expressions.StringInterpolation", "wires.compiler.Packer", "wires.runtime.Directives"],function(Attribute, Common, _, StringInterpolation, Packer, appDirectives){ var $_exports;


class Element extends Common {
   constructor(schema, scope, locals) {
      super();
      this.scope = scope;
      this.locals = locals;
      this.children = [];
      this.schema = schema;
      this.attrs = {};
      this.directives = {};
   }

   /**
    * createElement
    * Depending on schema type and directives we could create
    * either element or a placeholder
    *
    * @return {type}  description
    */
   create(children) {
      this.filterAttrs();

      var element;
      if (this.controllingDirective) {
         element = document.createComment('');
      } else {
         element = document.createElement(this.schema.name);
      }

      this.original = element;
      if (children) {

         this.inflate(children);
      }
      return element;
   }

   /**
    * initialize - Happens when we are ready to process schema
    *
    * @param  {type} parent description
    * @return {type}        description
    */
   initialize(parent) {
      var self = this;
      if (!this.schema) {
         throw "Cannot initialize an element without schema!"
      }

      if (!this.controllingDirective) {
         this.initAttrs();
         this.initDirectives();
      } else {
         var opts = this.controllingDirective.__proto__.constructor.compiler;
         this.controllingDirective.initialize(
            this.attrs[opts.name]
         );
      }

      if (!this.controllingDirective && !this.primaryDirective) {
         this.schema.inflate({
            scope: this.scope,
            locals: this.locals,
            schema: this.schema.children,
            target: this
         });
      }
      if (this.primaryDirective) {

         this.primaryDirective.inflate({
            transclude: this.schema.children
         });
      }
   }

   /**
    * initAttrs
    * Initializing attributes
    *
    * @return {type}  description
    */
   initAttrs() {
      _.each(this.attrs, function(attr, name) {
         attr.initialize();
      });
   }

   setPrimaryDirective(name, directive) {
      this.directives[name] = directive;
      this.primaryDirective = directive;
   }

   /**
    * initDirectives
    * initialize directives
    *
    * @return {type}  description
    */
   initDirectives() {
      var self = this;
      _.each(this.directives, function(attr, name) {
         attr.initialize(self.attrs[name]);
      });
   }

   /**
    * filterAttrs
    * Figuring out which directives are in control
    *
    * @return {type}  description
    */
   filterAttrs() {
      var self = this;

      // Go through attributes and check for directives' properties
      _.each(self.schema.attrs, function(item) {
         var attr = new Attribute(self, item.name, item.value);

         if (item.requires) {
            // If we have a custom directive here
            var Dir = appDirectives[item.requires];
            var opts = Dir.compiler;
            if (opts.attribute && opts.attribute.placeholder) {
               self.controllingDirective = new Dir(self);
               attr.directive = self.controllingDirective;
            } else {
               var anyDirective = new Dir(self);
               self.directives[item.name] = anyDirective;
               attr.directive = anyDirective;
            }
         }

         self.attrs[item.name] = attr;
      });
   }

   inflate(schema, scope, locals) {
      this.schema.inflate({
         target: this,
         schema: schema || this.schema.children,
         scope: scope || this.scope,
         locals: locals || this.locals
      });
   }

   /**
    * remove - Removes an element
    * Deatches all watchers
    *
    * @return {type}  description
    */
   remove() {
      this.detach(); // removing all watchers
      if (this.original && this.original.parentNode) {
         this.original.parentNode.removeChild(this.original);
      }
      this.children = [];
      this.directives = [];
   }

   detach() {

      this.__gc();
      _.each(this.children, function(item) {
         item.detach();
      });
      _.each(this.directives, function(item) {
         item.detach();
      });
   }

   /**
    * clone
    * Clones current element
    * Clones schema as well
    *
    * @param  {type} scope  description
    * @param  {type} locals description
    * @return {type}        description
    */
   clone(scope, locals) {
      return this.schema.init(this.schema.clone(), scope || this.scope, locals || this.locals);
   }

   newInstance(schema, scope, locals) {
      return new Element(schema, scope, locals);
   }

   setControllingDirective(directive) {
      this.controllingDirective = directive;
   }

   removeChildren() {
      _.each(this.children, function(child) {
         child.remove();
      });
   }

   // Generic element methods *********************************
   // ********************************************************

   /**
    * append - description
    *
    * @param  {type} target description
    * @return {type}        description
    */
   append(target) {

      this.children.push(target);
      if (!this.controllingDirective) {
         this.original.appendChild(target.original);
      }
   }

   appendTo(target) {
      if (target instanceof window.Element) {
         target.appendChild(this.original);
      } else {
         target.append(this);
      }
   }

   detachElement() {
      if (this.original && this.original.parentNode) {
         this.original.parentNode.removeChild(this.original);
      }
   }

   attachElement() {
      if (this.original && this.original.parentNode) {
         this.original.parentNode.appendChild(this.original);
      }
   }

   insertAfter(target) {
      target.original.parentNode
         .insertBefore(this.original, target.original.nextSibling);
   }

   setChildren(children) {
      this.children = children;
   }

   attr(name, value) {
      if (value === undefined) {
         return this.original.getAttribute(name)
      }
      this.original.setAttribute(name, value);
   }

   /**
    * hide - description
    *
    * @return {type}  description
    */
   hide() {
      this.original.style.display = "none";
   }

   /**
    * show - description
    *
    * @return {type}  description
    */
   show() {
      this.original.style.display = "";
   }

}


$_exports = Element;

return $_exports;
});
realm.module("wires.core.Schema",["wires.compiler.Packer", "utils.lodash", "wires.core.Element", "wires.core.TextNode", "wires.runtime.Directives", "wires.runtime.Schema"],function(Packer, _, Element, TextNode, appDirectives, userSchemas){ var $_exports;


class Schema {
   constructor(json) {
      this.json = json;
      if (json) {
         var data = Packer.unpack(json);
         var self = this;
         _.each(data, function(value, key) {
            self[key] = value;
         });
      }
   }

   detachAttribute(name) {
      _.remove(this.attrs, function(attrs) {
         return attrs.name === name
      });
   }

   inflate(opts) {
      return Schema.inflate(opts)
   }

   init(schema, scope, locals) {
      return Schema.init(schema, scope, locals);
   }

   static init(schema, scope, locals) {
      var element;
      if (schema.type === "tag") {
         element = new Element(schema, scope, locals);
      }
      if (schema.type === "directive") {
         element = Schema.createDirectiveElement(schema, scope, locals);
      }
      if (schema.type === "text") {
         element = new TextNode(schema, scope, locals);
      }
      return element;
   }

   static createDirectiveElement(item, scope, locals) {
      var self = this;
      var element;

      var Dir = appDirectives[item.requires];
      if (Dir) {

         var opts = Dir.compiler || {};
         var directive = new Dir();

         if (opts.element && opts.element.placeholder) {
            element = new Element(item, scope, locals);
            directive.element = element;
            element.setControllingDirective(directive);
         } else {
            element = new Element(item, scope, locals);
            directive.element = element;
            element.setPrimaryDirective(item.name, directive);
         }
      }
      return element;
   }

   static inflate(opts) {
      opts = opts || {};
      var scope = opts.scope;
      var locals = opts.locals;
      var target = opts.target;
      var json = opts.schema;
      var children = [];
      _.each(json, function(item) {
         var schema = new Schema(item);
         var element = Schema.init(schema, scope, locals);
         if (element) {
            element.create();

            element.appendTo(target);
            element.initialize();
         }
      });
      var element;
   }

   clone() {
      return new Schema(this.json);
   }
}


$_exports = Schema;

return $_exports;
});
realm.module("wires.core.TextNode",["wires.expressions.StringInterpolation", "wires.core.Common"],function(StringInterpolation, Common){ var $_exports;


class TextNode extends Common {

   constructor(schema, scope, locals) {
      super();
      this.schema = schema;
      this.scope = scope;
      this.locals = locals;
   }

   create() {
      this.original = document.createTextNode('');
      return this.original;
   }

   initialize() {
      var self = this;
      var model = StringInterpolation.compile(this.schema.text);
      model(this.scope, this.locals, function(value) {
         self.original.nodeValue = value;
      }, true);

   }
   insertAfter(target) {
      target.original.parentNode
         .insertBefore(this.original, target.original.nextSibling);
   }
   appendTo(target) {
      if (target instanceof window.Element) {
         target.appendChild(this.original);
      } else {
         target.append(this);
      }
   }
   remove() {
      if (this.original && this.original.parentNode) {
         this.original.parentNode.removeChild(this.original);
      }
      this.detach();
   }

   detach() {
      return this.destroyWatchers();
   }
}

$_exports = TextNode;

return $_exports;
});
realm.module("wires.compiler.JSONifier",["realm", "utils.lodash", "wires.expressions.StringInterpolation", "wires.compiler.Packer", "wires.runtime.Directives", "wires.htmlparser.Parser"],function(realm, _, interpolate, Packer, appDirectives, Parser){ var $_exports;



/**
 * ViewCompiler
 * Compiles html string into JSON
 * Precompiles string templates (makes it easier for watchers)
 */
class JSONifier {
   constructor(directives, elements) {
      this.directives = directives;
      this.elements = elements;
      this.json = [];
   }

   getResult() {
      return this.iterateChildren(this.elements)
   }

   createTag(element) {
      var tag = {};
      var self = this;
      var name = element.name;
      var directive = this.directives[name];
      var children = element.children;
      var attrs = {};
      _.each(element.attrs, function(value, name) {
         var attrDirective = self.directives[name]
         attrs[name] = {};
         if (attrDirective) {
            attrs[name].value = value;
            attrs[name].requires = attrDirective.path;
         } else {
            attrs[name] = {
               value: interpolate.parse(value),
            }
         }
      });
      tag.attrs = attrs;
      tag.type = "tag";
      if (directive) {
         tag.type = 'directive';
         tag.name = name;
         tag.requires = directive.path;
      } else {
         tag.name = name;
      }
      tag.children = children && children.length ? this.iterateChildren(children) : [];

      return Packer.pack(tag);
   }
   createText(element) {
      var text = element.value;

      if (text && !text.match(/^\s*$/g)) {
         return Packer.pack({
            type: "text",
            text: interpolate.parse(text)
         });
      }
   }

   /**
    * iterateChildren - a recursive function (private)
    *  Generates JSON
    * @return {type}  description
    */
   iterateChildren(children) {
      var result = [];
      var self = this;

      _.each(children, function(element) {

         var isTag = element.type === "tag"
         var isText = element.type === "text";
         if (isTag) {
            result.push(self.createTag(element));
         }
         if (isText) {
            var t = self.createText(element);
            if (t) {
               result.push(t);
            }
         }
      });
      return result;
   }

   /**
    * htmlString - convert raw html into a JSON
    *
    * @param  {type} html description
    * @return {type}      description
    */
   static htmlString(html) {
      var directives = {};
      _.each(appDirectives, function(directive, path) {
         directives[directive.compiler.name] = {
            opts: directive.compiler,
            cls: directive,
            path: path
         }
      });
      var elements = Parser.parse(html, true);
      const compiler = new JSONifier(directives, elements);
      const result = compiler.getResult();

      return result;
   }
}

$_exports = JSONifier;

return $_exports;
});
realm.module("wires.compiler.Packer",["utils.lodash"],function(_){ var $_exports;


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


$_exports = Packer;

return $_exports;
});
realm.module("wires.compiler.SchemaGenerator",["nodejs.utils.fs", "nodejs.utils.walk", "nodejs.utils.path", "nodejs.utils.stream", "wires.compiler.JSONifier", "utils.lodash", "utils.Promise", "realm"],function(fs, walk, path, stream, JSONifier, _, Promise, realm){ var $_exports;


class SchemaGenerator {

   static service(dir, _package) {

      return SchemaGenerator.walkDirectory(dir).then(function(items) {
         var fn = ['realm.module("' + (_package || 'wires.schema.sample') + '", function(){'];
         fn.push('\n\treturn {\n')
         var views = [];
         _.each(items, function(item, key) {
            views.push('\t  "' + key + '":' + JSON.stringify(item))
         });
         fn.push(views.join(',\n'));
         fn.push("\n\t}\n});");
         return fn.join('');
      });
   }

   static compact(dir, _package, dest) {
      return new Promise(function(resolve, reject) {

         SchemaGenerator.getJavascript(dir, _package).then(function(js) {
            fs.writeFileSync(dest, js);
            console.log('here is good')
         }).catch(reject).then(resolve)
      })
   }

   static express(dir, _package) {
      return (req, res, next) => {
         SchemaGenerator.getJavascript(dir, _package).then(function(contents) {
            res.setHeader('content-type', 'text/javascript');
            return res.end(contents);
         });
      }
   }

   static getJavascript(dir, _package) {
      return SchemaGenerator.service(dir, _package).then(function(contents) {
         return realm.transpiler2.wrapContents(contents);
      });
   }

   static walkDirectory(dirName) {

      return new Promise((resolve, reject) => {
         var walker = walk.walk(dirName);
         var data = {};
         walker.on("file", function(root, fileStats, next) {
            var f = path.join(root, fileStats.name);
            var contents = fs.readFileSync(f).toString();
            var baseFileName = f.split(dirName)[1];
            data[baseFileName] = JSONifier.htmlString(contents)
            next();
         });
         walker.on("end", function() {
            return resolve(data);
         });
      });
   }
}


$_exports = SchemaGenerator;

return $_exports;
});
realm.module("wires.app.Dispatcher",["wires.core.Schema", "wires.runtime.Schema", "utils.lodash", "wires.app.PushState"],function(Schema, runtimeSchemas, _, PushState){ var $_exports;


var $rootRoute;

var url2Method = function(url) {
   return "on" + url[0].toUpperCase() + url.slice(1, url.length);
}

class Dispatcher {

   /**
    * constructor -
    * Subscribes to changes (Should be initialated only once)
    *
    * @return {type}  description
    */
   constructor() {
      var self = this;
      this.states = {};
      this.urls = [];

      PushState.subscribe(function() {
         self.changed();
      });
   }

   /**
    * storeEssentials - stores information into the "route" object
    * Creats a hidden proprety
    * @param  {type} obj  description
    * @param  {type} data description
    * @return {type}      description
    */
   storeEssentials(obj, data) {
      if (!obj.$$router) {
         Object.defineProperty(obj, "$$router", {
            enumerable: false,
            value: data
         });
         return obj.$$router;
      } else {

         _.each(data, function(v, k) {

            obj.$$router[k] = v;
         });
      }
      return obj.$$router;
   }

   assign(route) {
      if (!$rootRoute) {
         $rootRoute = route;
      }
      this.changed();
   }

   /**
    * getEssentials - gets information from an object
    *
    * @param  {type} obj description
    * @return {type}     description
    */
   getEssentials(obj) {
      return obj.$$router || {};
   }

   /**
    * getPaths - Retrevies paths
    *
    * @return {type}  description
    */
   getPaths() {
      var path = window.location.pathname;
      return path.split("/")
   }

   getFullURL() {
      return window.location.href;
   }

   /**
    * register - description
    *
    * @param  {type} element description
    * @param  {type} route   description
    * @return {type}         description
    */
   register(element, route) {
      var self = this;

      var essentials = self.storeEssentials(route, {
         element: element
      });
      var nextIndex = essentials.index + 1;
      var path = this.paths[essentials.index + 1];
      element.removeChildren(); // Clean up
      if (!path) {
         return;
      }
      var method = route[url2Method(path)];
      if (_.isFunction(method)) {
         var data = this.evaluate(route, method);
         if (data.schema) {
            return element.inflate(data.schema);
         }
         if (data.instance) {
            var result = self.initializeRoute(data.instance, nextIndex)
            return element.inflate(result.schema, data.instance);
         }
      }

   }

   /**
    * changed - description
    *
    * @return {type}  description
    */
   changed() {
      var self = this;
      this.paths = this.getPaths();

      if (!this.root) { // initial run
         self.urls = this.paths;
         return this.createRoot();
      }
      // on navigation
      var changedRoute;
      _.each(this.paths, function(path, index) {
         if (self.urls[index] !== path && changedRoute === undefined) {
            changedRoute = index;
         }
      });
      //console.log(self.fullURL !== self.getFullURL())
      if (changedRoute === undefined && self.paths.length !== self.urls.length) {
         changedRoute = _.findLastIndex(this.paths);
      }

      if (changedRoute > -1) {
         var route = self.states[changedRoute - 1];
         if (route !== undefined) {
            if (route.$$router) {
               self.register(route.$$router.element, route);
            }
         }
      }
      self.fullURL = self.getFullURL();
      self.urls = this.paths;
   }

   /**
    * initializeRoute - description
    *
    * @param  {type} route     description
    * @param  {type} nextIndex description
    * @return {type}           description
    */
   initializeRoute(route, nextIndex) {
      var self = this;
      self.storeEssentials(route, {
         index: nextIndex,
         dispatcher: self
      });
      self.states[nextIndex] = route;
      return this.evaluate(route, route.initialize);
   }

   /**
    * createRoot - description
    *
    * @return {type}  description
    */
   createRoot() {
      var self = this;
      this.root = new $rootRoute();
      self.storeEssentials(this.root, {
         index: 0,
         dispatcher: self
      });
      self.states[0] = this.root;
      var data = this.evaluate(this.root, this.root.initialize);
      if (data.schema) {
         Schema.inflate({
            schema: data.schema,
            target: document.querySelector('body'),
            scope: self.root
         })
      }
   }

   /**
    * evaluate - checks the response
    *
    * @param  {type} result description
    * @return {type}        description
    */
   evaluate(route, method) {
      var index = route.$$router.index;
      var result = method.apply(route)
      console.log(result)
      var view;
      if (_.isString(result)) {
         if (!runtimeSchemas[result]) {
            throw {
               message: result + " is not found in schemas!"
            }
         }
         return {
            type: "schema",
            schema: runtimeSchemas[result]
         }
      } else {
         return {
            type: "route",
            instance: result
         }
      }
      return {};
   }
}

let dispatcher = new Dispatcher();

$_exports = dispatcher;

return $_exports;
});
realm.module("wires.app.PushState",["wires.app.Query", "utils.lodash"],function(Query, _){ var $_exports;


var subscriptions = [];

class PushState {

   static _createQueryString(data) {
      var stringData = [];
      _.each(data, function(value, k) {
         stringData.push(k + "=" + encodeURI(value))
      });
      var str = stringData.join("&");
      if (stringData.length > 0) {
         str = "?" + str;
      }
      return str;
   }
   static subscribe(cb) {
      subscriptions.push(cb);

   }
   static changed() {
      _.each(subscriptions, function(cb) {
         cb();
      });
   }

   static redirect(url) {
      History.set(url);
   }

   static get(item) {
      var q = Query.get();
      if (item) {
         return q[item];
      }
      return q;
   }

   static _changeState(a) {
      var stateObj = {
         url: a
      };
      history.pushState(stateObj, a, a);
      PushState.changed();
   }

   static force(data, userUrl) {
      this._changeState((userUrl || window.location.pathname) + this._createQueryString(data));
   }

   static merge(data, userUrl) {
      if (_.isPlainObject(data)) {
         var current = Query.get();
         var params = _.merge(current, data);
         var url = (userUrl || window.location.pathname) + this._createQueryString(params);
         this._changeState(url);
      }
   }
}
if (window) {
   window.onpopstate = function(state) {
      PushState.changed();
   }
}


$_exports = PushState;

return $_exports;
});
realm.module("wires.app.Query",[],function(){ var $_exports;

class Query {
   static get() {
      // This function is anonymous, is executed immediately and
      // the return value is assigned to QueryString!
      var query_string = {};
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
         var pair = vars[i].split("=");
         // If first entry with this name
         if (typeof query_string[pair[0]] === "undefined") {

            if (pair[0]) {
               query_string[pair[0]] = decodeURIComponent(pair[1]);
            }

            // If second entry with this name
         } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
         } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
         }
      }
      return query_string;
   }
}


$_exports = Query;

return $_exports;
});
realm.module("wires.app.Router",["wires.app.Dispatcher", "utils.lodash"],function(dispatcher, _){ var $_exports;

class Router {

   static start() {
      dispatcher.assign(this);
   }

   render(target) {
      if (_.isString(target)) {
         return {
            type: "schema",
            path: target
         }
      }
      if (target instanceof Router) {
         return {
            type: "router",
            instance: target
         }
      }
   }
}

$_exports = Router;

return $_exports;
});
realm.module("wires.app.render",[],function(){ var $_exports;

var SchemaDecorator = (cls, method) => {

}


$_exports = SchemaDecorator;

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());