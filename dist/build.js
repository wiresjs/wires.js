(function(isNode, realm) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

realm.module("utils.lodash", function () {
   return isNode ? require("lodash") : window._;
});

realm.module("utils.Promise", function () {
   return isNode ? require("Promise") : window.Promise;
});
var nodeAsyncLib = isNode ? require("async-watch") : undefined;

realm.module("wires.AsyncWatch", function () {
   return isNode ? nodeAsyncLib.AsyncWatch : window.AsyncWatch;
});

realm.module("realm", function () {
   return realm;
});

realm.module("nodejs.utils.stream", function () {
   return isNode ? require("event-stream") : {};
});
realm.module("nodejs.utils.fs", function () {
   return isNode ? require("fs") : {};
});
realm.module("nodejs.utils.walk", function () {
   return isNode ? require("walk") : {};
});
realm.module("nodejs.utils.path", function () {
   return isNode ? require("path") : {};
});

realm.module("AsyncTransaction", function () {
   return isNode ? nodeAsyncLib.AsyncTransaction : window.AsyncTransaction;
});

realm.module("wires.compiler.JSONifier", ["realm", "utils.lodash", "wires.utils.UniversalQuery", "wires.expressions.StringInterpolation", "wires.compiler.Packer", "wires.runtime.Directives"], function (realm, _, UniversalQuery, interpolate, Packer, appDirectives) {

   /**
    * ViewCompiler
    * Compiles html string into JSON
    * Precompiles string templates (makes it easier for watchers)
    */

   var JSONifier = function () {
      function JSONifier(directives) {
         _classCallCheck(this, JSONifier);

         this.directives = directives;
         this.json = [];
      }

      _createClass(JSONifier, [{
         key: "createTag",
         value: function createTag(element) {
            var tag = {};
            var self = this;
            var name = (isNode ? element.name : element.nodeName).toLowerCase();

            var directive = this.directives[name];
            var children = isNode ? element.children : element.childNodes;
            var attrs = {};
            var elAttrs = isNode ? element.attribs : element.attributes;

            _.each(elAttrs, function (attr, key) {
               var name = isNode ? key : attr.nodeName;
               var attrDirective = self.directives[name];
               var stringValue = isNode ? attr : attr.nodeValue;

               attrs[name] = {};
               if (attrDirective) {
                  attrs[name].value = stringValue;
                  attrs[name].requires = attrDirective.path;
               } else {
                  attrs[name] = {
                     value: interpolate.parse(stringValue)
                  };
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
            tag.children = children.length ? this.iterateChildren(children) : [];
            return Packer.pack(tag);
         }
      }, {
         key: "createText",
         value: function createText(element) {
            var text = element.data || element.nodeValue;
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

      }, {
         key: "iterateChildren",
         value: function iterateChildren(children) {
            var result = [];
            var self = this;

            _.each(children, function (element) {

               var isTag = element.type === "tag" || element.nodeType == 1;
               var isText = element.type === "text" || element.nodeType == 3;

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

      }], [{
         key: "htmlString",
         value: function htmlString(html) {
            var directives = {};
            _.each(appDirectives, function (directive, path) {
               directives[directive.compiler.name] = {
                  opts: directive.compiler,
                  cls: directive,
                  path: path
               };
            });
            var $ = UniversalQuery.init(html);
            var compiler = new JSONifier(directives);
            var result = compiler.iterateChildren($[0].childNodes);
            return result;
         }
      }]);

      return JSONifier;
   }();

   var ___module__promised__ = JSONifier;

   return ___module__promised__;
});
realm.module("wires.compiler.Packer", ["utils.lodash"], function (_) {
   var NumType = function () {
      function NumType(types) {
         _classCallCheck(this, NumType);

         this.types = types;
         this.inverted = _.invert(types);
      }

      _createClass(NumType, [{
         key: "pack",
         value: function pack(str) {
            return this.types[str] || 0;
         }
      }, {
         key: "unpack",
         value: function unpack(num) {
            return this.inverted[num];
         }
      }]);

      return NumType;
   }();

   var TagTypes = function (_NumType) {
      _inherits(TagTypes, _NumType);

      function TagTypes() {
         _classCallCheck(this, TagTypes);

         return _possibleConstructorReturn(this, Object.getPrototypeOf(TagTypes).call(this, {
            tag: 0,
            text: 1,
            directive: 2,
            include: 3
         }));
      }

      return TagTypes;
   }(NumType);

   var tags = new TagTypes();

   var Packer = function () {
      function Packer() {
         _classCallCheck(this, Packer);
      }

      _createClass(Packer, null, [{
         key: "pack",

         // Packing readable format into unreadable
         value: function pack(opts) {
            opts = opts || {};
            var type = opts.type;
            var name = opts.name;
            var requires = opts.requires;
            var attrs = [];
            var children = opts.children || [];
            _.each(opts.attrs, function (item, key) {
               var attr = [key, item.value];
               if (item.requires) {
                  attr.push(item.requires);
               }
               attrs.push(attr);
            });
            if (type === "text") {
               return [tags.pack(type), opts.text];
            }

            var data = [tags.pack(type), requires || 0, name, attrs];
            if (children) {
               data.push(children);
            }
            return data;
         }

         // Unpacking

      }, {
         key: "unpack",
         value: function unpack(item) {
            var type = tags.unpack(item[0]);
            if (type === "text") {
               return {
                  type: 'text',
                  text: item[1]
               };
            }

            var _attrs = item[3];

            var attrs = [];
            _.each(_attrs, function (attr) {
               var a = {
                  name: attr[0],
                  value: attr[1]
               };
               if (attr[2]) {
                  a.requires = attr[2];
               }
               attrs.push(a);
            });
            var data = {
               type: type,
               name: item[2],
               attrs: attrs,
               children: item[4] || []
            };
            if (item[1]) {
               data.requires = item[1];
            }
            return data;
         }
      }]);

      return Packer;
   }();

   var ___module__promised__ = Packer;

   return ___module__promised__;
});
realm.module("wires.compiler.SchemaGenerator", ["nodejs.utils.fs", "nodejs.utils.walk", "nodejs.utils.path", "nodejs.utils.stream", "wires.compiler.JSONifier", "utils.lodash", "utils.Promise", "realm"], function (fs, walk, path, stream, JSONifier, _, Promise, realm) {
   var SchemaGenerator = function () {
      function SchemaGenerator() {
         _classCallCheck(this, SchemaGenerator);
      }

      _createClass(SchemaGenerator, null, [{
         key: "service",
         value: function service(dir, _package) {

            return SchemaGenerator.walkDirectory(dir).then(function (items) {
               var fn = ['realm.module("' + (_package || 'wires.schema.sample') + '", function(){'];
               fn.push('\n\treturn {\n');
               var views = [];
               _.each(items, function (item, key) {
                  views.push('\t  "' + key + '":' + JSON.stringify(item));
               });
               fn.push(views.join(',\n'));
               fn.push("\n\t}\n});");
               return fn.join('');
            });
         }
      }, {
         key: "compact",
         value: function compact(dir, _package, dest) {
            return new Promise(function (resolve, reject) {
               SchemaGenerator.getJavascript(dir, _package).then(function (js) {
                  fs.writeFileSync(dest, js);
               });
            });
         }
      }, {
         key: "express",
         value: function express(dir, _package) {
            return function (req, res, next) {
               SchemaGenerator.getJavascript(dir, _package).then(function (contents) {
                  res.setHeader('content-type', 'text/javascript');
                  return res.end(contents);
               });
            };
         }
      }, {
         key: "getJavascript",
         value: function getJavascript(dir, _package) {
            return SchemaGenerator.service(dir, _package).then(function (contents) {
               return realm.transpiler.wrap(contents);
            });
         }
      }, {
         key: "walkDirectory",
         value: function walkDirectory(dirName) {

            return new Promise(function (resolve, reject) {
               var walker = walk.walk(dirName);
               var data = {};
               walker.on("file", function (root, fileStats, next) {
                  var f = path.join(root, fileStats.name);
                  var contents = fs.readFileSync(f).toString();
                  var baseFileName = f.split(dirName)[1];
                  data[baseFileName] = JSONifier.htmlString(contents);
                  next();
               });
               walker.on("end", function () {
                  return resolve(data);
               });
            });
         }
      }]);

      return SchemaGenerator;
   }();

   var ___module__promised__ = SchemaGenerator;

   return ___module__promised__;
});
realm.module("wires.core.Attribute", ["wires.expressions.StringInterpolation", "wires.expressions.AngularExpressions", "wires.expressions.WatchBatch", "wires.services.Watch", "wires.core.Common"], function (StringInterpolation, AngularExpressions, WatchBatch, Watch, Common) {
   var Attribute = function (_Common) {
      _inherits(Attribute, _Common);

      function Attribute(element, name, value) {
         _classCallCheck(this, Attribute);

         var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Attribute).call(this));

         _this2.element = element;
         _this2.name = name;
         _this2.value = value;
         _this2.watchers = [];
         _this2.model;
         return _this2;
      }

      _createClass(Attribute, [{
         key: "initialize",
         value: function initialize() {
            // Must ignore regular initialization if an attribute is linked to a directive
            if (this.directive) {
               return;
            }
            var original = document.createAttribute(this.name);
            this.original = original;
            this.element.original.setAttributeNode(original);
            var self = this;
            this.registerWatcher(this.watchString(function (value) {
               self.original.value = value;
            }));
         }
      }, {
         key: "assign",
         value: function assign(value) {
            if (!this.model) {
               this.model = AngularExpressions.compile(this.value);
            }
            this.model.assign(this.element.scope, value);
         }
      }, {
         key: "asFunction",
         value: function asFunction() {
            var compiled = AngularExpressions.compile(this.value);
            var scope = this.element.scope;
            return function (locals) {
               compiled(scope, locals);
            };
         }
      }, {
         key: "watchExpression",
         value: function watchExpression(cb, instant) {

            var watcher = Watch({
               locals: this.element.locals,
               scope: this.element.scope
            }, this.value, function (value, oldValue, changes) {

               if (value !== oldValue || oldValue === undefined) {
                  return cb(value, oldValue, changes);
               }
            }, instant);

            this.registerWatcher(watcher);
         }
      }, {
         key: "watchString",
         value: function watchString(cb, instant) {
            var model = StringInterpolation.compile(this.value);
            var watcher = model(this.element.scope, this.element.locals, function (value, oldValue) {
               if (value !== oldValue || oldValue === undefined) {
                  return cb(value, oldValue);
               }
            }, instant);
            this.registerWatcher(watcher);
         }
      }]);

      return Attribute;
   }(Common);

   var ___module__promised__ = Attribute;

   return ___module__promised__;
});
realm.module("wires.core.Common", ["utils.lodash"], function (_) {
   var Common = function () {
      function Common() {
         _classCallCheck(this, Common);

         this.__events = [];
      }

      _createClass(Common, [{
         key: "bindEvent",
         value: function bindEvent(name, cb) {
            var target = this.element ? this.element.original : this.original;
            if (target) {
               target.addEventListener(name, cb, false);
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

      }, {
         key: "__gc",
         value: function __gc() {
            this.destroyWatchers();
            this.destroyListeners();
         }
      }, {
         key: "destroyListeners",
         value: function destroyListeners() {
            var self = this;
            var target = this.element ? this.element.original : this.original;
            if (target) {
               _.each(this.__events, function (item, index) {
                  target.removeEventListener(item.name, item.cb);
                  self.__events[index] = undefined;
               });
               this.__events = {};
            }
         }
      }, {
         key: "registerWatcher",
         value: function registerWatcher(watcher) {
            this.watchers = this.watchers || [];
            this.watchers.push(watcher);
         }
      }, {
         key: "destroyWatchers",
         value: function destroyWatchers() {
            _.each(this.watchers, function (watcher) {
               watcher.destroy();
            });
         }
      }]);

      return Common;
   }();

   var ___module__promised__ = Common;

   return ___module__promised__;
});
realm.module("wires.core.Directive", ["wires.runtime.Schema", "wires.utils.Properties", "wires.core.Common"], function (userSchemas, prop, Common) {
   var Directive = function (_Common2) {
      _inherits(Directive, _Common2);

      function Directive(element) {
         _classCallCheck(this, Directive);

         var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Directive).call(this));

         _this3.element = element;
         return _this3;
      }

      _createClass(Directive, [{
         key: "inflate",
         value: function inflate(info) {
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
               this.element.inflate(userSchemas[opts.schema], scope, locals);
            }
         }

         /**
          * detach
          * Destorying watchers from directives and attributes
          *
          * @return {type}  description
          */

      }, {
         key: "detach",
         value: function detach() {
            this.__gc();
         }
      }]);

      return Directive;
   }(Common);

   var ___module__promised__ = Directive;

   return ___module__promised__;
});
realm.module("wires.core.Element", ["wires.core.Attribute", "wires.core.Common", "utils.lodash", "wires.expressions.StringInterpolation", "wires.compiler.Packer", "wires.runtime.Directives"], function (Attribute, Common, _, StringInterpolation, Packer, appDirectives) {
   var Element = function (_Common3) {
      _inherits(Element, _Common3);

      function Element(schema, scope, locals) {
         _classCallCheck(this, Element);

         var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Element).call(this));

         _this4.scope = scope;
         _this4.locals = locals;
         _this4.children = [];
         _this4.schema = schema;
         _this4.attrs = {};
         _this4.directives = {};
         return _this4;
      }

      /**
       * createElement
       * Depending on schema type and directives we could create
       * either element or a placeholder
       *
       * @return {type}  description
       */


      _createClass(Element, [{
         key: "create",
         value: function create(children) {
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

      }, {
         key: "initialize",
         value: function initialize(parent) {
            var self = this;
            if (!this.schema) {
               throw "Cannot initialize an element without a schema!";
            }

            if (!this.controllingDirective) {
               this.initAttrs();
               this.initDirectives();
            } else {
               var opts = this.controllingDirective.__proto__.constructor.compiler;
               this.controllingDirective.initialize(this.attrs[opts.name]);
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

      }, {
         key: "initAttrs",
         value: function initAttrs() {
            _.each(this.attrs, function (attr, name) {
               attr.initialize();
            });
         }
      }, {
         key: "setPrimaryDirective",
         value: function setPrimaryDirective(name, directive) {
            this.directives[name] = directive;
            this.primaryDirective = directive;
         }

         /**
          * initDirectives
          * initialize directives
          *
          * @return {type}  description
          */

      }, {
         key: "initDirectives",
         value: function initDirectives() {
            var self = this;
            _.each(this.directives, function (attr, name) {
               attr.initialize(self.attrs[name]);
            });
         }

         /**
          * filterAttrs
          * Figuring out which directives are in control
          *
          * @return {type}  description
          */

      }, {
         key: "filterAttrs",
         value: function filterAttrs() {
            var self = this;

            // Go through attributes and check for directives' properties
            _.each(self.schema.attrs, function (item) {
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
      }, {
         key: "inflate",
         value: function inflate(schema, scope, locals) {
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

      }, {
         key: "remove",
         value: function remove() {
            this.detach(); // removing all watchers
            if (this.original && this.original.parentNode) {
               this.original.parentNode.removeChild(this.original);
            }
            this.children = [];
            this.directives = [];
         }
      }, {
         key: "detach",
         value: function detach() {

            this.__gc();
            _.each(this.children, function (item) {
               item.detach();
            });
            _.each(this.directives, function (item) {
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

      }, {
         key: "clone",
         value: function clone(scope, locals) {
            return this.schema.init(this.schema.clone(), scope || this.scope, locals || this.locals);
         }
      }, {
         key: "newInstance",
         value: function newInstance(schema, scope, locals) {
            return new Element(schema, scope, locals);
         }
      }, {
         key: "setControllingDirective",
         value: function setControllingDirective(directive) {
            this.controllingDirective = directive;
         }
      }, {
         key: "removeChildren",
         value: function removeChildren() {
            _.each(this.children, function (child) {
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

      }, {
         key: "append",
         value: function append(target) {

            this.children.push(target);
            if (!this.controllingDirective) {
               this.original.appendChild(target.original);
            }
         }
      }, {
         key: "appendTo",
         value: function appendTo(target) {
            if (target instanceof window.Element) {
               target.appendChild(this.original);
            } else {
               target.append(this);
            }
         }
      }, {
         key: "detachElement",
         value: function detachElement() {
            if (this.original && this.original.parentNode) {
               this.original.parentNode.removeChild(this.original);
            }
         }
      }, {
         key: "attachElement",
         value: function attachElement() {
            if (this.original && this.original.parentNode) {
               this.original.parentNode.appendChild(this.original);
            }
         }
      }, {
         key: "insertAfter",
         value: function insertAfter(target) {
            target.original.parentNode.insertBefore(this.original, target.original.nextSibling);
         }
      }, {
         key: "setChildren",
         value: function setChildren(children) {
            this.children = children;
         }

         /**
          * hide - description
          *
          * @return {type}  description
          */

      }, {
         key: "hide",
         value: function hide() {
            this.original.style.display = "none";
         }

         /**
          * show - description
          *
          * @return {type}  description
          */

      }, {
         key: "show",
         value: function show() {
            this.original.style.display = "";
         }
      }]);

      return Element;
   }(Common);

   var ___module__promised__ = Element;

   return ___module__promised__;
});
realm.module("wires.core.Schema", ["wires.compiler.Packer", "utils.lodash", "wires.core.Element", "wires.core.TextNode", "wires.runtime.Directives", "wires.runtime.Schema"], function (Packer, _, Element, TextNode, appDirectives, userSchemas) {
   var Schema = function () {
      function Schema(json) {
         _classCallCheck(this, Schema);

         this.json = json;
         if (json) {
            var data = Packer.unpack(json);
            var self = this;
            _.each(data, function (value, key) {
               self[key] = value;
            });
         }
      }

      _createClass(Schema, [{
         key: "detachAttribute",
         value: function detachAttribute(name) {
            _.remove(this.attrs, function (attrs) {
               return attrs.name === name;
            });
         }
      }, {
         key: "inflate",
         value: function inflate(opts) {
            return Schema.inflate(opts);
         }
      }, {
         key: "init",
         value: function init(schema, scope, locals) {
            return Schema.init(schema, scope, locals);
         }
      }, {
         key: "clone",
         value: function clone() {
            return new Schema(this.json);
         }
      }], [{
         key: "init",
         value: function init(schema, scope, locals) {
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
      }, {
         key: "createDirectiveElement",
         value: function createDirectiveElement(item, scope, locals) {
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
      }, {
         key: "inflate",
         value: function inflate(opts) {
            opts = opts || {};
            var scope = opts.scope;
            var locals = opts.locals;
            var target = opts.target;
            var json = opts.schema;
            var children = [];
            _.each(json, function (item) {
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
      }]);

      return Schema;
   }();

   var ___module__promised__ = Schema;

   return ___module__promised__;
});
realm.module("wires.core.TextNode", ["wires.expressions.StringInterpolation", "wires.core.Common"], function (StringInterpolation, Common) {
   var TextNode = function (_Common4) {
      _inherits(TextNode, _Common4);

      function TextNode(schema, scope, locals) {
         _classCallCheck(this, TextNode);

         var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(TextNode).call(this));

         _this5.schema = schema;
         _this5.scope = scope;
         _this5.locals = locals;
         return _this5;
      }

      _createClass(TextNode, [{
         key: "create",
         value: function create() {
            this.original = document.createTextNode('');
            return this.original;
         }
      }, {
         key: "initialize",
         value: function initialize() {
            var self = this;
            var model = StringInterpolation.compile(this.schema.text);
            model(this.scope, this.locals, function (value) {
               self.original.nodeValue = value;
            }, true);
         }
      }, {
         key: "insertAfter",
         value: function insertAfter(target) {
            target.original.parentNode.insertBefore(this.original, target.original.nextSibling);
         }
      }, {
         key: "appendTo",
         value: function appendTo(target) {
            if (target instanceof window.Element) {
               target.appendChild(this.original);
            } else {
               target.append(this);
            }
         }
      }, {
         key: "detach",
         value: function detach() {
            return this.destroyWatchers();
         }
      }]);

      return TextNode;
   }(Common);

   var ___module__promised__ = TextNode;

   return ___module__promised__;
});
realm.module("wires.expressions.AngularExpressionParser", [], function () {

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
      return function () {
         return value;
      };
   }

   function $parseMinErr(module, message, arg1, arg2, arg3) {
      var args = arguments;

      message = message.replace(/{(\d)}/g, function (match) {
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
         throw $parseMinErr('isecfld', 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
      }
      return name;
   }

   function ensureSafeObject(obj, fullExpression) {
      // nifty check if obj is Function that is fast and works across iframes and other contexts
      if (obj) {
         if (obj.constructor === obj) {
            throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
         } else if ( // isWindow(obj)
         obj.document && obj.location && obj.alert && obj.setInterval) {
            throw $parseMinErr('isecwindow', 'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
         } else if ( // isElement(obj)
         obj.children && (obj.nodeName || obj.prop && obj.attr && obj.find)) {
            throw $parseMinErr('isecdom', 'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
         }
      }
      return obj;
   }

   var OPERATORS = {
      /* jshint bitwise : false */
      'null': function _null() {
         return null;
      },
      'true': function _true() {
         return true;
      },
      'false': function _false() {
         return false;
      },
      undefined: noop,
      '+': function _(self, locals, a, b) {
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
      '-': function _(self, locals, a, b) {
         a = a(self, locals);
         b = b(self, locals);
         return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
      },
      '*': function _(self, locals, a, b) {
         return a(self, locals) * b(self, locals);
      },
      '/': function _(self, locals, a, b) {
         return a(self, locals) / b(self, locals);
      },
      '%': function _(self, locals, a, b) {
         return a(self, locals) % b(self, locals);
      },
      '^': function _(self, locals, a, b) {
         return a(self, locals) ^ b(self, locals);
      },
      '=': noop,
      '===': function _(self, locals, a, b) {
         return a(self, locals) === b(self, locals);
      },
      '!==': function _(self, locals, a, b) {
         return a(self, locals) !== b(self, locals);
      },
      '==': function _(self, locals, a, b) {
         return a(self, locals) == b(self, locals);
      },
      '!=': function _(self, locals, a, b) {
         return a(self, locals) != b(self, locals);
      },
      '<': function _(self, locals, a, b) {
         return a(self, locals) < b(self, locals);
      },
      '>': function _(self, locals, a, b) {
         return a(self, locals) > b(self, locals);
      },
      '<=': function _(self, locals, a, b) {
         return a(self, locals) <= b(self, locals);
      },
      '>=': function _(self, locals, a, b) {
         return a(self, locals) >= b(self, locals);
      },
      '&&': function _(self, locals, a, b) {
         return a(self, locals) && b(self, locals);
      },
      '||': function _(self, locals, a, b) {
         return a(self, locals) || b(self, locals);
      },
      '&': function _(self, locals, a, b) {
         return a(self, locals) & b(self, locals);
      },
      //    '|':function(self, locals, a,b){return a|b;},
      '|': function _(self, locals, a, b) {
         return b(self, locals)(self, locals, a(self, locals));
      },
      '!': function _(self, locals, a) {
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
   var Lexer = function Lexer(options) {
      this.options = options;
   };

   Lexer.prototype = {
      constructor: Lexer,

      lex: function lex(text) {
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
               if (this.was('{,') && json[0] === '{' && (token = this.tokens[this.tokens.length - 1])) {
                  token.json = token.text.indexOf('.') === -1;
               }
            } else if (this.is('(){}[].,;:?')) {
               this.tokens.push({
                  index: this.index,
                  text: this.ch,
                  json: this.was(':[,') && this.is('{[') || this.is('}]:,')
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
                     json: this.was('[,:') && this.is('+-')
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

      is: function is(chars) {
         return chars.indexOf(this.ch) !== -1;
      },

      was: function was(chars) {
         return chars.indexOf(this.lastCh) !== -1;
      },

      peek: function peek(i) {
         var num = i || 1;
         return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
      },

      isNumber: function isNumber(ch) {
         return '0' <= ch && ch <= '9';
      },

      isWhitespace: function isWhitespace(ch) {
         // IE treats non-breaking space as \u00A0
         return ch === ' ' || ch === '\r' || ch === '\t' || ch === '\n' || ch === '\v' || ch === " ";
      },

      isIdent: function isIdent(ch) {
         return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || '_' === ch || ch === '$';
      },

      isExpOperator: function isExpOperator(ch) {
         return ch === '-' || ch === '+' || this.isNumber(ch);
      },

      throwError: function throwError(error, start, end) {
         end = end || this.index;
         var colStr = isDefined(start) ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']' : ' ' + end;
         throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].', error, colStr, this.text);
      },

      readNumber: function readNumber() {
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
               } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == 'e') {
                  number += ch;
               } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == 'e') {
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
            fn: function fn() {
               return number;
            }
         });
      },

      readIdent: function readIdent() {
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
            token.fn = extend(function (self, locals) {
               return getter(self, locals);
            }, {
               assign: function assign(self, value) {
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

      readString: function readString(quote) {
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
                  if (!hex.match(/[\da-f]{4}/i)) this.throwError("Invalid unicode escape [\\u" + hex + ']');
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
                  fn: function fn() {
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
   var Parser = function Parser(lexer, $filter, options) {
      this.lexer = lexer;
      this.$filter = $filter;
      this.options = options;
   };

   Parser.ZERO = function () {
      return 0;
   };

   Parser.prototype = {
      constructor: Parser,

      parse: function parse(text) {
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
      tokenize: function tokenize(text) {
         this.text = text;
         //2
         this.tokens = this.lexer.lex(text);
         return this.tokens;
      },

      primary: function primary() {
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
         while (next = this.expect('(', '[', '.')) {
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

      throwError: function throwError(msg, token) {
         throw $parseMinErr('syntax', 'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].', token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
      },

      peekToken: function peekToken() {
         if (this.tokens.length === 0) throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
         return this.tokens[0];
      },

      peek: function peek(e1, e2, e3, e4) {
         if (this.tokens.length > 0) {
            var token = this.tokens[0];
            var t = token.text;
            if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
               return token;
            }
         }
         return false;
      },

      expect: function expect(e1, e2, e3, e4) {
         var token = this.peek(e1, e2, e3, e4);
         if (token) {
            this.tokens.shift();
            return token;
         }
         return false;
      },

      consume: function consume(e1) {
         if (!this.expect(e1)) {
            this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
         }
      },

      unaryFn: function unaryFn(fn, right) {
         return extend(function (self, locals) {
            return fn(self, locals, right);
         }, {
            constant: right.constant
         });
      },

      ternaryFn: function ternaryFn(left, middle, right) {
         return extend(function (self, locals) {
            return left(self, locals) ? middle(self, locals) : right(self, locals);
         }, {
            constant: left.constant && middle.constant && right.constant
         });
      },

      binaryFn: function binaryFn(left, fn, right) {
         return extend(function (self, locals) {
            return fn(self, locals, left, right);
         }, {
            constant: left.constant && right.constant
         });
      },

      statements: function statements() {
         var statements = [];
         while (true) {
            if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']')) {
               statements.push(this.filterChain());
            }
            if (!this.expect(';')) {
               // optimize for the common case where there is only one statement.
               // TODO(size): maybe we should not support multiple statements?
               return statements.length === 1 ? statements[0] : function (self, locals) {
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

      filterChain: function filterChain() {
         var left = this.expression();
         var token;
         while (true) {
            if (token = this.expect('|')) {
               left = this.binaryFn(left, token.fn, this.filter());
            } else {
               return left;
            }
         }
      },

      filter: function filter() {
         var token = this.expect();
         var fn = this.$filter(token.text);
         var argsFn = [];
         while (true) {
            if (token = this.expect(':')) {
               argsFn.push(this.expression());
            } else {
               var fnInvoke = function fnInvoke(self, locals, input) {
                  var args = [input];
                  for (var i = 0; i < argsFn.length; i++) {
                     args.push(argsFn[i](self, locals));
                  }
                  return fn.apply(self, args);
               };
               return function () {
                  return fnInvoke;
               };
            }
         }
      },

      expression: function expression() {
         return this.assignment();
      },

      assignment: function assignment() {
         var left = this.ternary();
         var right;
         var token;
         if (token = this.expect('=')) {
            if (!left.assign) {
               this.throwError('implies assignment but [' + this.text.substring(0, token.index) + '] can not be assigned to', token);
            }
            right = this.ternary();
            return function (scope, locals) {
               return left.assign(scope, right(scope, locals), locals);
            };
         }
         return left;
      },

      ternary: function ternary() {
         var left = this.logicalOR();
         var middle;
         var token;
         if (token = this.expect('?')) {
            middle = this.ternary();
            if (token = this.expect(':')) {
               return this.ternaryFn(left, middle, this.ternary());
            } else {
               this.throwError('expected :', token);
            }
         } else {
            return left;
         }
      },

      logicalOR: function logicalOR() {
         var left = this.logicalAND();
         var token;
         while (true) {
            if (token = this.expect('||')) {
               left = this.binaryFn(left, token.fn, this.logicalAND());
            } else {
               return left;
            }
         }
      },

      logicalAND: function logicalAND() {
         var left = this.equality();
         var token;
         if (token = this.expect('&&')) {
            left = this.binaryFn(left, token.fn, this.logicalAND());
         }
         return left;
      },

      equality: function equality() {
         var left = this.relational();
         var token;
         if (token = this.expect('==', '!=', '===', '!==')) {
            left = this.binaryFn(left, token.fn, this.equality());
         }
         return left;
      },

      relational: function relational() {
         var left = this.additive();
         var token;
         if (token = this.expect('<', '>', '<=', '>=')) {
            left = this.binaryFn(left, token.fn, this.relational());
         }
         return left;
      },

      additive: function additive() {
         var left = this.multiplicative();
         var token;
         while (token = this.expect('+', '-')) {
            left = this.binaryFn(left, token.fn, this.multiplicative());
         }
         return left;
      },

      multiplicative: function multiplicative() {
         var left = this.unary();
         var token;
         while (token = this.expect('*', '/', '%')) {
            left = this.binaryFn(left, token.fn, this.unary());
         }
         return left;
      },

      unary: function unary() {
         var token;
         if (this.expect('+')) {
            return this.primary();
         } else if (token = this.expect('-')) {
            return this.binaryFn(Parser.ZERO, token.fn, this.unary());
         } else if (token = this.expect('!')) {
            return this.unaryFn(token.fn, this.unary());
         } else {
            return this.primary();
         }
      },

      fieldAccess: function fieldAccess(object) {
         var parser = this;
         var field = this.expect().text;
         var getter = getterFn(field, this.options, this.text);

         return extend(function (scope, locals, self) {
            return getter(self || object(scope, locals));
         }, {
            assign: function assign(scope, value, locals) {
               var o = object(scope, locals);
               if (!o) object.assign(scope, o = {}, locals);
               return setter(o, field, value, parser.text, parser.options);
            }
         });
      },

      objectIndex: function objectIndex(obj) {
         var parser = this;

         var indexFn = this.expression();
         this.consume(']');

         return extend(function (self, locals) {
            var o = obj(self, locals),
                i = indexFn(self, locals),
                v,
                p;

            if (!o) return undefined;
            v = ensureSafeObject(o[i], parser.text);
            return v;
         }, {
            assign: function assign(self, value, locals) {
               var key = indexFn(self, locals);
               // prevent overwriting of Function.constructor which would break ensureSafeObject check
               var o = ensureSafeObject(obj(self, locals), parser.text);
               if (!o) obj.assign(self, o = [], locals);
               return o[key] = value;
            }
         });
      },

      functionCall: function functionCall(fn, contextGetter) {
         var argsFn = [];
         if (this.peekToken().text !== ')') {
            do {
               argsFn.push(this.expression());
            } while (this.expect(','));
         }
         this.consume(')');

         var parser = this;

         return function (scope, locals) {
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
      arrayDeclaration: function arrayDeclaration() {
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

         return extend(function (self, locals) {
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

      object: function object() {
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

         return extend(function (self, locals) {
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
         var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;

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
         return (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
      };
   }

   function simpleGetterFn2(key0, key1, fullExp) {
      ensureSafeMemberName(key0, fullExp);
      ensureSafeMemberName(key1, fullExp);

      return function simpleGetterFn2(scope, locals) {
         if (scope == null) return undefined;
         scope = (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
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
            fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options);
         } else {
            fn = function fn(scope, locals) {
               var i = 0,
                   val;
               do {
                  val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals);

                  locals = undefined; // clear after first iteration
                  scope = val;
               } while (i < pathKeysLength);
               return val;
            };
         }
      } else {
         var code = 'var p;\n';
         forEach(pathKeys, function (key, index) {
            ensureSafeMemberName(key, fullExp);
            code += 'if(s == null) return undefined;\n' + 's=' + (index
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

   var ___module__promised__ = {
      Lexer: Lexer,
      Parser: Parser
   };

   return ___module__promised__;
});
realm.module("wires.expressions.AngularExpressions", ["wires.expressions.AngularExpressionParser", "utils.lodash"], function (AngularExpressionParser, _) {

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
         throw new TypeError("src must be a string, instead saw '" + (typeof src === "undefined" ? "undefined" : _typeof(src)) + "'");
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
         throw new TypeError("src must be a string, instead saw '" + (typeof src === "undefined" ? "undefined" : _typeof(src)) + "'");
      }
      var tokens = parser.tokenize(src);
      var variables = {};
      var nested = false;
      var latest;
      for (var i in tokens) {
         var item = tokens[i];

         if (_.isString(item.text) && item.text.match(/[a-z0-9\.$]+/i)) {

            if (nested) {
               if (latest) {
                  if (item.string) {
                     latest.str = item.string;
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

   var ___module__promised__ = {
      Lexer: Lexer,
      Parser: Parser,
      extract: extract,
      compile: compile,
      filters: filters
   };

   return ___module__promised__;
});
realm.module("wires.expressions.StringInterpolation", ["utils.lodash", "wires.expressions.AngularExpressions", "wires.expressions.WatchBatch", "wires.utils.DotNotation"], function (_, AngularExpressions, WatchBatch, DotNotation) {

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
      compile: function compile(lines) {
         if (!_.isArray(lines)) {
            lines = this.parse(lines);
         }
         return function (arg1, arg2, arg3, instant) {
            var $scope = arg1 || {};
            var $locals = arg3 ? arg2 : {};
            var cb = arguments.length >= 3 ? arg3 : arg2;

            var watchable = _.chain(lines).map(function (item) {
               return item.v || false;
            }).compact().value();
            if (watchable.length === 0) {
               return cb(lines.join(''));
            }
            var oldValue;
            var trigger = function trigger() {
               var strings = _.map(lines, function (item) {
                  return item.e ? AngularExpressions.compile(item.e)($scope, $locals) : item;
               });
               var value = strings.join('');
               cb(value, oldValue);
               oldValue = value;
            };
            if (instant) {
               trigger();
            }
            return WatchBatch({
               locals: $locals,
               scope: $scope,
               batch: watchable
            }, trigger);
         };
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
      parse: function parse(str) {
         if (!_.isString(str)) {
            return [];
         }
         var re = /({{\s*[^}]+\s*}})/g;
         var list = str.split(re).map(function (x) {
            var expr;
            if (expr = x.match(/{{\s*([^}]+)\s*}}/)) {
               var expressionString = expr[1].trim();
               return {
                  e: expressionString,
                  v: AngularExpressions.extract(expressionString)
               };
            }
            return x;
         });
         return _.filter(list, function (x) {
            return x ? x : undefined;
         });
      }
   };

   var ___module__promised__ = StringInterpolation;

   return ___module__promised__;
});
realm.module("wires.expressions.WatchBatch", ["utils.lodash", "wires.AsyncWatch", "wires.utils.DotNotation"], function (_, AsyncWatch, DotNotation) {

   var ___module__promised__ = function ___module__promised__(opts, cb) {
      opts = opts || {};
      var $locals = opts.locals || {};
      var $scope = opts.scope || {};

      var batch = opts.batch ? [].concat(opts.batch) : [];

      var paths = [];

      _.each(batch, function (item) {
         var key = _.keys(item)[0];
         var prop = item[key];
         paths.push(key);
      });
      var a = false;

      var anyValueChanged = function anyValueChanged(value) {};

      var watchers = [];
      // collecting watchers
      _.each(paths, function (path) {

         if (DotNotation.hasProperty($locals, path)) {
            watchers.push(AsyncWatch($locals, path, anyValueChanged));
         } else {
            watchers.push(AsyncWatch($scope, path, anyValueChanged));
         }
      });
      watchers = _.compact(watchers);

      return watchers.length && cb ? AsyncWatch.subscribe(watchers, cb) : {}; //
   };

   return ___module__promised__;
});
realm.module("wires.runtime.Directives", ["realm"], function (realm) {

   var ___module__promised__ = realm.requirePackage('wires.directives');

   return ___module__promised__;
});
realm.module("wires.runtime.Schema", ["utils.lodash"], function (_) {
   var data = {};

   var ___module__promised__ = realm.requirePackage('wires.schema').then(function (items) {
      var schemas = {};

      _.each(items, function (packg) {
         schemas = _.merge(schemas, packg);
      });
      return schemas;
   });

   return ___module__promised__;
});
realm.module("wires.services.Watch", ["wires.expressions.AngularExpressions", "wires.expressions.WatchBatch", "utils.lodash"], function (AngularExpressions, WatchBatch, _) {

   var Watch = function Watch(o, expression, fn, instant) {
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
      }, function (changes) {
         var result = model(scope, locals);

         fn(result, oldValue, changes);
         oldValue = result;
      });
   };
   var ___module__promised__ = Watch;

   return ___module__promised__;
});
realm.module("wires.utils.DotNotation", ["wires.AsyncWatch"], function (AsyncWatch) {

   var DotNotation = {
      nextTick: function nextTick(cb) {
         return isNode ? process.nextTick(cb) : window.requestAnimationFrame(cb);
      },
      dotNotation: function dotNotation(path) {
         if (path instanceof Array) {
            return {
               path: path,
               str: path.join('.')
            };
         }
         if (typeof path !== 'string') {
            return;
         }
         return {
            path: path.split('\.'),
            str: path
         };
      },
      hasProperty: function hasProperty(obj, path) {
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
      getPropertyValue: function getPropertyValue(obj, path) {

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
   };
   var ___module__promised__ = DotNotation;

   return ___module__promised__;
});
realm.module("wires.utils.Properties", [], function () {
   var Properties = function () {
      function Properties() {
         _classCallCheck(this, Properties);
      }

      _createClass(Properties, null, [{
         key: "defineHidden",
         value: function defineHidden(obj, key, value) {
            Object.defineProperty(obj, key, {
               enumerable: false,
               value: value
            });
            return obj;
         }
      }]);

      return Properties;
   }();

   var ___module__promised__ = Properties;

   return ___module__promised__;
});
realm.module("wires.utils.UniversalQuery", [], function () {

   /**
    * Universal "jQuery"
    * For backend we use cheerio
    * For Browser jQuery to Zepto
    */
   var ___module__promised__ = function () {
      function ___module__promised__() {
         _classCallCheck(this, ___module__promised__);
      }

      _createClass(___module__promised__, null, [{
         key: "init",
         value: function init(html) {
            html = "<div>" + html + "</div>";
            if (isNode) {
               var cheerio = require("cheerio");
               var $ = cheerio.load(html);
               return $("div").first();
            }
            if (!window.$) {
               console.error("jQuery or Zepto is required!");
            }
            var first = window.$("<div>" + html + "</div>").find("div:first");

            return first;
         }
      }]);

      return ___module__promised__;
   }();

   return ___module__promised__;
});
realm.module("wires.directives.Click", ["wires.core.Directive"], function (Directive) {
   var Click = function (_Directive) {
      _inherits(Click, _Directive);

      function Click() {
         _classCallCheck(this, Click);

         return _possibleConstructorReturn(this, Object.getPrototypeOf(Click).apply(this, arguments));
      }

      _createClass(Click, [{
         key: "initialize",
         value: function initialize(attr) {

            var callback = attr.asFunction();
            var scope = this.element.scope;
            this.element.bindEvent("click", function () {
               callback.bind(scope)({
                  event: event
               });
            });
         }
      }], [{
         key: "compiler",
         get: function get() {
            return {
               name: 'ng-click'
            };
         }
      }]);

      return Click;
   }(Directive);

   var ___module__promised__ = Click;

   return ___module__promised__;
});
realm.module("wires.directives.Conditional", ["wires.core.Directive"], function (Directive) {
   var Conditional = function (_Directive2) {
      _inherits(Conditional, _Directive2);

      function Conditional() {
         _classCallCheck(this, Conditional);

         return _possibleConstructorReturn(this, Object.getPrototypeOf(Conditional).apply(this, arguments));
      }

      _createClass(Conditional, [{
         key: "initialize",
         value: function initialize(attr) {
            var self = this;
            var el = this.element;
            this.$initialized = false;
            attr.watchExpression(function (value) {
               value ? self.createNodes() : self.removeNodes();
            }, true);
         }
      }, {
         key: "removeNodes",
         value: function removeNodes() {
            if (this.clone) {
               this.clone.remove();
            }

            // if (this.$initialized) {
            //    this.clone.detachElement();
            // }
         }
      }, {
         key: "createNodes",
         value: function createNodes() {
            var self = this;
            // if (this.$initialized) {
            //    return this.clone.insertAfter(this.element);;
            // }
            // this.$initialized = true;
            this.clone = this.element.clone();
            this.clone.schema.detachAttribute("ng-if");
            this.clone.create();
            this.clone.insertAfter(this.element);
            this.clone.initialize();
         }
      }], [{
         key: "compiler",
         get: function get() {
            return {
               name: 'ng-if',
               type: 'attribute',
               attribute: {
                  placeholder: true
               }
            };
         }
      }]);

      return Conditional;
   }(Directive);

   var ___module__promised__ = Conditional;

   return ___module__promised__;
});
realm.module("wires.directives.IncludeView", ["wires.core.Directive", "wires.runtime.Schema"], function (Directive, userSchemas) {
   var IncludeView = function (_Directive3) {
      _inherits(IncludeView, _Directive3);

      function IncludeView() {
         _classCallCheck(this, IncludeView);

         return _possibleConstructorReturn(this, Object.getPrototypeOf(IncludeView).apply(this, arguments));
      }

      _createClass(IncludeView, [{
         key: "initialize",
         value: function initialize(attr) {

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
               attr.watchString(function (fname) {
                  if (self.inflated) {
                     self.element.removeChildren();
                  }
                  if (userSchemas[fname]) {
                     self.createSchema(userSchemas[fname]);
                  }
               }, true);
            }
         }
      }, {
         key: "createSchema",
         value: function createSchema(json) {
            this.element.inflate(json);
         }
      }], [{
         key: "compiler",
         get: function get() {
            return {
               name: 'ng-include'
            };
         }
      }]);

      return IncludeView;
   }(Directive);

   var ___module__promised__ = IncludeView;

   return ___module__promised__;
});
realm.module("wires.directives.Model", ["wires.expressions.AngularExpressions", "wires.core.Directive"], function (AngularExpressions, Directive) {
   var Model = function (_Directive4) {
      _inherits(Model, _Directive4);

      function Model() {
         _classCallCheck(this, Model);

         return _possibleConstructorReturn(this, Object.getPrototypeOf(Model).apply(this, arguments));
      }

      _createClass(Model, [{
         key: "initialize",
         value: function initialize(attr) {
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

            attr.watchExpression(function (value) {
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
               this.bindEvent("keyup", function () {
                  attr.assign(el.value);
               });
            }
            // checkbox
            if (type === "checkbox") {
               this.bindEvent("click", function () {
                  attr.assign(el.checked);
               });
            }
            // select
            if (type === "select") {
               this.bindEvent("change", function () {
                  attr.assign(el.value);
               });
            }
            if (type === "radio") {
               this.bindEvent("click", function () {
                  attr.assign(el.value);
               });
            }
         }
      }], [{
         key: "compiler",
         get: function get() {
            return {
               name: 'ng-model'
            };
         }
      }]);

      return Model;
   }(Directive);

   var ___module__promised__ = Model;

   return ___module__promised__;
});
realm.module("wires.directives.MyDirective", ["wires.core.Directive"], function (Directive) {
   var MyDirective = function (_Directive5) {
      _inherits(MyDirective, _Directive5);

      function MyDirective() {
         _classCallCheck(this, MyDirective);

         return _possibleConstructorReturn(this, Object.getPrototypeOf(MyDirective).apply(this, arguments));
      }

      _createClass(MyDirective, [{
         key: "initialize",
         value: function initialize() {
            this.myName = "This is my name";
         }
      }], [{
         key: "compiler",
         get: function get() {
            return {
               name: 'my-directive',
               schema: 'other/my-directive.html'
            };
         }
      }]);

      return MyDirective;
   }(Directive);

   var ___module__promised__ = MyDirective;

   return ___module__promised__;
});
realm.module("wires.directives.Show", ["wires.core.Directive"], function (Directive) {
   var Show = function (_Directive6) {
      _inherits(Show, _Directive6);

      function Show() {
         _classCallCheck(this, Show);

         return _possibleConstructorReturn(this, Object.getPrototypeOf(Show).apply(this, arguments));
      }

      _createClass(Show, [{
         key: "initialize",
         value: function initialize() {
            var self = this;
            var el = this.element;
            var attr = el.attrs['ng-show'];

            attr.watchExpression(function (value, oldValue, changes) {
               if (value) {
                  self.show();
               } else {
                  self.hide();
               }
            }, true);
         }
      }, {
         key: "hide",
         value: function hide() {
            this.element.hide();
         }
      }, {
         key: "show",
         value: function show() {
            this.element.show();
         }
      }], [{
         key: "compiler",
         get: function get() {
            return {
               name: 'ng-show'
            };
         }
      }]);

      return Show;
   }(Directive);

   var ___module__promised__ = Show;

   return ___module__promised__;
});
realm.module("wires.directives.ToggleClass", ["wires.core.Directive"], function (Directive) {
   var ToggleClass = function (_Directive7) {
      _inherits(ToggleClass, _Directive7);

      _createClass(ToggleClass, null, [{
         key: "compiler",
         get: function get() {
            return {
               name: 'ng-class'
            };
         }
      }]);

      function ToggleClass() {
         _classCallCheck(this, ToggleClass);

         return _possibleConstructorReturn(this, Object.getPrototypeOf(ToggleClass).call(this));
      }

      _createClass(ToggleClass, [{
         key: "initialize",
         value: function initialize($parent, attrs) {}
      }]);

      return ToggleClass;
   }(Directive);

   var ___module__promised__ = ToggleClass;

   return ___module__promised__;
});
realm.module("wires.directives.Transclude", ["wires.core.Directive"], function (Directive) {
   var Transclude = function (_Directive8) {
      _inherits(Transclude, _Directive8);

      function Transclude() {
         _classCallCheck(this, Transclude);

         return _possibleConstructorReturn(this, Object.getPrototypeOf(Transclude).apply(this, arguments));
      }

      _createClass(Transclude, [{
         key: "initialize",
         value: function initialize() {
            if (this.element.scope.$$transcluded) {
               // swap children to transclusion
               this.element.schema.children = this.element.scope.$$transcluded;
            }
         }
      }, {
         key: "hide",
         value: function hide() {
            this.element.hide();
         }
      }, {
         key: "show",
         value: function show() {
            this.element.show();
         }
      }], [{
         key: "compiler",
         get: function get() {
            return {
               name: 'ng-transclude'
            };
         }
      }]);

      return Transclude;
   }(Directive);

   var ___module__promised__ = Transclude;

   return ___module__promised__;
});
})(typeof exports !== 'undefined', typeof exports !== 'undefined' ? require('realm-js') : window.realm)