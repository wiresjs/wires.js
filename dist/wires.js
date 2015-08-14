var isarray = _.isArray;

(function() {
   /**
    * Expose `pathToRegexp`.
    */
   /*window.pathToRegexp = {
      pathToRegexp : pathToRegexp,
      parse : parse,
      compile : compile,
      tokensToFunction : tokensToFunction,
      tokensToRegExp = tokensToRegExp
   }*/
   window.pathToRegexp = pathToRegexp;


   /**
    * The main path matching regexp utility.
    *
    * @type {RegExp}
    */
   var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
   ].join('|'), 'g')

   /**
    * Parse a string for the raw tokens.
    *
    * @param  {String} str
    * @return {Array}
    */
   function parse(str) {
      var tokens = []
      var key = 0
      var index = 0
      var path = ''
      var res

      while ((res = PATH_REGEXP.exec(str)) != null) {
         var m = res[0]
         var escaped = res[1]
         var offset = res.index
         path += str.slice(index, offset)
         index = offset + m.length

         // Ignore already escaped sequences.
         if (escaped) {
            path += escaped[1]
            continue
         }

         // Push the current path onto the tokens.
         if (path) {
            tokens.push(path)
            path = ''
         }

         var prefix = res[2]
         var name = res[3]
         var capture = res[4]
         var group = res[5]
         var suffix = res[6]
         var asterisk = res[7]

         var repeat = suffix === '+' || suffix === '*'
         var optional = suffix === '?' || suffix === '*'
         var delimiter = prefix || '/'
         var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

         tokens.push({
            name: name || key++,
            prefix: prefix || '',
            delimiter: delimiter,
            optional: optional,
            repeat: repeat,
            pattern: escapeGroup(pattern)
         })
      }

      // Match any characters still remaining.
      if (index < str.length) {
         path += str.substr(index)
      }

      // If the path exists, push it onto the end.
      if (path) {
         tokens.push(path)
      }

      return tokens
   }

   /**
    * Compile a string to a template function for the path.
    *
    * @param  {String}   str
    * @return {Function}
    */
   function compile(str) {
      return tokensToFunction(parse(str))
   }

   /**
    * Expose a method for transforming tokens into the path function.
    */
   function tokensToFunction(tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length)

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
         if (typeof tokens[i] === 'object') {
            matches[i] = new RegExp('^' + tokens[i].pattern + '$')
         }
      }

      return function(obj) {
         var path = ''

         obj = obj || {}

         for (var i = 0; i < tokens.length; i++) {
            var key = tokens[i]

            if (typeof key === 'string') {
               path += key

               continue
            }

            var value = obj[key.name]

            if (value == null) {
               if (key.optional) {
                  continue
               } else {
                  throw new TypeError('Expected "' + key.name + '" to be defined')
               }
            }

            if (isarray(value)) {
               if (!key.repeat) {
                  throw new TypeError('Expected "' + key.name + '" to not repeat')
               }

               if (value.length === 0) {
                  if (key.optional) {
                     continue
                  } else {
                     throw new TypeError('Expected "' + key.name + '" to not be empty')
                  }
               }

               for (var j = 0; j < value.length; j++) {
                  if (!matches[i].test(value[j])) {
                     throw new TypeError('Expected all "' + key.name + '" to match "' + key.pattern + '"')
                  }

                  path += (j === 0 ? key.prefix : key.delimiter) + encodeURIComponent(value[j])
               }

               continue
            }

            if (!matches[i].test(value)) {
               throw new TypeError('Expected "' + key.name + '" to match "' + key.pattern + '"')
            }

            path += key.prefix + encodeURIComponent(value)
         }

         return path
      }
   }

   /**
    * Escape a regular expression string.
    *
    * @param  {String} str
    * @return {String}
    */
   function escapeString(str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
   }

   /**
    * Escape the capturing group by escaping special characters and meaning.
    *
    * @param  {String} group
    * @return {String}
    */
   function escapeGroup(group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
   }

   /**
    * Attach the keys as a property of the regexp.
    *
    * @param  {RegExp} re
    * @param  {Array}  keys
    * @return {RegExp}
    */
   function attachKeys(re, keys) {
      re.keys = keys
      return re
   }

   /**
    * Get the flags for a regexp from the options.
    *
    * @param  {Object} options
    * @return {String}
    */
   function flags(options) {
      return options.sensitive ? '' : 'i'
   }

   /**
    * Pull out keys from a regexp.
    *
    * @param  {RegExp} path
    * @param  {Array}  keys
    * @return {RegExp}
    */
   function regexpToRegexp(path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g)

      if (groups) {
         for (var i = 0; i < groups.length; i++) {
            keys.push({
               name: i,
               prefix: null,
               delimiter: null,
               optional: false,
               repeat: false,
               pattern: null
            })
         }
      }

      return attachKeys(path, keys)
   }

   /**
    * Transform an array into a regexp.
    *
    * @param  {Array}  path
    * @param  {Array}  keys
    * @param  {Object} options
    * @return {RegExp}
    */
   function arrayToRegexp(path, keys, options) {
      var parts = []

      for (var i = 0; i < path.length; i++) {
         parts.push(pathToRegexp(path[i], keys, options).source)
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

      return attachKeys(regexp, keys)
   }

   /**
    * Create a path regexp from string input.
    *
    * @param  {String} path
    * @param  {Array}  keys
    * @param  {Object} options
    * @return {RegExp}
    */
   function stringToRegexp(path, keys, options) {
      var tokens = parse(path)
      var re = tokensToRegExp(tokens, options)

      // Attach keys back to the regexp.
      for (var i = 0; i < tokens.length; i++) {
         if (typeof tokens[i] !== 'string') {
            keys.push(tokens[i])
         }
      }

      return attachKeys(re, keys)
   }

   /**
    * Expose a function for taking tokens and returning a RegExp.
    *
    * @param  {Array}  tokens
    * @param  {Array}  keys
    * @param  {Object} options
    * @return {RegExp}
    */
   function tokensToRegExp(tokens, options) {
      options = options || {}

      var strict = options.strict
      var end = options.end !== false
      var route = ''
      var lastToken = tokens[tokens.length - 1]
      var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
         var token = tokens[i]

         if (typeof token === 'string') {
            route += escapeString(token)
         } else {
            var prefix = escapeString(token.prefix)
            var capture = token.pattern

            if (token.repeat) {
               capture += '(?:' + prefix + capture + ')*'
            }

            if (token.optional) {
               if (prefix) {
                  capture = '(?:' + prefix + '(' + capture + '))?'
               } else {
                  capture = '(' + capture + ')?'
               }
            } else {
               capture = prefix + '(' + capture + ')'
            }

            route += capture
         }
      }

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
         route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
      }

      if (end) {
         route += '$'
      } else {
         // In non-ending mode, we need the capturing groups to match as much as
         // possible by using a positive lookahead to the end or next path segment.
         route += strict && endsWithSlash ? '' : '(?=\\/|$)'
      }

      return new RegExp('^' + route, flags(options))
   }

   /**
    * Normalize the given path string, returning a regular expression.
    *
    * An empty array can be passed in for the keys, which will hold the
    * placeholder key descriptions. For example, using `/user/:id`, `keys` will
    * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
    *
    * @param  {(String|RegExp|Array)} path
    * @param  {Array}                 [keys]
    * @param  {Object}                [options]
    * @return {RegExp}
    */
   function pathToRegexp(path, keys, options) {
      keys = keys || []

      if (!isarray(keys)) {
         options = keys
         keys = []
      } else if (!options) {
         options = {}
      }

      if (path instanceof RegExp) {
         return regexpToRegexp(path, keys, options)
      }

      if (isarray(path)) {
         return arrayToRegexp(path, keys, options)
      }

      return stringToRegexp(path, keys, options)
   }

})();

var Wires = Wires || {};
(function() {
	var extend = function(protoProps, staticProps) {
		var parent = this;
		var child;
		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if (protoProps && _.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function() {
				return parent.apply(this, arguments);
			};
		}
		// Add static properties to the constructor function, if supplied.
		_.extend(child, parent, staticProps);
		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function() {
			this.constructor = child;
		};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;
		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps)
			_.extend(child.prototype, protoProps);
		// Set a convenience property in case the parent's prototype is needed
		// later.
		child.__super__ = parent.prototype;
		// Providing a method that can call a parent's method
		child.prototype.__parent__ = function(method, args) {
			child.__super__[method].apply(child.prototype, args);
		};
		return child;
	};
	var Class = function(protoProps, staticProps) {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};
	Class.extend = extend;
	// _.extend(Class.prototype, Wires.Events);
	Wires.Class = Class;
})();

(function e(t, n, r) {
   function s(o, u) {
      if (!n[o]) {
         if (!t[o]) {
            var a = typeof require == "function" && require;
            if (!u && a) return a(o, !0);
            if (i) return i(o, !0);
            var f = new Error("Cannot find module '" + o + "'");
            throw f.code = "MODULE_NOT_FOUND", f;
         }
         var l = n[o] = {
            exports: {}
         };
         t[o][0].call(l.exports, function(e) {
            var n = t[o][1][e];
            return s(n ? n : e);
         }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
   }
   var i = typeof require == "function" && require;
   for (var o = 0; o < r.length; o++) s(r[o]);
   return s;
})({
   1: [function(require, module, exports) {
      var process = module.exports = {};
      process.nextTick = function() {
         var canSetImmediate = typeof window !== "undefined" && window.setImmediate;
         var canPost = typeof window !== "undefined" && window.postMessage && window.addEventListener;
         if (canSetImmediate) {
            return function(f) {
               return window.setImmediate(f);
            };
         }
         if (canPost) {
            var queue = [];
            window.addEventListener("message", function(ev) {
               var source = ev.source;
               if ((source === window || source === null) && ev.data === "process-tick") {
                  ev.stopPropagation();
                  if (queue.length > 0) {
                     var fn = queue.shift();
                     fn();
                  }
               }
            }, true);
            return function nextTick(fn) {
               queue.push(fn);
               window.postMessage("process-tick", "*");
            };
         }
         return function nextTick(fn) {
            setTimeout(fn, 0);
         };
      }();
      process.title = "browser";
      process.browser = true;
      process.env = {};
      process.argv = [];

      function noop() {}
      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.binding = function(name) {
         throw new Error("process.binding is not supported");
      };
      process.cwd = function() {
         return "/";
      };
      process.chdir = function(dir) {
         throw new Error("process.chdir is not supported");
      };
   }, {}],
   2: [function(require, module, exports) {
      "use strict";
      var asap = require("asap");
      module.exports = Promise;

      function Promise(fn) {
         if (typeof this !== "object") throw new TypeError("Promises must be constructed via new");
         if (typeof fn !== "function") throw new TypeError("not a function");
         var state = null;
         var value = null;
         var deferreds = [];
         var self = this;
         this.then = function(onFulfilled, onRejected) {
            return new self.constructor(function(resolve, reject) {
               handle(new Handler(onFulfilled, onRejected, resolve, reject));
            });
         };

         function handle(deferred) {
            if (state === null) {
               deferreds.push(deferred);
               return;
            }
            asap(function() {
               var cb = state ? deferred.onFulfilled : deferred.onRejected;
               if (cb === null) {
                  (state ? deferred.resolve : deferred.reject)(value);
                  return;
               }
               var ret;
               try {
                  ret = cb(value);
               } catch (e) {
                  deferred.reject(e);
                  return;
               }
               deferred.resolve(ret);
            });
         }

         function resolve(newValue) {
            try {
               if (newValue === self) throw new TypeError("A promise cannot be resolved with itself.");
               if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
                  var then = newValue.then;
                  if (typeof then === "function") {
                     doResolve(then.bind(newValue), resolve, reject);
                     return;
                  }
               }
               state = true;
               value = newValue;
               finale();
            } catch (e) {
               reject(e);
            }
         }

         function reject(newValue) {
            state = false;
            value = newValue;
            finale();
         }

         function finale() {
            for (var i = 0, len = deferreds.length; i < len; i++) handle(deferreds[i]);
            deferreds = null;
         }
         doResolve(fn, resolve, reject);
      }

      function Handler(onFulfilled, onRejected, resolve, reject) {
         this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
         this.onRejected = typeof onRejected === "function" ? onRejected : null;
         this.resolve = resolve;
         this.reject = reject;
      }

      function doResolve(fn, onFulfilled, onRejected) {
         var done = false;
         try {
            fn(function(value) {
               if (done) return;
               done = true;
               onFulfilled(value);
            }, function(reason) {
               if (done) return;
               done = true;
               onRejected(reason);
            });
         } catch (ex) {
            if (done) return;
            done = true;
            onRejected(ex);
         }
      }
   }, {
      asap: 4
   }],
   3: [function(require, module, exports) {
      "use strict";
      var Promise = require("./core.js");
      var asap = require("asap");
      module.exports = Promise;

      function ValuePromise(value) {
         this.then = function(onFulfilled) {
            if (typeof onFulfilled !== "function") return this;
            return new Promise(function(resolve, reject) {
               asap(function() {
                  try {
                     resolve(onFulfilled(value));
                  } catch (ex) {
                     reject(ex);
                  }
               });
            });
         };
      }
      ValuePromise.prototype = Promise.prototype;
      var TRUE = new ValuePromise(true);
      var FALSE = new ValuePromise(false);
      var NULL = new ValuePromise(null);
      var UNDEFINED = new ValuePromise(undefined);
      var ZERO = new ValuePromise(0);
      var EMPTYSTRING = new ValuePromise("");
      Promise.resolve = function(value) {
         if (value instanceof Promise) return value;
         if (value === null) return NULL;
         if (value === undefined) return UNDEFINED;
         if (value === true) return TRUE;
         if (value === false) return FALSE;
         if (value === 0) return ZERO;
         if (value === "") return EMPTYSTRING;
         if (typeof value === "object" || typeof value === "function") {
            try {
               var then = value.then;
               if (typeof then === "function") {
                  return new Promise(then.bind(value));
               }
            } catch (ex) {
               return new Promise(function(resolve, reject) {
                  reject(ex);
               });
            }
         }
         return new ValuePromise(value);
      };
      Promise.all = function(arr) {
         var args = Array.prototype.slice.call(arr);
         return new Promise(function(resolve, reject) {
            if (args.length === 0) return resolve([]);
            var remaining = args.length;

            function res(i, val) {
               try {
                  if (val && (typeof val === "object" || typeof val === "function")) {
                     var then = val.then;
                     if (typeof then === "function") {
                        then.call(val, function(val) {
                           res(i, val);
                        }, reject);
                        return;
                     }
                  }
                  args[i] = val;
                  if (--remaining === 0) {
                     resolve(args);
                  }
               } catch (ex) {
                  reject(ex);
               }
            }
            for (var i = 0; i < args.length; i++) {
               res(i, args[i]);
            }
         });
      };
      Promise.reject = function(value) {
         return new Promise(function(resolve, reject) {
            reject(value);
         });
      };
      Promise.race = function(values) {
         return new Promise(function(resolve, reject) {
            values.forEach(function(value) {
               Promise.resolve(value).then(resolve, reject);
            });
         });
      };
      Promise.prototype["catch"] = function(onRejected) {
         return this.then(null, onRejected);
      };
   }, {
      "./core.js": 2,
      asap: 4
   }],
   4: [function(require, module, exports) {
      (function(process) {
         var head = {
            task: void 0,
            next: null
         };
         var tail = head;
         var flushing = false;
         var requestFlush = void 0;
         var isNodeJS = false;

         function flush() {
            while (head.next) {
               head = head.next;
               var task = head.task;
               head.task = void 0;
               var domain = head.domain;
               if (domain) {
                  head.domain = void 0;
                  domain.enter();
               }
               try {
                  task();
               } catch (e) {
                  if (isNodeJS) {
                     if (domain) {
                        domain.exit();
                     }
                     setTimeout(flush, 0);
                     if (domain) {
                        domain.enter();
                     }
                     throw e;
                  } else {
                     setTimeout(function() {
                        throw e;
                     }, 0);
                  }
               }
               if (domain) {
                  domain.exit();
               }
            }
            flushing = false;
         }
         if (typeof process !== "undefined" && process.nextTick) {
            isNodeJS = true;
            requestFlush = function() {
               process.nextTick(flush);
            };
         } else if (typeof setImmediate === "function") {
            if (typeof window !== "undefined") {
               requestFlush = setImmediate.bind(window, flush);
            } else {
               requestFlush = function() {
                  setImmediate(flush);
               };
            }
         } else if (typeof MessageChannel !== "undefined") {
            var channel = new MessageChannel();
            channel.port1.onmessage = flush;
            requestFlush = function() {
               channel.port2.postMessage(0);
            };
         } else {
            requestFlush = function() {
               setTimeout(flush, 0);
            };
         }

         function asap(task) {
            tail = tail.next = {
               task: task,
               domain: isNodeJS && process.domain,
               next: null
            };
            if (!flushing) {
               flushing = true;
               requestFlush();
            }
         }
         module.exports = asap;
      }).call(this, require("_process"));
   }, {
      _process: 1
   }],
   5: [function(require, module, exports) {
      if (typeof Promise.prototype.done !== "function") {
         Promise.prototype.done = function(onFulfilled, onRejected) {
            var self = arguments.length ? this.then.apply(this, arguments) : this;
            self.then(null, function(err) {
               setTimeout(function() {
                  throw err;
               }, 0);
            });
         };
      }
   }, {}],
   6: [function(require, module, exports) {
      var asap = require("asap");
      if (typeof Promise === "undefined") {
         Promise = require("./lib/core.js");
         require("./lib/es6-extensions.js");
      }
      require("./polyfill-done.js");
   }, {
      "./lib/core.js": 2,
      "./lib/es6-extensions.js": 3,
      "./polyfill-done.js": 5,
      asap: 4
   }]
}, {}, [6]);
//# sourceMappingURL=/polyfills/promise-6.1.0.js.map
;(function(w) {

   function getParamNames(func) {
      var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
      var ARGUMENT_NAMES = /([^\s,]+)/g;
      var fnStr = func.toString().replace(STRIP_COMMENTS, '');
      var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if (result === null)
         result = [];
      return result;
   }
   var services = {};
   w.domain = {
      constructModel: function(avialableServices, functionResult, done) {
         var domainModelInstance = new functionResult();
         this.require({
            source: functionResult.prototype.init,
            target: domainModelInstance["init"],
            instance: domainModelInstance
         }, avialableServices).then(function(result) {
            done(null, domainModelInstance)
         }).catch(function(e) {
            done(e);
         })
      },
      getInputArguments: function(args) {
         var out = {};
         out.localServices = {};
         if (args.length > 0) {
            out.source = args[0];
            out.target = args[0];
            if (_.isPlainObject(args[0])) {
               var opts = args[0];
               out.target = opts.target
               out.source = opts.source
               out.instance = opts.instance
            }

            // call(func, callback)
            if (args.length > 1) {
               var argsDefined = _.isString(args[0]) || _.isArray(args[0])
               if (argsDefined) {
                  if (_.isArray(args[0])) {
                     out.source = args[0];
                  } else {
                     out.source = _.isString(args[0]) ? [args[0]] : args[0]
                  }
                  if ( _.isFunction(args[1]) ){
                     out.target = args[1]
                  }
                  if ( _.isFunction(args[2]) ){
                     out.target = args[2]
                  }
               } else {

                  if (_.isFunction(args[1])) {
                     out.callReady = args[1];
                  }
                  if (_.isPlainObject(args[1])) {
                     out.localServices = args[1];
                  }
               }
            }
            if (args.length === 3) {
               if (_.isPlainObject(args[1])) {
                  out.localServices = args[1];
               }
               if (_.isFunction(args[2])) {
                  out.callReady = args[2]
               }

            }
         }
         out.target = out.target || function() {}
         out.source = out.source ? out.source : out.target;
         out.callReady = out.callReady || function() {};

         return out;

      },
      service : function(){
         this.register.apply(this, arguments);
      },
      register: function(name, arg1, arg2) {
         var localArgs = null;
         var target = arg1;
         if (_.isArray(arg1)) {
            localArgs = arg1;
            target = arg2;
         }
         services[name] = {
            target: target,
            args: localArgs
         }
      },
      requirePackage : function(name){
         var _packageServices = {}

         return this.each(services, function(service, serviceName){

            var _package = serviceName.split(".")[0]
            if ( _package === name){
               return domain.require([serviceName], function(serviceInstance){
                  _packageServices[serviceName] = serviceInstance
               })
            }
         }).then(function(){
            return _packageServices;
         })
      },
      require: function() {
         var data = this.getInputArguments(arguments);
         var self = this;
         var localServices = data.localServices;
         var variables = _.isArray(data.source) ? data.source : getParamNames(data.source);
         var target = data.target;
         var callReady = data.callReady;
         var instance = data.instance;
         var globalServices = services;
         var self = this;
         var resultPromise = new Promise(function(resolve, reject) {
            var args = [];

            var avialableServices = _.merge(localServices, globalServices);
            for (var i in variables) {
               var v = variables[i];

               var variableName = variables[i];
               if (!avialableServices[variableName]) {
                  console.error("Error while injecting variable '" + variableName + "' into function \n" +
                     data.source.toString());
                  return reject({
                     status: 500,
                     message: "Service with name '" + variableName + "' was not found "
                  });
               }

               args.push(avialableServices[variableName]);

            }
            var results = [];

            return self.each(args, function(item){
               var argService = item.target;
               var requiredArgs = item.args;
               if (_.isFunction(argService)) {
                  var promised;
                  var currentArgs = [];
                  if (requiredArgs) {
                     currentArgs = [requiredArgs, localServices, argService ]
                  } else {
                     currentArgs = [argService, localServices]
                  }
                  return self.require.apply(self, currentArgs)
               } else {
                  return argService;
               }
            }).then(function(results){
               delete self;
               return target.apply(instance || results, results);
            }).then(resolve).catch(reject);
         })
         return resultPromise;
      },
      isServiceRegistered: function(name) {
         return services[name] !== undefined;
      },
      each: function(args, cb) {
         return new Promise(function(resolve, reject){
            var callbacks = [];
            var results = [];
            var isObject = _.isPlainObject(args);
            var index = -1;
            var iterate = function(){
               index++;
               if ( index < _.size(args) ){
                  var key;
                  var value;
                  if (isObject){
                     key = _.keys(args)[index];
                     value = args[key];
                  } else {
                     key = index;
                     value = args[index];
                  }
                  var res = cb.call(cb, value, key);
                  if ( res instanceof Promise ){
                     res.then(function(a){
                        results.push(a)
                        iterate();
                     }).catch(reject)
                  } else {
                     results.push(res)
                     iterate();
                  }
               } else {
                  return resolve(results)
               }
            }
            iterate();
         })
      }
   }
})(window);

/*! VelocityJS.org (1.2.2). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */
!function(e){function t(e){var t=e.length,r=$.type(e);return"function"===r||$.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===r||0===t||"number"==typeof t&&t>0&&t-1 in e}if(!e.jQuery){var $=function(e,t){return new $.fn.init(e,t)};$.isWindow=function(e){return null!=e&&e==e.window},$.type=function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?a[o.call(e)]||"object":typeof e},$.isArray=Array.isArray||function(e){return"array"===$.type(e)},$.isPlainObject=function(e){var t;if(!e||"object"!==$.type(e)||e.nodeType||$.isWindow(e))return!1;try{if(e.constructor&&!n.call(e,"constructor")&&!n.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}for(t in e);return void 0===t||n.call(e,t)},$.each=function(e,r,a){var n,o=0,i=e.length,s=t(e);if(a){if(s)for(;i>o&&(n=r.apply(e[o],a),n!==!1);o++);else for(o in e)if(n=r.apply(e[o],a),n===!1)break}else if(s)for(;i>o&&(n=r.call(e[o],o,e[o]),n!==!1);o++);else for(o in e)if(n=r.call(e[o],o,e[o]),n===!1)break;return e},$.data=function(e,t,a){if(void 0===a){var n=e[$.expando],o=n&&r[n];if(void 0===t)return o;if(o&&t in o)return o[t]}else if(void 0!==t){var n=e[$.expando]||(e[$.expando]=++$.uuid);return r[n]=r[n]||{},r[n][t]=a,a}},$.removeData=function(e,t){var a=e[$.expando],n=a&&r[a];n&&$.each(t,function(e,t){delete n[t]})},$.extend=function(){var e,t,r,a,n,o,i=arguments[0]||{},s=1,l=arguments.length,u=!1;for("boolean"==typeof i&&(u=i,i=arguments[s]||{},s++),"object"!=typeof i&&"function"!==$.type(i)&&(i={}),s===l&&(i=this,s--);l>s;s++)if(null!=(n=arguments[s]))for(a in n)e=i[a],r=n[a],i!==r&&(u&&r&&($.isPlainObject(r)||(t=$.isArray(r)))?(t?(t=!1,o=e&&$.isArray(e)?e:[]):o=e&&$.isPlainObject(e)?e:{},i[a]=$.extend(u,o,r)):void 0!==r&&(i[a]=r));return i},$.queue=function(e,r,a){function n(e,r){var a=r||[];return null!=e&&(t(Object(e))?!function(e,t){for(var r=+t.length,a=0,n=e.length;r>a;)e[n++]=t[a++];if(r!==r)for(;void 0!==t[a];)e[n++]=t[a++];return e.length=n,e}(a,"string"==typeof e?[e]:e):[].push.call(a,e)),a}if(e){r=(r||"fx")+"queue";var o=$.data(e,r);return a?(!o||$.isArray(a)?o=$.data(e,r,n(a)):o.push(a),o):o||[]}},$.dequeue=function(e,t){$.each(e.nodeType?[e]:e,function(e,r){t=t||"fx";var a=$.queue(r,t),n=a.shift();"inprogress"===n&&(n=a.shift()),n&&("fx"===t&&a.unshift("inprogress"),n.call(r,function(){$.dequeue(r,t)}))})},$.fn=$.prototype={init:function(e){if(e.nodeType)return this[0]=e,this;throw new Error("Not a DOM node.")},offset:function(){var t=this[0].getBoundingClientRect?this[0].getBoundingClientRect():{top:0,left:0};return{top:t.top+(e.pageYOffset||document.scrollTop||0)-(document.clientTop||0),left:t.left+(e.pageXOffset||document.scrollLeft||0)-(document.clientLeft||0)}},position:function(){function e(){for(var e=this.offsetParent||document;e&&"html"===!e.nodeType.toLowerCase&&"static"===e.style.position;)e=e.offsetParent;return e||document}var t=this[0],e=e.apply(t),r=this.offset(),a=/^(?:body|html)$/i.test(e.nodeName)?{top:0,left:0}:$(e).offset();return r.top-=parseFloat(t.style.marginTop)||0,r.left-=parseFloat(t.style.marginLeft)||0,e.style&&(a.top+=parseFloat(e.style.borderTopWidth)||0,a.left+=parseFloat(e.style.borderLeftWidth)||0),{top:r.top-a.top,left:r.left-a.left}}};var r={};$.expando="velocity"+(new Date).getTime(),$.uuid=0;for(var a={},n=a.hasOwnProperty,o=a.toString,i="Boolean Number String Function Array Date RegExp Object Error".split(" "),s=0;s<i.length;s++)a["[object "+i[s]+"]"]=i[s].toLowerCase();$.fn.init.prototype=$.fn,e.Velocity={Utilities:$}}}(window),function(e){"object"==typeof module&&"object"==typeof module.exports?module.exports=e():"function"==typeof define&&define.amd?define(e):e()}(function(){return function(e,t,r,a){function n(e){for(var t=-1,r=e?e.length:0,a=[];++t<r;){var n=e[t];n&&a.push(n)}return a}function o(e){return g.isWrapped(e)?e=[].slice.call(e):g.isNode(e)&&(e=[e]),e}function i(e){var t=$.data(e,"velocity");return null===t?a:t}function s(e){return function(t){return Math.round(t*e)*(1/e)}}function l(e,r,a,n){function o(e,t){return 1-3*t+3*e}function i(e,t){return 3*t-6*e}function s(e){return 3*e}function l(e,t,r){return((o(t,r)*e+i(t,r))*e+s(t))*e}function u(e,t,r){return 3*o(t,r)*e*e+2*i(t,r)*e+s(t)}function c(t,r){for(var n=0;m>n;++n){var o=u(r,e,a);if(0===o)return r;var i=l(r,e,a)-t;r-=i/o}return r}function p(){for(var t=0;b>t;++t)w[t]=l(t*x,e,a)}function f(t,r,n){var o,i,s=0;do i=r+(n-r)/2,o=l(i,e,a)-t,o>0?n=i:r=i;while(Math.abs(o)>h&&++s<v);return i}function d(t){for(var r=0,n=1,o=b-1;n!=o&&w[n]<=t;++n)r+=x;--n;var i=(t-w[n])/(w[n+1]-w[n]),s=r+i*x,l=u(s,e,a);return l>=y?c(t,s):0==l?s:f(t,r,r+x)}function g(){V=!0,(e!=r||a!=n)&&p()}var m=4,y=.001,h=1e-7,v=10,b=11,x=1/(b-1),S="Float32Array"in t;if(4!==arguments.length)return!1;for(var P=0;4>P;++P)if("number"!=typeof arguments[P]||isNaN(arguments[P])||!isFinite(arguments[P]))return!1;e=Math.min(e,1),a=Math.min(a,1),e=Math.max(e,0),a=Math.max(a,0);var w=S?new Float32Array(b):new Array(b),V=!1,C=function(t){return V||g(),e===r&&a===n?t:0===t?0:1===t?1:l(d(t),r,n)};C.getControlPoints=function(){return[{x:e,y:r},{x:a,y:n}]};var T="generateBezier("+[e,r,a,n]+")";return C.toString=function(){return T},C}function u(e,t){var r=e;return g.isString(e)?v.Easings[e]||(r=!1):r=g.isArray(e)&&1===e.length?s.apply(null,e):g.isArray(e)&&2===e.length?b.apply(null,e.concat([t])):g.isArray(e)&&4===e.length?l.apply(null,e):!1,r===!1&&(r=v.Easings[v.defaults.easing]?v.defaults.easing:h),r}function c(e){if(e){var t=(new Date).getTime(),r=v.State.calls.length;r>1e4&&(v.State.calls=n(v.State.calls));for(var o=0;r>o;o++)if(v.State.calls[o]){var s=v.State.calls[o],l=s[0],u=s[2],f=s[3],d=!!f,m=null;f||(f=v.State.calls[o][3]=t-16);for(var y=Math.min((t-f)/u.duration,1),h=0,b=l.length;b>h;h++){var S=l[h],w=S.element;if(i(w)){var V=!1;if(u.display!==a&&null!==u.display&&"none"!==u.display){if("flex"===u.display){var C=["-webkit-box","-moz-box","-ms-flexbox","-webkit-flex"];$.each(C,function(e,t){x.setPropertyValue(w,"display",t)})}x.setPropertyValue(w,"display",u.display)}u.visibility!==a&&"hidden"!==u.visibility&&x.setPropertyValue(w,"visibility",u.visibility);for(var T in S)if("element"!==T){var k=S[T],A,F=g.isString(k.easing)?v.Easings[k.easing]:k.easing;if(1===y)A=k.endValue;else{var E=k.endValue-k.startValue;if(A=k.startValue+E*F(y,u,E),!d&&A===k.currentValue)continue}if(k.currentValue=A,"tween"===T)m=A;else{if(x.Hooks.registered[T]){var j=x.Hooks.getRoot(T),H=i(w).rootPropertyValueCache[j];H&&(k.rootPropertyValue=H)}var N=x.setPropertyValue(w,T,k.currentValue+(0===parseFloat(A)?"":k.unitType),k.rootPropertyValue,k.scrollData);x.Hooks.registered[T]&&(i(w).rootPropertyValueCache[j]=x.Normalizations.registered[j]?x.Normalizations.registered[j]("extract",null,N[1]):N[1]),"transform"===N[0]&&(V=!0)}}u.mobileHA&&i(w).transformCache.translate3d===a&&(i(w).transformCache.translate3d="(0px, 0px, 0px)",V=!0),V&&x.flushTransformCache(w)}}u.display!==a&&"none"!==u.display&&(v.State.calls[o][2].display=!1),u.visibility!==a&&"hidden"!==u.visibility&&(v.State.calls[o][2].visibility=!1),u.progress&&u.progress.call(s[1],s[1],y,Math.max(0,f+u.duration-t),f,m),1===y&&p(o)}}v.State.isTicking&&P(c)}function p(e,t){if(!v.State.calls[e])return!1;for(var r=v.State.calls[e][0],n=v.State.calls[e][1],o=v.State.calls[e][2],s=v.State.calls[e][4],l=!1,u=0,c=r.length;c>u;u++){var p=r[u].element;if(t||o.loop||("none"===o.display&&x.setPropertyValue(p,"display",o.display),"hidden"===o.visibility&&x.setPropertyValue(p,"visibility",o.visibility)),o.loop!==!0&&($.queue(p)[1]===a||!/\.velocityQueueEntryFlag/i.test($.queue(p)[1]))&&i(p)){i(p).isAnimating=!1,i(p).rootPropertyValueCache={};var f=!1;$.each(x.Lists.transforms3D,function(e,t){var r=/^scale/.test(t)?1:0,n=i(p).transformCache[t];i(p).transformCache[t]!==a&&new RegExp("^\\("+r+"[^.]").test(n)&&(f=!0,delete i(p).transformCache[t])}),o.mobileHA&&(f=!0,delete i(p).transformCache.translate3d),f&&x.flushTransformCache(p),x.Values.removeClass(p,"velocity-animating")}if(!t&&o.complete&&!o.loop&&u===c-1)try{o.complete.call(n,n)}catch(d){setTimeout(function(){throw d},1)}s&&o.loop!==!0&&s(n),i(p)&&o.loop===!0&&!t&&($.each(i(p).tweensContainer,function(e,t){/^rotate/.test(e)&&360===parseFloat(t.endValue)&&(t.endValue=0,t.startValue=360),/^backgroundPosition/.test(e)&&100===parseFloat(t.endValue)&&"%"===t.unitType&&(t.endValue=0,t.startValue=100)}),v(p,"reverse",{loop:!0,delay:o.delay})),o.queue!==!1&&$.dequeue(p,o.queue)}v.State.calls[e]=!1;for(var g=0,m=v.State.calls.length;m>g;g++)if(v.State.calls[g]!==!1){l=!0;break}l===!1&&(v.State.isTicking=!1,delete v.State.calls,v.State.calls=[])}var f=function(){if(r.documentMode)return r.documentMode;for(var e=7;e>4;e--){var t=r.createElement("div");if(t.innerHTML="<!--[if IE "+e+"]><span></span><![endif]-->",t.getElementsByTagName("span").length)return t=null,e}return a}(),d=function(){var e=0;return t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||function(t){var r=(new Date).getTime(),a;return a=Math.max(0,16-(r-e)),e=r+a,setTimeout(function(){t(r+a)},a)}}(),g={isString:function(e){return"string"==typeof e},isArray:Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},isFunction:function(e){return"[object Function]"===Object.prototype.toString.call(e)},isNode:function(e){return e&&e.nodeType},isNodeList:function(e){return"object"==typeof e&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(e))&&e.length!==a&&(0===e.length||"object"==typeof e[0]&&e[0].nodeType>0)},isWrapped:function(e){return e&&(e.jquery||t.Zepto&&t.Zepto.zepto.isZ(e))},isSVG:function(e){return t.SVGElement&&e instanceof t.SVGElement},isEmptyObject:function(e){for(var t in e)return!1;return!0}},$,m=!1;if(e.fn&&e.fn.jquery?($=e,m=!0):$=t.Velocity.Utilities,8>=f&&!m)throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");if(7>=f)return void(jQuery.fn.velocity=jQuery.fn.animate);var y=400,h="swing",v={State:{isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),isAndroid:/Android/i.test(navigator.userAgent),isGingerbread:/Android 2\.3\.[3-7]/i.test(navigator.userAgent),isChrome:t.chrome,isFirefox:/Firefox/i.test(navigator.userAgent),prefixElement:r.createElement("div"),prefixMatches:{},scrollAnchor:null,scrollPropertyLeft:null,scrollPropertyTop:null,isTicking:!1,calls:[]},CSS:{},Utilities:$,Redirects:{},Easings:{},Promise:t.Promise,defaults:{queue:"",duration:y,easing:h,begin:a,complete:a,progress:a,display:a,visibility:a,loop:!1,delay:!1,mobileHA:!0,_cacheValues:!0},init:function(e){$.data(e,"velocity",{isSVG:g.isSVG(e),isAnimating:!1,computedStyle:null,tweensContainer:null,rootPropertyValueCache:{},transformCache:{}})},hook:null,mock:!1,version:{major:1,minor:2,patch:2},debug:!1};t.pageYOffset!==a?(v.State.scrollAnchor=t,v.State.scrollPropertyLeft="pageXOffset",v.State.scrollPropertyTop="pageYOffset"):(v.State.scrollAnchor=r.documentElement||r.body.parentNode||r.body,v.State.scrollPropertyLeft="scrollLeft",v.State.scrollPropertyTop="scrollTop");var b=function(){function e(e){return-e.tension*e.x-e.friction*e.v}function t(t,r,a){var n={x:t.x+a.dx*r,v:t.v+a.dv*r,tension:t.tension,friction:t.friction};return{dx:n.v,dv:e(n)}}function r(r,a){var n={dx:r.v,dv:e(r)},o=t(r,.5*a,n),i=t(r,.5*a,o),s=t(r,a,i),l=1/6*(n.dx+2*(o.dx+i.dx)+s.dx),u=1/6*(n.dv+2*(o.dv+i.dv)+s.dv);return r.x=r.x+l*a,r.v=r.v+u*a,r}return function a(e,t,n){var o={x:-1,v:0,tension:null,friction:null},i=[0],s=0,l=1e-4,u=.016,c,p,f;for(e=parseFloat(e)||500,t=parseFloat(t)||20,n=n||null,o.tension=e,o.friction=t,c=null!==n,c?(s=a(e,t),p=s/n*u):p=u;;)if(f=r(f||o,p),i.push(1+f.x),s+=16,!(Math.abs(f.x)>l&&Math.abs(f.v)>l))break;return c?function(e){return i[e*(i.length-1)|0]}:s}}();v.Easings={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},spring:function(e){return 1-Math.cos(4.5*e*Math.PI)*Math.exp(6*-e)}},$.each([["ease",[.25,.1,.25,1]],["ease-in",[.42,0,1,1]],["ease-out",[0,0,.58,1]],["ease-in-out",[.42,0,.58,1]],["easeInSine",[.47,0,.745,.715]],["easeOutSine",[.39,.575,.565,1]],["easeInOutSine",[.445,.05,.55,.95]],["easeInQuad",[.55,.085,.68,.53]],["easeOutQuad",[.25,.46,.45,.94]],["easeInOutQuad",[.455,.03,.515,.955]],["easeInCubic",[.55,.055,.675,.19]],["easeOutCubic",[.215,.61,.355,1]],["easeInOutCubic",[.645,.045,.355,1]],["easeInQuart",[.895,.03,.685,.22]],["easeOutQuart",[.165,.84,.44,1]],["easeInOutQuart",[.77,0,.175,1]],["easeInQuint",[.755,.05,.855,.06]],["easeOutQuint",[.23,1,.32,1]],["easeInOutQuint",[.86,0,.07,1]],["easeInExpo",[.95,.05,.795,.035]],["easeOutExpo",[.19,1,.22,1]],["easeInOutExpo",[1,0,0,1]],["easeInCirc",[.6,.04,.98,.335]],["easeOutCirc",[.075,.82,.165,1]],["easeInOutCirc",[.785,.135,.15,.86]]],function(e,t){v.Easings[t[0]]=l.apply(null,t[1])});var x=v.CSS={RegEx:{isHex:/^#([A-f\d]{3}){1,2}$/i,valueUnwrap:/^[A-z]+\((.*)\)$/i,wrappedValueAlreadyExtracted:/[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,valueSplit:/([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi},Lists:{colors:["fill","stroke","stopColor","color","backgroundColor","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","outlineColor"],transformsBase:["translateX","translateY","scale","scaleX","scaleY","skewX","skewY","rotateZ"],transforms3D:["transformPerspective","translateZ","scaleZ","rotateX","rotateY"]},Hooks:{templates:{textShadow:["Color X Y Blur","black 0px 0px 0px"],boxShadow:["Color X Y Blur Spread","black 0px 0px 0px 0px"],clip:["Top Right Bottom Left","0px 0px 0px 0px"],backgroundPosition:["X Y","0% 0%"],transformOrigin:["X Y Z","50% 50% 0px"],perspectiveOrigin:["X Y","50% 50%"]},registered:{},register:function(){for(var e=0;e<x.Lists.colors.length;e++){var t="color"===x.Lists.colors[e]?"0 0 0 1":"255 255 255 1";x.Hooks.templates[x.Lists.colors[e]]=["Red Green Blue Alpha",t]}var r,a,n;if(f)for(r in x.Hooks.templates){a=x.Hooks.templates[r],n=a[0].split(" ");var o=a[1].match(x.RegEx.valueSplit);"Color"===n[0]&&(n.push(n.shift()),o.push(o.shift()),x.Hooks.templates[r]=[n.join(" "),o.join(" ")])}for(r in x.Hooks.templates){a=x.Hooks.templates[r],n=a[0].split(" ");for(var e in n){var i=r+n[e],s=e;x.Hooks.registered[i]=[r,s]}}},getRoot:function(e){var t=x.Hooks.registered[e];return t?t[0]:e},cleanRootPropertyValue:function(e,t){return x.RegEx.valueUnwrap.test(t)&&(t=t.match(x.RegEx.valueUnwrap)[1]),x.Values.isCSSNullValue(t)&&(t=x.Hooks.templates[e][1]),t},extractValue:function(e,t){var r=x.Hooks.registered[e];if(r){var a=r[0],n=r[1];return t=x.Hooks.cleanRootPropertyValue(a,t),t.toString().match(x.RegEx.valueSplit)[n]}return t},injectValue:function(e,t,r){var a=x.Hooks.registered[e];if(a){var n=a[0],o=a[1],i,s;return r=x.Hooks.cleanRootPropertyValue(n,r),i=r.toString().match(x.RegEx.valueSplit),i[o]=t,s=i.join(" ")}return r}},Normalizations:{registered:{clip:function(e,t,r){switch(e){case"name":return"clip";case"extract":var a;return x.RegEx.wrappedValueAlreadyExtracted.test(r)?a=r:(a=r.toString().match(x.RegEx.valueUnwrap),a=a?a[1].replace(/,(\s+)?/g," "):r),a;case"inject":return"rect("+r+")"}},blur:function(e,t,r){switch(e){case"name":return v.State.isFirefox?"filter":"-webkit-filter";case"extract":var a=parseFloat(r);if(!a&&0!==a){var n=r.toString().match(/blur\(([0-9]+[A-z]+)\)/i);a=n?n[1]:0}return a;case"inject":return parseFloat(r)?"blur("+r+")":"none"}},opacity:function(e,t,r){if(8>=f)switch(e){case"name":return"filter";case"extract":var a=r.toString().match(/alpha\(opacity=(.*)\)/i);return r=a?a[1]/100:1;case"inject":return t.style.zoom=1,parseFloat(r)>=1?"":"alpha(opacity="+parseInt(100*parseFloat(r),10)+")"}else switch(e){case"name":return"opacity";case"extract":return r;case"inject":return r}}},register:function(){9>=f||v.State.isGingerbread||(x.Lists.transformsBase=x.Lists.transformsBase.concat(x.Lists.transforms3D));for(var e=0;e<x.Lists.transformsBase.length;e++)!function(){var t=x.Lists.transformsBase[e];x.Normalizations.registered[t]=function(e,r,n){switch(e){case"name":return"transform";case"extract":return i(r)===a||i(r).transformCache[t]===a?/^scale/i.test(t)?1:0:i(r).transformCache[t].replace(/[()]/g,"");case"inject":var o=!1;switch(t.substr(0,t.length-1)){case"translate":o=!/(%|px|em|rem|vw|vh|\d)$/i.test(n);break;case"scal":case"scale":v.State.isAndroid&&i(r).transformCache[t]===a&&1>n&&(n=1),o=!/(\d)$/i.test(n);break;case"skew":o=!/(deg|\d)$/i.test(n);break;case"rotate":o=!/(deg|\d)$/i.test(n)}return o||(i(r).transformCache[t]="("+n+")"),i(r).transformCache[t]}}}();for(var e=0;e<x.Lists.colors.length;e++)!function(){var t=x.Lists.colors[e];x.Normalizations.registered[t]=function(e,r,n){switch(e){case"name":return t;case"extract":var o;if(x.RegEx.wrappedValueAlreadyExtracted.test(n))o=n;else{var i,s={black:"rgb(0, 0, 0)",blue:"rgb(0, 0, 255)",gray:"rgb(128, 128, 128)",green:"rgb(0, 128, 0)",red:"rgb(255, 0, 0)",white:"rgb(255, 255, 255)"};/^[A-z]+$/i.test(n)?i=s[n]!==a?s[n]:s.black:x.RegEx.isHex.test(n)?i="rgb("+x.Values.hexToRgb(n).join(" ")+")":/^rgba?\(/i.test(n)||(i=s.black),o=(i||n).toString().match(x.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g," ")}return 8>=f||3!==o.split(" ").length||(o+=" 1"),o;case"inject":return 8>=f?4===n.split(" ").length&&(n=n.split(/\s+/).slice(0,3).join(" ")):3===n.split(" ").length&&(n+=" 1"),(8>=f?"rgb":"rgba")+"("+n.replace(/\s+/g,",").replace(/\.(\d)+(?=,)/g,"")+")"}}}()}},Names:{camelCase:function(e){return e.replace(/-(\w)/g,function(e,t){return t.toUpperCase()})},SVGAttribute:function(e){var t="width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";return(f||v.State.isAndroid&&!v.State.isChrome)&&(t+="|transform"),new RegExp("^("+t+")$","i").test(e)},prefixCheck:function(e){if(v.State.prefixMatches[e])return[v.State.prefixMatches[e],!0];for(var t=["","Webkit","Moz","ms","O"],r=0,a=t.length;a>r;r++){var n;if(n=0===r?e:t[r]+e.replace(/^\w/,function(e){return e.toUpperCase()}),g.isString(v.State.prefixElement.style[n]))return v.State.prefixMatches[e]=n,[n,!0]}return[e,!1]}},Values:{hexToRgb:function(e){var t=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,a;return e=e.replace(t,function(e,t,r,a){return t+t+r+r+a+a}),a=r.exec(e),a?[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)]:[0,0,0]},isCSSNullValue:function(e){return 0==e||/^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(e)},getUnitType:function(e){return/^(rotate|skew)/i.test(e)?"deg":/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(e)?"":"px"},getDisplayType:function(e){var t=e&&e.tagName.toString().toLowerCase();return/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(t)?"inline":/^(li)$/i.test(t)?"list-item":/^(tr)$/i.test(t)?"table-row":/^(table)$/i.test(t)?"table":/^(tbody)$/i.test(t)?"table-row-group":"block"},addClass:function(e,t){e.classList?e.classList.add(t):e.className+=(e.className.length?" ":"")+t},removeClass:function(e,t){e.classList?e.classList.remove(t):e.className=e.className.toString().replace(new RegExp("(^|\\s)"+t.split(" ").join("|")+"(\\s|$)","gi")," ")}},getPropertyValue:function(e,r,n,o){function s(e,r){function n(){u&&x.setPropertyValue(e,"display","none")}var l=0;if(8>=f)l=$.css(e,r);else{var u=!1;if(/^(width|height)$/.test(r)&&0===x.getPropertyValue(e,"display")&&(u=!0,x.setPropertyValue(e,"display",x.Values.getDisplayType(e))),!o){if("height"===r&&"border-box"!==x.getPropertyValue(e,"boxSizing").toString().toLowerCase()){var c=e.offsetHeight-(parseFloat(x.getPropertyValue(e,"borderTopWidth"))||0)-(parseFloat(x.getPropertyValue(e,"borderBottomWidth"))||0)-(parseFloat(x.getPropertyValue(e,"paddingTop"))||0)-(parseFloat(x.getPropertyValue(e,"paddingBottom"))||0);return n(),c}if("width"===r&&"border-box"!==x.getPropertyValue(e,"boxSizing").toString().toLowerCase()){var p=e.offsetWidth-(parseFloat(x.getPropertyValue(e,"borderLeftWidth"))||0)-(parseFloat(x.getPropertyValue(e,"borderRightWidth"))||0)-(parseFloat(x.getPropertyValue(e,"paddingLeft"))||0)-(parseFloat(x.getPropertyValue(e,"paddingRight"))||0);return n(),p}}var d;d=i(e)===a?t.getComputedStyle(e,null):i(e).computedStyle?i(e).computedStyle:i(e).computedStyle=t.getComputedStyle(e,null),"borderColor"===r&&(r="borderTopColor"),l=9===f&&"filter"===r?d.getPropertyValue(r):d[r],(""===l||null===l)&&(l=e.style[r]),n()}if("auto"===l&&/^(top|right|bottom|left)$/i.test(r)){var g=s(e,"position");("fixed"===g||"absolute"===g&&/top|left/i.test(r))&&(l=$(e).position()[r]+"px")}return l}var l;if(x.Hooks.registered[r]){var u=r,c=x.Hooks.getRoot(u);n===a&&(n=x.getPropertyValue(e,x.Names.prefixCheck(c)[0])),x.Normalizations.registered[c]&&(n=x.Normalizations.registered[c]("extract",e,n)),l=x.Hooks.extractValue(u,n)}else if(x.Normalizations.registered[r]){var p,d;p=x.Normalizations.registered[r]("name",e),"transform"!==p&&(d=s(e,x.Names.prefixCheck(p)[0]),x.Values.isCSSNullValue(d)&&x.Hooks.templates[r]&&(d=x.Hooks.templates[r][1])),l=x.Normalizations.registered[r]("extract",e,d)}if(!/^[\d-]/.test(l))if(i(e)&&i(e).isSVG&&x.Names.SVGAttribute(r))if(/^(height|width)$/i.test(r))try{l=e.getBBox()[r]}catch(g){l=0}else l=e.getAttribute(r);else l=s(e,x.Names.prefixCheck(r)[0]);return x.Values.isCSSNullValue(l)&&(l=0),v.debug>=2&&console.log("Get "+r+": "+l),l},setPropertyValue:function(e,r,a,n,o){var s=r;if("scroll"===r)o.container?o.container["scroll"+o.direction]=a:"Left"===o.direction?t.scrollTo(a,o.alternateValue):t.scrollTo(o.alternateValue,a);else if(x.Normalizations.registered[r]&&"transform"===x.Normalizations.registered[r]("name",e))x.Normalizations.registered[r]("inject",e,a),s="transform",a=i(e).transformCache[r];else{if(x.Hooks.registered[r]){var l=r,u=x.Hooks.getRoot(r);n=n||x.getPropertyValue(e,u),a=x.Hooks.injectValue(l,a,n),r=u}if(x.Normalizations.registered[r]&&(a=x.Normalizations.registered[r]("inject",e,a),r=x.Normalizations.registered[r]("name",e)),s=x.Names.prefixCheck(r)[0],8>=f)try{e.style[s]=a}catch(c){v.debug&&console.log("Browser does not support ["+a+"] for ["+s+"]")}else i(e)&&i(e).isSVG&&x.Names.SVGAttribute(r)?e.setAttribute(r,a):e.style[s]=a;v.debug>=2&&console.log("Set "+r+" ("+s+"): "+a)}return[s,a]},flushTransformCache:function(e){function t(t){return parseFloat(x.getPropertyValue(e,t))}var r="";if((f||v.State.isAndroid&&!v.State.isChrome)&&i(e).isSVG){var a={translate:[t("translateX"),t("translateY")],skewX:[t("skewX")],skewY:[t("skewY")],scale:1!==t("scale")?[t("scale"),t("scale")]:[t("scaleX"),t("scaleY")],rotate:[t("rotateZ"),0,0]};$.each(i(e).transformCache,function(e){/^translate/i.test(e)?e="translate":/^scale/i.test(e)?e="scale":/^rotate/i.test(e)&&(e="rotate"),a[e]&&(r+=e+"("+a[e].join(" ")+") ",delete a[e])})}else{var n,o;$.each(i(e).transformCache,function(t){return n=i(e).transformCache[t],"transformPerspective"===t?(o=n,!0):(9===f&&"rotateZ"===t&&(t="rotate"),void(r+=t+n+" "))}),o&&(r="perspective"+o+" "+r)}x.setPropertyValue(e,"transform",r)}};x.Hooks.register(),x.Normalizations.register(),v.hook=function(e,t,r){var n=a;return e=o(e),$.each(e,function(e,o){if(i(o)===a&&v.init(o),r===a)n===a&&(n=v.CSS.getPropertyValue(o,t));else{var s=v.CSS.setPropertyValue(o,t,r);"transform"===s[0]&&v.CSS.flushTransformCache(o),n=s}}),n};var S=function(){function e(){return l?T.promise||null:f}function n(){function e(e){function p(e,t){var r=a,i=a,s=a;return g.isArray(e)?(r=e[0],!g.isArray(e[1])&&/^[\d-]/.test(e[1])||g.isFunction(e[1])||x.RegEx.isHex.test(e[1])?s=e[1]:(g.isString(e[1])&&!x.RegEx.isHex.test(e[1])||g.isArray(e[1]))&&(i=t?e[1]:u(e[1],o.duration),e[2]!==a&&(s=e[2]))):r=e,t||(i=i||o.easing),g.isFunction(r)&&(r=r.call(n,w,P)),g.isFunction(s)&&(s=s.call(n,w,P)),[r||0,i,s]}function f(e,t){var r,a;return a=(t||"0").toString().toLowerCase().replace(/[%A-z]+$/,function(e){return r=e,""}),r||(r=x.Values.getUnitType(e)),[a,r]}function d(){var e={myParent:n.parentNode||r.body,position:x.getPropertyValue(n,"position"),fontSize:x.getPropertyValue(n,"fontSize")},a=e.position===N.lastPosition&&e.myParent===N.lastParent,o=e.fontSize===N.lastFontSize;N.lastParent=e.myParent,N.lastPosition=e.position,N.lastFontSize=e.fontSize;var s=100,l={};if(o&&a)l.emToPx=N.lastEmToPx,l.percentToPxWidth=N.lastPercentToPxWidth,l.percentToPxHeight=N.lastPercentToPxHeight;else{var u=i(n).isSVG?r.createElementNS("http://www.w3.org/2000/svg","rect"):r.createElement("div");v.init(u),e.myParent.appendChild(u),$.each(["overflow","overflowX","overflowY"],function(e,t){v.CSS.setPropertyValue(u,t,"hidden")}),v.CSS.setPropertyValue(u,"position",e.position),v.CSS.setPropertyValue(u,"fontSize",e.fontSize),v.CSS.setPropertyValue(u,"boxSizing","content-box"),$.each(["minWidth","maxWidth","width","minHeight","maxHeight","height"],function(e,t){v.CSS.setPropertyValue(u,t,s+"%")}),v.CSS.setPropertyValue(u,"paddingLeft",s+"em"),l.percentToPxWidth=N.lastPercentToPxWidth=(parseFloat(x.getPropertyValue(u,"width",null,!0))||1)/s,l.percentToPxHeight=N.lastPercentToPxHeight=(parseFloat(x.getPropertyValue(u,"height",null,!0))||1)/s,l.emToPx=N.lastEmToPx=(parseFloat(x.getPropertyValue(u,"paddingLeft"))||1)/s,e.myParent.removeChild(u)}return null===N.remToPx&&(N.remToPx=parseFloat(x.getPropertyValue(r.body,"fontSize"))||16),null===N.vwToPx&&(N.vwToPx=parseFloat(t.innerWidth)/100,N.vhToPx=parseFloat(t.innerHeight)/100),l.remToPx=N.remToPx,l.vwToPx=N.vwToPx,l.vhToPx=N.vhToPx,v.debug>=1&&console.log("Unit ratios: "+JSON.stringify(l),n),l}if(o.begin&&0===w)try{o.begin.call(m,m)}catch(y){setTimeout(function(){throw y},1)}if("scroll"===k){var S=/^x$/i.test(o.axis)?"Left":"Top",V=parseFloat(o.offset)||0,C,A,F;o.container?g.isWrapped(o.container)||g.isNode(o.container)?(o.container=o.container[0]||o.container,C=o.container["scroll"+S],F=C+$(n).position()[S.toLowerCase()]+V):o.container=null:(C=v.State.scrollAnchor[v.State["scrollProperty"+S]],A=v.State.scrollAnchor[v.State["scrollProperty"+("Left"===S?"Top":"Left")]],F=$(n).offset()[S.toLowerCase()]+V),s={scroll:{rootPropertyValue:!1,startValue:C,currentValue:C,endValue:F,unitType:"",easing:o.easing,scrollData:{container:o.container,direction:S,alternateValue:A}},element:n},v.debug&&console.log("tweensContainer (scroll): ",s.scroll,n)}else if("reverse"===k){if(!i(n).tweensContainer)return void $.dequeue(n,o.queue);"none"===i(n).opts.display&&(i(n).opts.display="auto"),"hidden"===i(n).opts.visibility&&(i(n).opts.visibility="visible"),i(n).opts.loop=!1,i(n).opts.begin=null,i(n).opts.complete=null,b.easing||delete o.easing,b.duration||delete o.duration,o=$.extend({},i(n).opts,o);var E=$.extend(!0,{},i(n).tweensContainer);for(var j in E)if("element"!==j){var H=E[j].startValue;E[j].startValue=E[j].currentValue=E[j].endValue,E[j].endValue=H,g.isEmptyObject(b)||(E[j].easing=o.easing),v.debug&&console.log("reverse tweensContainer ("+j+"): "+JSON.stringify(E[j]),n)}s=E}else if("start"===k){var E;i(n).tweensContainer&&i(n).isAnimating===!0&&(E=i(n).tweensContainer),$.each(h,function(e,t){if(RegExp("^"+x.Lists.colors.join("$|^")+"$").test(e)){var r=p(t,!0),n=r[0],o=r[1],i=r[2];if(x.RegEx.isHex.test(n)){for(var s=["Red","Green","Blue"],l=x.Values.hexToRgb(n),u=i?x.Values.hexToRgb(i):a,c=0;c<s.length;c++){var f=[l[c]];o&&f.push(o),u!==a&&f.push(u[c]),h[e+s[c]]=f}delete h[e]}}});for(var R in h){var O=p(h[R]),z=O[0],q=O[1],M=O[2];R=x.Names.camelCase(R);var I=x.Hooks.getRoot(R),B=!1;if(i(n).isSVG||"tween"===I||x.Names.prefixCheck(I)[1]!==!1||x.Normalizations.registered[I]!==a){(o.display!==a&&null!==o.display&&"none"!==o.display||o.visibility!==a&&"hidden"!==o.visibility)&&/opacity|filter/.test(R)&&!M&&0!==z&&(M=0),o._cacheValues&&E&&E[R]?(M===a&&(M=E[R].endValue+E[R].unitType),B=i(n).rootPropertyValueCache[I]):x.Hooks.registered[R]?M===a?(B=x.getPropertyValue(n,I),M=x.getPropertyValue(n,R,B)):B=x.Hooks.templates[I][1]:M===a&&(M=x.getPropertyValue(n,R));var W,G,D,X=!1;if(W=f(R,M),M=W[0],D=W[1],W=f(R,z),z=W[0].replace(/^([+-\/*])=/,function(e,t){return X=t,""}),G=W[1],M=parseFloat(M)||0,z=parseFloat(z)||0,"%"===G&&(/^(fontSize|lineHeight)$/.test(R)?(z/=100,G="em"):/^scale/.test(R)?(z/=100,G=""):/(Red|Green|Blue)$/i.test(R)&&(z=z/100*255,G="")),/[\/*]/.test(X))G=D;else if(D!==G&&0!==M)if(0===z)G=D;else{l=l||d();var Y=/margin|padding|left|right|width|text|word|letter/i.test(R)||/X$/.test(R)||"x"===R?"x":"y";switch(D){case"%":M*="x"===Y?l.percentToPxWidth:l.percentToPxHeight;break;case"px":break;default:M*=l[D+"ToPx"]}switch(G){case"%":M*=1/("x"===Y?l.percentToPxWidth:l.percentToPxHeight);break;case"px":break;default:M*=1/l[G+"ToPx"]}}switch(X){case"+":z=M+z;break;case"-":z=M-z;break;case"*":z=M*z;break;case"/":z=M/z}s[R]={rootPropertyValue:B,startValue:M,currentValue:M,endValue:z,unitType:G,easing:q},v.debug&&console.log("tweensContainer ("+R+"): "+JSON.stringify(s[R]),n)}else v.debug&&console.log("Skipping ["+I+"] due to a lack of browser support.")}s.element=n}s.element&&(x.Values.addClass(n,"velocity-animating"),L.push(s),""===o.queue&&(i(n).tweensContainer=s,i(n).opts=o),i(n).isAnimating=!0,w===P-1?(v.State.calls.push([L,m,o,null,T.resolver]),v.State.isTicking===!1&&(v.State.isTicking=!0,c())):w++)}var n=this,o=$.extend({},v.defaults,b),s={},l;switch(i(n)===a&&v.init(n),parseFloat(o.delay)&&o.queue!==!1&&$.queue(n,o.queue,function(e){v.velocityQueueEntryFlag=!0,i(n).delayTimer={setTimeout:setTimeout(e,parseFloat(o.delay)),next:e}}),o.duration.toString().toLowerCase()){case"fast":o.duration=200;break;case"normal":o.duration=y;break;case"slow":o.duration=600;break;default:o.duration=parseFloat(o.duration)||1}v.mock!==!1&&(v.mock===!0?o.duration=o.delay=1:(o.duration*=parseFloat(v.mock)||1,o.delay*=parseFloat(v.mock)||1)),o.easing=u(o.easing,o.duration),o.begin&&!g.isFunction(o.begin)&&(o.begin=null),o.progress&&!g.isFunction(o.progress)&&(o.progress=null),o.complete&&!g.isFunction(o.complete)&&(o.complete=null),o.display!==a&&null!==o.display&&(o.display=o.display.toString().toLowerCase(),"auto"===o.display&&(o.display=v.CSS.Values.getDisplayType(n))),o.visibility!==a&&null!==o.visibility&&(o.visibility=o.visibility.toString().toLowerCase()),o.mobileHA=o.mobileHA&&v.State.isMobile&&!v.State.isGingerbread,o.queue===!1?o.delay?setTimeout(e,o.delay):e():$.queue(n,o.queue,function(t,r){return r===!0?(T.promise&&T.resolver(m),!0):(v.velocityQueueEntryFlag=!0,void e(t))}),""!==o.queue&&"fx"!==o.queue||"inprogress"===$.queue(n)[0]||$.dequeue(n)}var s=arguments[0]&&(arguments[0].p||$.isPlainObject(arguments[0].properties)&&!arguments[0].properties.names||g.isString(arguments[0].properties)),l,f,d,m,h,b;if(g.isWrapped(this)?(l=!1,d=0,m=this,f=this):(l=!0,d=1,m=s?arguments[0].elements||arguments[0].e:arguments[0]),m=o(m)){s?(h=arguments[0].properties||arguments[0].p,b=arguments[0].options||arguments[0].o):(h=arguments[d],b=arguments[d+1]);var P=m.length,w=0;if(!/^(stop|finish)$/i.test(h)&&!$.isPlainObject(b)){var V=d+1;b={};for(var C=V;C<arguments.length;C++)g.isArray(arguments[C])||!/^(fast|normal|slow)$/i.test(arguments[C])&&!/^\d/.test(arguments[C])?g.isString(arguments[C])||g.isArray(arguments[C])?b.easing=arguments[C]:g.isFunction(arguments[C])&&(b.complete=arguments[C]):b.duration=arguments[C]}var T={promise:null,resolver:null,rejecter:null};l&&v.Promise&&(T.promise=new v.Promise(function(e,t){T.resolver=e,T.rejecter=t}));var k;switch(h){case"scroll":k="scroll";break;case"reverse":k="reverse";break;case"finish":case"stop":$.each(m,function(e,t){i(t)&&i(t).delayTimer&&(clearTimeout(i(t).delayTimer.setTimeout),i(t).delayTimer.next&&i(t).delayTimer.next(),delete i(t).delayTimer)});var A=[];return $.each(v.State.calls,function(e,t){t&&$.each(t[1],function(r,n){var o=b===a?"":b;return o===!0||t[2].queue===o||b===a&&t[2].queue===!1?void $.each(m,function(r,a){a===n&&((b===!0||g.isString(b))&&($.each($.queue(a,g.isString(b)?b:""),function(e,t){g.isFunction(t)&&t(null,!0)}),$.queue(a,g.isString(b)?b:"",[])),"stop"===h?(i(a)&&i(a).tweensContainer&&o!==!1&&$.each(i(a).tweensContainer,function(e,t){t.endValue=t.currentValue
}),A.push(e)):"finish"===h&&(t[2].duration=1))}):!0})}),"stop"===h&&($.each(A,function(e,t){p(t,!0)}),T.promise&&T.resolver(m)),e();default:if(!$.isPlainObject(h)||g.isEmptyObject(h)){if(g.isString(h)&&v.Redirects[h]){var F=$.extend({},b),E=F.duration,j=F.delay||0;return F.backwards===!0&&(m=$.extend(!0,[],m).reverse()),$.each(m,function(e,t){parseFloat(F.stagger)?F.delay=j+parseFloat(F.stagger)*e:g.isFunction(F.stagger)&&(F.delay=j+F.stagger.call(t,e,P)),F.drag&&(F.duration=parseFloat(E)||(/^(callout|transition)/.test(h)?1e3:y),F.duration=Math.max(F.duration*(F.backwards?1-e/P:(e+1)/P),.75*F.duration,200)),v.Redirects[h].call(t,t,F||{},e,P,m,T.promise?T:a)}),e()}var H="Velocity: First argument ("+h+") was not a property map, a known action, or a registered redirect. Aborting.";return T.promise?T.rejecter(new Error(H)):console.log(H),e()}k="start"}var N={lastParent:null,lastPosition:null,lastFontSize:null,lastPercentToPxWidth:null,lastPercentToPxHeight:null,lastEmToPx:null,remToPx:null,vwToPx:null,vhToPx:null},L=[];$.each(m,function(e,t){g.isNode(t)&&n.call(t)});var F=$.extend({},v.defaults,b),R;if(F.loop=parseInt(F.loop),R=2*F.loop-1,F.loop)for(var O=0;R>O;O++){var z={delay:F.delay,progress:F.progress};O===R-1&&(z.display=F.display,z.visibility=F.visibility,z.complete=F.complete),S(m,"reverse",z)}return e()}};v=$.extend(S,v),v.animate=S;var P=t.requestAnimationFrame||d;return v.State.isMobile||r.hidden===a||r.addEventListener("visibilitychange",function(){r.hidden?(P=function(e){return setTimeout(function(){e(!0)},16)},c()):P=t.requestAnimationFrame||d}),e.Velocity=v,e!==t&&(e.fn.velocity=S,e.fn.velocity.defaults=v.defaults),$.each(["Down","Up"],function(e,t){v.Redirects["slide"+t]=function(e,r,n,o,i,s){var l=$.extend({},r),u=l.begin,c=l.complete,p={height:"",marginTop:"",marginBottom:"",paddingTop:"",paddingBottom:""},f={};l.display===a&&(l.display="Down"===t?"inline"===v.CSS.Values.getDisplayType(e)?"inline-block":"block":"none"),l.begin=function(){u&&u.call(i,i);for(var r in p){f[r]=e.style[r];var a=v.CSS.getPropertyValue(e,r);p[r]="Down"===t?[a,0]:[0,a]}f.overflow=e.style.overflow,e.style.overflow="hidden"},l.complete=function(){for(var t in f)e.style[t]=f[t];c&&c.call(i,i),s&&s.resolver(i)},v(e,p,l)}}),$.each(["In","Out"],function(e,t){v.Redirects["fade"+t]=function(e,r,n,o,i,s){var l=$.extend({},r),u={opacity:"In"===t?1:0},c=l.complete;l.complete=n!==o-1?l.begin=null:function(){c&&c.call(i,i),s&&s.resolver(i)},l.display===a&&(l.display="In"===t?"auto":"none"),v(this,u,l)}}),v}(window.jQuery||window.Zepto||window,window,document)});
(function(){
   RegExp.prototype.execAll = function(string) {
       var match = null;
       var matches = new Array();
       while (match = this.exec(string)) {
           var matchArray = [];
           for (i in match) {
               if (parseInt(i) == i) {
                   matchArray.push(match[i]);
               }
           }
           matches.push(matchArray);
       }
       return matches;
   }
})();

(function(){

   window.isMobile = false; //initiate as false

   if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) window.isMobile = true;
//   var _counter = 1;
   //  Unique id  helper
   // Object.defineProperty(Object.prototype, "__uniqueId", {
   //    writable : true
   // });
   // Object.defineProperty(Object.prototype, "uniqueId", {
   //    get : function() {
   //       if (this.__uniqueId == undefined)
   //          this.__uniqueId = _counter++;
   //       return this.__uniqueId;
   //    }
   // });

   
})();

(function(){
   Object.defineProperty(Object.prototype, "watch", {
   	enumerable : false,
   	configurable : true,
   	writable : false,
   	value : function(prop, handler) {
   		var oldval = this[prop], newval = oldval, getter = function() {
   			return newval;
   		}, setter = function(val) {
   			oldval = newval;
   			return newval = handler.call(this, prop, oldval, val);
   		};
   		if (delete this[prop]) { // can't watch constants
   			Object.defineProperty(this, prop, {
   				get : getter,
   				set : setter,
   				enumerable : true,
   				configurable : true
   			});
   		}
   	}
   });


   Object.defineProperty(Object.prototype, "unwatch", {
   	enumerable : false,
   	configurable : true,
   	writable : false,
   	value : function(prop) {
   		var val = this[prop];
   		delete this[prop]; // remove accessors
   		this[prop] = val;
   	}
   });

   var lastTime = 0;
   var vendors = ['ms', 'moz', 'webkit', 'o'];
   for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                  || window[vendors[x]+'CancelRequestAnimationFrame'];
   }

   if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
           var currTime = new Date().getTime();
           var timeToCall = Math.max(0, 16 - (currTime - lastTime));
           var id = window.setTimeout(function() { callback(currTime + timeToCall); },
             timeToCall);
           lastTime = currTime + timeToCall;
           return id;
      };

   if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
           clearTimeout(id);
      };

   window.$defered = function(cb){
      window.requestAnimationFrame(function(){
         cb();
      });
   }
})();

(function() {
   domain.service("$evaluate", ['$watch', '$pathObject', '$exec', '$proxy'],
      function($watch, $pathObject, $exec, $proxy) {
         return function(input, opts) {
            var opts = opts || [];
            var scope = opts.scope || {};
            var targetScope = opts.target;

            var changed = opts.changed;
            var watchVariables = opts.watchVariables !== undefined ? opts.watchVariables : true;

            // watchers for the current callback
            var _watchers = [];

            var compile = function() {

               var tpl = input.tpl;
               var expressions = [];
               var locals = []

               _.each(input.vars, function(variable, k) {
                  var value;
                  // If compile is called with new value we have to take the new value instead
                  if (variable.p) {
                     // The rest can be taken from the scope
                     path = $pathObject(variable.p, scope)
                     value = path.value;
                     locals.push({
                        path: variable.p,
                        value: path
                     })
                  } else {
                     // Expression
                     if (variable.e) {
                        value = $exec.expression(variable.e, scope, targetScope);
                        expressions.push({
                           str: variable.e,
                           value: value
                        })
                     }
                  }
                  value = value === undefined ? '' : value;
                  tpl = tpl.split(k).join(value)
               });
               // Proxies ***********************************************
               for (var k in input.x) {
                  var proxy = input.x[k]
                  var value = $proxy.exec(proxy, scope);
                  tpl = tpl.split(k).join(value);

               }
               // Exec functions ****************************************
               for (var k in input.funcs) {
                  var func = input.funcs[k]
                  var existingFunction = $pathObject(func.p, scope).value;
                  if (_.isFunction(existingFunction)) {

                     var funcResult = $exec.func(func.f, scope, targetScope);
                     tpl = tpl.split(k).join(funcResult !== undefined ? funcResult : '');
                  } else {
                     // Replace it with empty string if function is not defined
                     tpl = tpl.split(k).join('');
                  }
               }
               var response = {
                  str: tpl,
                  expressions: expressions,
                  locals: locals,
                  // detach (unwatch)
                  detach: function() {
                     _.each(_watchers, function(wt) {
                        wt.remove();
                     });
                  }
               }
               if (_.isFunction(changed)) {
                  changed(response)
               }
               return response;
            }

            // Calling if variables need to be watched
            // Sometimes we need to just to evaluate and that's it
            if (watchVariables) {
               // to be watched
               var variables2Watch = {};
               var collectWatchers = function(list) {
                  _.each(list, function(variable) {
                     if (variable.p) {
                        var vpath = variable.p.join('.')
                        if (!variables2Watch[vpath]) {
                           variables2Watch[vpath] = variable;
                        }
                     }
                     // Expression?
                     if (variable.e) {
                        collectWatchers(variable.v)
                     }
                  });
               }
               collectWatchers(input.vars);

               // Watch proxies ****************
               _.each(input.x, function(_proxy) {
                  var proxy = $proxy.getProxy(_proxy);
                  if ( proxy ){
                     var watcher = $watch('_changed', proxy, function(old, value) {
                        compile();
                     });
                     _watchers.push(watcher);
                  }
               });

               _.each(variables2Watch, function(variable) {
                  // In case of a direct variable
                  var watcher = $watch(variable.p, scope, function(old, value) {
                        // Have to call if after values been actually changed
                     $defered(function() {
                        compile();
                     });
                  });
                  if (watcher) {
                     _watchers.push(watcher);
                  }
               });

            }

            return compile();
         }
      })
})();

(function() {
   var _cache = {};
   var getFunctionFromString = function(stringFunction){
      var userFunc;
      if (_cache[stringFunction]){
         userFunc = _cache[stringFunction];
      } else {
         userFunc = eval("(function($, target){ return " + stringFunction + "})");
         _cache[stringFunction] = userFunc
      }
      return _cache[stringFunction];
   }
   domain.service("$exec", ['$pathObject'], function($pathObject) {
      return {
         func: function(str, scope, targetScope) {
            var userFunc = getFunctionFromString(str)
            var result = userFunc.bind(scope)(scope,targetScope);

            return result;
         },
         expression: function(expr, scope, targetScope) {
            var userFunc = getFunctionFromString(expr)
            var result = userFunc.bind(scope)(scope, targetScope);
            return result;
         }
      }
   });
})();

(function() {
   var observer;
   // Garbage collector based on MutationObserver

   $(function(){
      var target = document.querySelector('body');

      // create an observer instance
      observer = new MutationObserver(function(mutations) {
         mutations.forEach(function(mutation) {
            if ( mutation.removedNodes ){
               _.each(mutation.removedNodes, function(node){
                  if ( node.$tag ){
                     if ( node.$tag  && node.$tag.gc){
                        
                        node.$tag.gc(true);
                     }
                  }
               })
            }
         });
      });

      // configuration of the observer:
      var config = {
         childList: true,
         subtree : true
      };

      // pass in the target node, as well as the observer options
      observer.observe(target, config);
   });


})();

(function(){

   domain.service("$loadView",function(){
      return function(view){
         
         return new Promise(function(resolve, reject){
            if (window.__wires_views__[view] ){
               return resolve(window.__wires_views__[view]);
            }
            return resolve([]);
         })
      }
   })

})();

(function(){
   domain.service("$pathObject", function() {
      return function(path, scope) {
         // just in case converting it
         if (!_.isArray(path)) {
            path = path.split("\.");
         }

         var instance = scope;
         var property = null;
         _.each(path, function(key, index) {
            if (path.length - 1 === index) {
               // The last one
               property = key;
            } else {
               if (instance[key] !== undefined) {
                  instance = instance[key];
               } else {
                  instance[key] = {};
                  instance = instance[key];
               }
            }
         });
         return {
            update : function(newValue){
               instance[property] = newValue;
               return newValue;
            },
            value : instance[property],
            property : property,
            instance : instance
         };
      };
   });
})();

(function(){
   var _proxies = {};
   domain.service("$proxy", ['$projectProxies'], function($projectProxies){
      return {
         getProxy : function(proxyData){
            var name = proxyData.n;
            var _Proxy = $projectProxies[name];
            if ( _Proxy ) {
               var proxy = _proxies[name];
               if ( !proxy  ){
                  proxy = _proxies[name] = new _Proxy();
               }
               return proxy;
            }
         },
         exec : function(proxyData, scope){
            var proxy = this.getProxy(proxyData);
            if ( proxy ){
               return proxy.get(proxyData.k, scope)
            }
            return '';
         }
      }

   })
})();

(function() {
   domain.service("$run", ['TagNode', 'TextNode', 'Repeater', 'Conditional', 'Include'],
      function(TagNode, TextNode, Repeater, Conditional, Include) {
         var run = function(opts) {

            opts = opts || {};
            var structure = opts.structure || [];
            var target = opts.target || document.querySelector("section");
            var scope = opts.scope || {};

            var createElements = function(children, parent) {

               _.each(children, function(item) {

                  var node;
                  

                  // type TEXT
                  if (item.t === 1) {
                     node = new TextNode(item, scope);
                     node.create(parent);
                  }
                  // type TAG
                  if (item.t === 2) {
                     node = new TagNode(item, scope);
                     var element = node.create(parent);
                     if (item.c) {
                        createElements(item.c, node);
                     }
                  }
                  // Type Repeater
                  if (item.t === 3) {
                     var repeater = new Repeater({
                        run : run,
                        item: item,
                        parent: parent,
                        scope: scope
                     });
                  }
                  // If statement
                  if (item.t === 4) {
                     var conditional = new Conditional({
                        run : run,
                        item: item,
                        parent: parent,
                        scope: scope
                     });
                  }

                  // Include
                  if (item.t === 5) {
                     var include = new Include({
                        run : run,
                        item: item,
                        parent: parent,
                        scope: scope,
                        createElements : createElements
                     });
                     include.create(parent);
                  }
               });
            };

            var pNode = opts.parentNode || new TagNode(target);
            if ( !pNode.element){
               pNode.setElement(target);
            }
            createElements(structure, pNode);
         };
         return run;
      });
})();

(function() {
   var _proxies = {};
   domain.service("$watch", ['$pathObject', '$array', '$projectProxies'], function($pathObject, $array,
      $projectProxies) {
      return function(path, scope, cb) {

         var pathObject = $pathObject(path, scope);
         var instance = pathObject.instance;
         var property = pathObject.property;

         if (!instance.$watchers) {
            instance.$watchers = {};
         }
         // prototyping array if it was not
         if (_.isArray(instance)) {
            instance = $array(instance);
         }

         if (!_.isObject(instance) && _.isString(property))
            return;

         // detecting if property has been requested to be watched
         if (!instance.$watchers[property]) {
            instance.$watchers[property] = [];
         }
         if (cb) {
            instance.$watchers[property].push(cb);
         }

         if (instance.$watchers[property].length === 1) {

            instance.watch(property, function(a, b, newvalue) {
               _.each(instance.$watchers[property], function(_callback) {
                  // Firing up handler if attached
                  if (instance.$changed !== undefined) {
                     instance.$changed(property, b, newvalue);
                  }
                  _callback(b, newvalue);
               });
               return newvalue;
            });
         }

         return {
            remove: function() {

               var index = instance.$watchers[property].indexOf(cb);

            },
            removeAll: function() {
               instance.unwatch(property);
               delete instance.$watchers;
            }
         };
      };
   });
})();

domain.service("validators.testEmail", function() {
   return {
      cls: "ws-failed",
      validate: function(param) {
         var isValid = /(.+)@(.+){2,}\.(.+){2,}/.test(this.str);
         if (!isValid) {
            return "Email is not valid";
         }
      }
   };
});

(function(){
   domain.service("$restEndPoint", function(){
      return function(path, params){
         var params = params || {};
         var p = path.split("\/");
         var processedPath = [];
         _.each(p, function(item){
            var variable = item.match(/:(.+)/);
            if ( variable ){
               if ( params.hasOwnProperty(variable[1])) {
                  processedPath.push(params[variable[1]])
               }
            } else {
               processedPath.push(item);
            }
         });
         return processedPath.join("/");
      }
   })
})();

domain.service("WiresValidation", function() {
   return Wires.Class.extend({
      initialize: function() {
         this.msg = '';
         this.cls = '';
      },
      // Simple email validation
      email: function(value) {
         if (!value || value.test(/^([\w._]+)@([\w_]+)\.([a-z]+)$/)) {
            return {
               msg: "Invalid email",
               cls: "ws-invalid"
            };
         }
      }
   });
});

(function() {
   var _customAttributes;
   domain.service("$customAttributes", function() {
      if (_customAttributes) {
         return _customAttributes;
      }
      return new Promise(function(resolve, reject) {
         domain.requirePackage('attrs').then(function(customAttributes) {
            _customAttributes = customAttributes;
            return resolve(_customAttributes);
         });
      });
   });
})();

(function() {
   domain.service("$form", function() {

      return function() {
         var form = {};

         // Filter out system and private  objects
         // $ - system
         // _ - private
         form.$normalize = function(data) {
            var attrs = {};

            if (_.isString(data)) {
               return data;
            }
            if (_.isNumber(data)) {
               return data;
            }
            if (_.isBoolean(data)) {
               return data;
            }
      
            _.each(data, function(v, k) {
               if (v !== undefined && _.isString(k)) {
                  if (!k.match(/^(\$|_)/)) {
                     if (_.isArray(v)) {
                        attrs[k] = [];
                        _.each(v, function(item) {
                           attrs[k].push(form.$normalize(item));
                        });
                     } else if (_.isPlainObject(v)) {
                        attrs[k] = form.$normalize(v);
                     } else {
                        if (!(v instanceof Date)) {
                           attrs[k] = form.$normalize(v);
                        } else {
                           attrs[k] = v;
                        }
                     }
                  }
               }
            });
            return attrs;
         };
         form.$getAttrs = function() {
            return form.$normalize(this);
         };

         form.$reset = function() {
            _.each(this, function(v, k) {
               if (!k.match(/^(\$|_)/)) {
                  if (_.isArray(this[k])) {
                     this[k].$removeAll();
                  } else {
                     this[k] = undefined;
                  }
               }
            }, this);
         };
         return form;
      };
   });
})();

(function(){
   var _history;
   domain.service("$history", function(){
      if ( _history){
         return _history;
      }
      var Instance = Wires.Class.extend({
         initialize : function(){
            var self = this;
            this.events = {};
            window.onpopstate = function(){
               self.trigger("change");
            }
         },
         trigger : function(event){
            if ( _.isArray(this.events[event]) ) {
               _.each(this.events[event], function(cb){
                  cb();
               })
            }
         },
         on : function(event, cb){
            if ( !this.events[event]){
               this.events[event] = [];
            }
            this.events[event].push(cb);
         },
         go : function(url){
            var stateObj = { url : url };
            history.pushState(stateObj, url, url);
            this.trigger("change");
         }
      });
      _history = new Instance();
      return _history;
   })
})();

(function() {
   domain.register("$http", function() {
      return {
         _request: function(method, url, data, ok, fail) {
            var opts = {
               url: url,
               contentType: 'application/json; charset=UTF-8',
               method: method,
               data: JSON.stringify(data),
               dataType: "json"
            }
            if (method === "GET") {
               opts.data = data;
            }

            var request = $.ajax(opts);

            request.always(function(res, status) {

               if ( status !== "success") {
                  return fail({ status : res.status, message : res.responseJSON || res.statusText} )
               }
               return ok(res);
            });
         },
         delete: function(url, data) {
            var self = this;
            return new Promise(function(resolve, reject) {
               self._request("DELETE", url, data, function(res) {
                  resolve(res);
               }, function(err) {
                  reject(err)
               })
            })
         },
         getHTML : function(url){
            var self = this;
            return new Promise(function(resolve, reject) {
               $.get(url, function(data){
                  data = data.replace(/(\r\n|\n|\r)/gm,"");
                  return resolve(data)
               });
            })
         },
         // Gett request
         get: function(url, data) {
            var self = this;

            return new Promise(function(resolve, reject) {

               self._request("GET", url, data, function(res) {
                  resolve(res);
               }, function(err) {

                  reject(err)
               })
            })
         },
         // Gett request
         post: function(url, data) {
            var self = this;
            return new Promise(function(resolve, reject) {
               self._request("POST", url, data, function(res) {
                  resolve(res);
               }, function(err) {
                  reject(err)
               })
            })
         },
         put: function(url, data) {
            var self = this;
            return new Promise(function(resolve, reject) {
               self._request("PUT", url, data, function(res) {
                  resolve(res);
               }, function(err) {
                  reject(err)
               })
            })
         }
      }
   })
})();

(function() {
   var _loaded = {};
   var counter = 0;
   domain.service("$load", ['$queryString', '$loadView', '$run'],
      function( $queryString, $loadView, $run) {
      return {
         component: function(component, opts) {

         },
         controller: function(controller, opts) {
            var _url = window.location.url;
            var opts = opts || {};
            var parent = opts.parent;

            var params = $queryString();

            if (opts.params) {
               params = _.merge(params, opts.params);
            }
            var injections = {
               $params: {
                  target: params
               }
            };

            // Check if controller has custom injections
            if (opts.injections) {
               _.each(opts.injections, function(value, key) {
                  injections[key] = {
                     target: value
                  }
               })
            }
            return domain.require([controller], injections, function(list) {
               counter++;
               // Basic validation on list
               if (!_.isArray(list)) {
                  return;
               }
               if (list.length < 2) {
                  return;
               }
               var loadOpts = list[0].match(/^([^\s]+)(\s*->\s*([^\s]+))?/i)
               var Ctrl = list[1];
               if (!loadOpts) {
                  return;
               }
               var view = loadOpts[1];
               var targetSelector = loadOpts[3] || "section";
               var target = null;

               if ( parent && parent.element){
                  target = $(parent.element).find(targetSelector)[0]
               } else {
                  target = document.querySelector(targetSelector)
               }

               if ( !target  ){
                  throw { message : "Can't find a target "}
               }

               var ctrl = new Ctrl();
               // detach the very first
               if ( target.$tag ){
                  if ( target.$tag.gc){
                     target.$tag.gc(true);
                  }
               }
               while (target.firstChild) {
                  target.removeChild(target.firstChild);
               }
               return $loadView(view).then(function(structure){
                  $run({
                     structure : structure,
                     target : target,
                     scope : ctrl
                  });
                  return {scope : ctrl, element : target};
               });
            })
         }
      }
   })
})();

(function(){
   var _animations;
   domain.service("$projectAnimations", function(){
      if ( _animations ){

         return _animations;
      }
      return new Promise(function(resolve, reject){
         domain.requirePackage('animations').then(function(animations){
            _animations = {};
            _.each(animations, function(proxy, key){
               var name = key.slice(11, key.length);
               _animations[name] = proxy;
            });
            return resolve(_animations);
         });
      });
   });
})();

(function(){
   var _projectProxies;
   domain.service("$projectProxies", function(){
      if ( _projectProxies ){
         return _projectProxies;
      }
      return new Promise(function(resolve, reject){

         domain.requirePackage('proxies').then(function(projectProxies){

            _projectProxies = {};
            
            _.each(projectProxies, function(proxy, key){
               var name = key.slice(8, key.length);
               _projectProxies[name] = proxy;
            })
            return resolve(_projectProxies);
         })
      })
   })
})();

(function() {
   var _validators;
   domain.service("$projectValidators", function() {
      if (_validators) {
         return _validators;
      }
      return new Promise(function(resolve, reject) {
         domain.requirePackage('validators').then(function(validators) {
            _validators = {};
            _.each(validators, function(validator, key) {
               var name = key.slice(11, key.length);
               _validators[name] = validator;
            });
            return resolve(_validators);
         });
      });
   });
})();

(function(){
   domain.service("$queryString", function(){
      var QueryString = function() {
         // This function is anonymous, is executed immediately and
         // the return value is assigned to QueryString!
         var query_string = {};
         var query = window.location.search.substring(1);
         var vars = query.split("&");
         for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
               query_string[pair[0]] = decodeURIComponent(pair[1]);
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
      };
      return QueryString;
   })
})();

(function() {



   // Router State
   var RouterState = Wires.Class.extend({
      initialize: function() {
         this.states = [];
         this.loaded = false;
      },
      set: function(route, controller, states) {
         this.route = route;
         this.controller = controller;
         this.states = states;
      },
      getControllerPath: function() {
         return "controllers." + this.controller;
      },
      matches: function() {
         var url = window.location.pathname;

         var keys = [];
         var re = pathToRegexp(this.route, keys)
         var result;
         var params = {};
         if ((result = re.exec(url))) {
            _.each(keys, function(key, index) {
               params[key.name] = result[index + 1];
            });
            return params;
         }
      }
   });
   // Defining the root router state
   var rootState = new RouterState();

   domain.register("$router", ['$load', '$queryString', '$loadView', '$run', '$history'],
      function($load, $queryString, $loadView, $run, $history) {

         return {

            add: function() {
               var state = this.state.apply(this, arguments);
               rootState.states.push(state);
            },
            state: function(route, controller, states) {
               var state = new RouterState();
               state.set.apply(state, arguments);
               return state;
            },
            _start: function(rState) {
               var self = this;
               _.each(rState.states, function(state) {
                  var params;
                  // If the route matches
                  if ((params = state.matches())) {
                     self.stack.push(state);
                     // Check if we have nested controllers
                     if (state.states) {

                        self._start(state)
                     }
                     return false;
                  }
               });
            },
            loadStates: function(states) {
               var start = new Date().getTime();
               var self = this;
               var parent;

               self.historyStack = self.historyStack || [];

               return domain.each(states, function(routeState, index) {

                  var hs = self.historyStack[index];
                  var thelast = index + 1 === states.length;

                  if (hs) {
                     // If the route is not the last one
                     if (!thelast) {
                        // We need to check if it's been changed
                        if (hs.route === routeState.route) {
                           // W don't need to trigger it
                           parent = routeState.parent
                           return;
                        }
                     }
                  }

                  return $load.controller(routeState.getControllerPath(), {
                     parent: parent
                  }).then(function(current) {
                     routeState.loaded = true;
                     routeState.parent = current;
                     parent = current;
                  })
               }).then(function(scope) {

                  self.historyStack = [];
                  // Reset the controller stack
                  _.each(self.stack, function(s) {
                     self.historyStack.push(s);
                  })
                  self.stack = [];
               }).catch(function(e){
                  console.error(e || e.stack)
               })

            },
            start: function() {
               var self = this;
               self.stack = [];
               self._start(rootState);
               self.loadStates(self.stack)

               $history.on("change", function(e) {
                  self.stack = [];
                  self._start(rootState);
                  self.loadStates(self.stack)
               });
            }
         }
      })
})();

(function() {
   domain.service("Conditional", ['TagNode',  '$array', '$watch', '$evaluate', '$pathObject', 'GarbageCollector'],
   function(TagNode, $array, $watch, $evaluate, $pathObject, GarbageCollector) {
      return GarbageCollector.extend({
         initialize: function(opts) {
            var self = this;
            this.item = opts.item;
            this.run = opts.run;
            this.parent = opts.parent;
            this.scope = opts.scope;


            var parentDom = self.item.c[0];

            // Checking new scope
            // TODO: move to compiler

            if ( parentDom.a && parentDom.a["ws-bind"] ){
               var wsBind = parentDom.a["ws-bind"];
               if ( _.values(wsBind.vars).length > 0 ){
                  var newScope =  _.values(wsBind.vars)[0];
                  this.attachedScopePath = newScope.p;
               }
            }

            this.element = document.createComment(' if ');
            this.parent.addChild(this);

            // Evaluate and watch condition
            this.watchers = $evaluate(this.item.z, {
               scope: self.scope,
               element : {},
               target : {},
               changed : function(data){

                  if ( data.expressions && data.expressions.length > 0 ){
                     var condition = data.expressions[0].value;
                     // Create the element from scratch
                     if ( condition ){
                        // Only if element was removed
                        // We don't want to re-create it all the time
                        if ( self.parentElement === undefined ){
                           // check for modified SCOPE
                           var scope = self.scope;
                           if ( self.attachedScopePath ){
                              scope = $pathObject(self.attachedScopePath, scope).value;
                           }

                           var parentNode = new TagNode(parentDom, scope);
                           parentNode.create();
                           self.parentElement = parentNode.element;

                           // check for the include
                           var includes;
                           var structure = parentDom.c || [];
                           if ( parentDom.a && ( includes = parentDom.a["ws-include"]) ){
                              if ( window.__wires_views__[includes.tpl] ) {
                                 structure = window.__wires_views__[includes.tpl];
                              } else {
                                 console.error(includes.tpl + " was not found");
                              }
                           }
                           // Kicking of the run with parent's children

                           self.run({
                              structure   : structure,
                              parentNode  : parentNode,
                              scope       : scope
                           });
                           self.element.parentNode.insertBefore(parentNode.element, self.element.nextSibling);
                        }
                     } else {
                        // Destroying the element
                        if (  self.parentElement ){
                           if ( self.parentElement.$tag ){
                              self.parentElement.$tag.gc();
                           } else {
                              $(self.parentElement).remove();
                           }
                           self.parentElement = undefined;
                        }
                     }
                  }
               }
            });

         }
      });
   });

})();

(function() {
   domain.service("GarbageCollector", function() {
      return Wires.Class.extend({
         gc: function(cleanOnly) {
            var self = this;
            if ( this.element ){
               $(this.element).unbind();
            }
            if ( self.detach ){
               self.detach();
            }
            // Removing all watchers from the attributes
            if (self.attributes) {
               _.each(self.attributes, function(attribute) {
                  if (attribute.watcher) {
                     if (_.isArray(attribute.watcher)) {
                        _.each(attribute.watcher, function(w) {

                           w.detach();
                        });
                     } else {
                        attribute.watcher.detach();
                     }
                  }
                  if (_.isFunction(attribute.detach)) {
                     attribute.detach();
                  }
               });

               self.attributes.splice(0, self.attributes.length - 1);
               delete self.attributes;
            }
            if ( self.watchers ){
               var collection = [].concat(self.watchers);
               _.each(collection, function(watcher) {
                  watcher.detach();
               });
            }
            // TextNode should be triggered manually
            // So we iterate over each text node
            // And detach watchers manually
            //if ( recursive ){

            var removeChildren = function(){
               if (self.children) {
                  _.each(self.children, function(child) {
                     child.gc();
                  });
               }
            };
            if ( !cleanOnly ){
               if ( self.element.$destroy ){
                  var result = self.element.$destroy();
                  if (result instanceof Promise ){
                     result.then(function(){
                        $(self.element).remove();
                        removeChildren();
                     });
                  } else {
                     $(self.element).remove();
                     removeChildren();
                  }
               } else {

                  $(self.element).remove();
                  removeChildren();
               }
            }

         }
      });
   });
})();

(function() {
   domain.service("Include", ['TagNode', '$pathObject'], function(TagNode, $pathObject) {
      var Include = TagNode.extend({
         initialize : function(data){
            Include.__super__.initialize.apply(this, [data.item, data.scope]);
            this.run = data.run;

         },
         create : function(){
            Include.__super__.create.apply(this, arguments);
            var el = this.element;
            var attrs = this.item.a;
            var scope = this.scope;
            // getting the data from window.__wires_views__
            var structure;
            if ( (structure = window.__wires_views__[this.item.v]) ) {

               if ( attrs && attrs["ws-bind"] ){
                  var wsBind = attrs["ws-bind"];

                  if ( _.values(wsBind.vars).length > 0 ){

                     scope = $pathObject( _.values(wsBind.vars)[0].p, this.scope).value;
                     
                  }
               }

               this.run({
                  structure : structure,
                  target : el,
                  scope : scope
               });
            } else {
               console.error(this.item.v + " was not found!");
            }
         }
      });
      return Include;
   });
})();

(function() {
   domain.service("Proxy", function() {
      return Wires.Class.extend({
         initialize: function() {
            this.callbacks = [];
            this._changed = 1;
            this.init();
         },
         init : function(){

         },
         // _changed variable is beeing watch by $evaluate
         // So any access to this variable should provoke node's re-render
         update : function(){
            this._changed = 1;
         },
         addCallback: function(cb, path) {

            var callback = cb.bind({
               proxy: this,
               path: path
            });
            this.callbacks.push(callback);
            callback(null, this.get(path));
         },
         get : function(key){

         }
      })
   })
})();

domain.service("Repeater", ['TagNode','$pathObject', '$array', '$watch','GarbageCollector'],
   function(TagNode,$pathObject, $array, $watch, GarbageCollector ){
   return GarbageCollector.extend({
      initialize : function(opts){
         var self = this;
         this.item = opts.item;
         this.run = opts.run;
         this.parent =  opts.parent;
         this.scope = opts.scope;

         var targetVars = this.item.v;

         if ( !targetVars.vars){
            throw { error : "Repeater expects variables! e.g $item in items"}
         }

         if ( _.keys(targetVars.vars).length !== 2 ){
            throw { error : "Repeater expects 2 variables. Scope key and Target Array (e.g $item in items)"}
         }
         this.scopeKey = targetVars.vars.__v0.p.join('');

         // Watch current array (in case if someone overrides is)
         // This should not happen
         // But just in case we should check this case
         $watch(targetVars.vars.__v1.p, this.scope, function(oldArray, newvalue){

            self.array = $array(newvalue);
            if ( !self.element){
               self.element = document.createComment('repeat ' + self.scopeKey);
               self.parent.addChild(self);
            }
            self.assign();
         });


         // Getting the target array
         var arrayPath = $pathObject(targetVars.vars.__v1.p, this.scope);

         var array = arrayPath.value ? arrayPath.value : arrayPath.update([]);

         // Attempting to create wires object array
         this.array = $array(array);

         // Create a placeholder
         this.element = document.createComment('repeat ' + this.scopeKey);
         this.parent.addChild(this);
         this.assign();
      },
      assign : function(){
         this.watchers = this.array.$watch(this.onEvent.bind(this));
         this._arrayElements = [];
         this.createInitialElements();
      },
      createInitialElements : function(){
         var self = this;
         _.each(this.array, function(element){
            self.addItem(element);
         });
      },
      detach : function(){
         _.each(this._arrayElements, function(item){
            if ( item.node.element && item.node.element.$tag){
               item.node.element.$tag.gc();
            }
         });
         this._arrayElements.splice(0,this._arrayElements.length);
      },
      addItem : function(arrayItem){

         var parentDom = this.item.i[0];

         //Creating new scope with parent variable
         var localScope = {
            parent : this.scope,
            index  : this._arrayElements.length
         };
         localScope[this.scopeKey] = arrayItem;

         var parentNode = new TagNode(parentDom, localScope);
         parentNode.create();

         // Checking the element we need to insert after
         var afterElement = this.element;
         var index = this._arrayElements.length;
         if ( index > 0 ){
            afterElement = this._arrayElements[index-1];
         }

         // Appending element
         var cNode = afterElement.node ? afterElement.node.element : afterElement;
         cNode.parentNode.insertBefore(parentNode.element, cNode.nextSibling);
         //$(parentNode.element).insertAfter((afterElement.node ? afterElement.node.element : afterElement ) )

         this._arrayElements.push({ node : parentNode, localScope : localScope} );
         this.element.$scope = localScope;
         this.element.$tag = self;
         //Running children
         this.run({
            structure   : parentDom.c || [],
            parentNode  : parentNode,
            scope       : localScope
         });
      },
      removeItem : function(index, howmany){
         // Removing elements from the DOM

         for (var i = index; i < index + howmany; i++) {

            if ( this._arrayElements[i] ){
                var el = this._arrayElements[i].node.element;
                el.$tag.gc();
            }
			}
         this._arrayElements.splice(index, howmany);
         // Reset indexes for items
         _.each(this._arrayElements, function(item, index){
            item.localScope.index = index;
         });
      },
      onEvent : function(event, target, howmany){
         if ( event === 'push'){
            this.addItem(target);
         }
         if ( event === 'splice'){
            this.removeItem(target, howmany);
         }
      }
   });
});

domain.service("TagAttribute", ['GarbageCollector', '$evaluate'], function(GarbageCollector, $evaluate) {
   var TagAttribute = GarbageCollector.extend({
      initialize: function(opts, item) {
         this.attr = opts.attr;
         this.name = opts.name;
         this.scope = opts.scope;
         this.element = opts.element;
         this.item = item;
      },
      create: function() {
         this.attribute = document.createAttribute(this.name);

         this.element.setAttributeNode(this.attribute);
         this.watcher = this.startWatching();
      },
      onValue: function(data) {
         this.attribute.value = data.str;
      },
      startWatching: function() {
         var self = this;

         return $evaluate(this.attr, {
            scope: this.scope,
            changed: function(data) {
               // If we have a custom listener
               if (self.onExpression) {
                  if (data.expressions && data.expressions.length > 0) {
                     self.onExpression.bind(self)(data.expressions[0]);
                  } else {
                     self.onExpression.bind(self)();
                  }
               } else {
                  if (self.onValue) {
                     self.onValue.bind(self)(data);
                  }
               }
            }

         });
      }
   });
   return TagAttribute;
});

domain.service("$tagAttrs", ['TagAttribute', '$evaluate', '$customAttributes'],
   function(TagAttribute, $evaluate, $customAttributes) {
      return {
         create: function(item, scope, element) {
            var attributes = [];

            _.each(item.a, function(attr, name) {

               var customPath = "attrs." + name;
               var tagAttribute;

               var opts = {
                  scope: scope,
                  attr: attr,
                  name: name,
                  element: element
               };
               if ($customAttributes[customPath]) {

                  tagAttribute = new $customAttributes[customPath](opts, item);
               } else {
                  tagAttribute = new TagAttribute(opts, item);
               }

               if (tagAttribute) {
                  tagAttribute.create();
                  attributes.push(tagAttribute);
               } else {
                  console.log("no attr", customPath);
               }
            });
            return attributes;
         }
      };
   });

domain.service("TagNode", ['$tagAttrs', 'GarbageCollector'],function($tagAttrs, GarbageCollector){

   return GarbageCollector.extend({
      initialize : function(item, scope){
         this.item = item;
         this.scope = scope;

         this.children = [];
         var self = this;
      },
      setElement : function(element){
         this.element = element;
         this.element.$scope = this.scope;
         this.element.$tag = this;
      },
      create : function(parent){
         var el = document.createElement(this.item.n);
         
         // We need to have the element it is has animation property
         if ( this.item.a && this.item.a["ws-animation"] ) {
            $(el).hide();
         }
         this.setElement(el);
         if ( parent ){
            parent.addChild(this);
         }
         this.startWatching();
         return this.element;
      },
      addChild : function(child){
         $(this.element).append(child.element);
         this.children.push(child);
      },
      // Create attributes here
      // Watching if dom Removed
      startWatching : function(){
         var self = this;

         this.attributes = $tagAttrs.create(this.item, this.scope, this.element);
      }
   });
});

(function(){


domain.service("TextNode", ['$evaluate', 'GarbageCollector'],function($evaluate, GarbageCollector){

   return GarbageCollector.extend({
      initialize : function(item, scope){
         this.item = item;
         this.scope = scope;
      },
      create : function(parent){
         var self = this;
         this.firstLoad = true;

         var data = watcher = $evaluate(this.item.d, {
            scope: this.scope,
            changed: function(data) {
               if ( self.firstLoad === false ){
                  self.element.nodeValue = data.str;
               }
               self.firstLoad = false;
            }
         });
         this.watchers = data;
         this.element = document.createTextNode(data.str);
         if ( parent ){
            parent.addChild(this);
         }
         return this.element;
      }
   })

})
})();

(function() {
   domain.service("$array", ['$http', '$resource', '$restEndPoint'], function($http, $resource, $restEndPoint) {
      return function(a, b) {
         var opts;
         var array;
         if (_.isArray(a)) {
            array = a;
            opts = b || {};
         } else {
            array = [];
            opts = _.isPlainObject(a) ? a : {};
         }
         var endpoint = opts.endpoint;
         if (_.isString(a)) {
            endpoint = a;
         }

         // Array has been already initialized
         if (array.$watch)
            return array;

         var watchers = [];

         var notify = function() {
            var args = arguments;
            _.each(watchers, function(watcher) {
               if (watcher) {
                  watcher.apply(null, args);
               }
            });
         };

         array.$watch = function(cb) {
            watchers.push(cb);
            return {
               // Detaching current callback
               detach: function() {
                  var index = watchers.indexOf(cb);
                  watchers.splice(index, 1);
               }
            };
         };

         // clean up array
         array.$removeAll = function() {
            array.splice(0, array.length);
         };

         array.$empty = function() {
            this.$removeAll();
         };

         // Completely destroys this.array
         // Removes all elements
         // Detaches all watchers
         array.$destroy = function() {
            array.$removeAll();
            _.each(watchers, function(watcher) {
               delete watchers[watcher];
            });
            watchers = undefined;
         };

         // fetching is rest endpoint is provided
         array.$fetch = function(params) {
            var self = this;
            return new Promise(function(resolve, reject) {
               var params = params || {};
               if (!endpoint) {
                  throw {
                     message: "Can't fetch without the endpoint!"
                  };
               }
               var url = $restEndPoint(endpoint, params);

               return $http.get(url, params).then(function(data) {
                  // If we get the result, removing everything
                  self.$removeAll();
                  _.each(data, function(item) {
                     self.push($resource(item, {
                        endpoint: endpoint,
                        array: self
                     }));
                  });
                  return resolve(self);
               }).catch(reject);
            });
         };

         // Adding new value to array
         array.$add = function() {
            var self = this;
            var items = _.flatten(arguments);
            return new Promise(function(resolve, reject) {
               return domain.each(items, function(item) {
                  var data = _.isFunction(item.$getAttrs) ? item.$getAttrs() : data;
                  // Reset errors
                  if (item.$err) {
                     item.$err = undefined;
                  }
                  // if api is restull need to perform a request
                  if (endpoint) {
                     var url = $restEndPoint(endpoint, data);
                     return $http.post(url, data);
                  }
                  return item;
                  //array.push(item)
               }).then(function(newrecords) {
                  _.each(newrecords, function(item) {
                     array.push($resource(item, {
                        endpoint: endpoint,
                        array: self
                     }));
                  });

                  return resolve(newrecords);
               }).catch(function(e) {

                  // Storing error message to items
                  _.each(items, function(item) {
                     item.$err = e.message && e.message.message ? e.message.message :
                        e;
                  });
                  // Continue here
                  return reject(e);
               });
            });

         };

         // Watching variable size
         array.size = array.length;

         // overriding array properties
         array.push = function(target) {
            target = _.isFunction(target.$getAttrs) ? target.$getAttrs() : target;
            var push = Array.prototype.push.apply(this, [target]);
            notify('push', target);
            array.size = array.length;
            return push;
         };

         // Splicing (removing)
         array.splice = function(index, howmany) {

            notify('splice', index, howmany);
            var sp = Array.prototype.splice.apply(this, arguments);
            array.size = array.length;
            return sp;
         };

         // Convinience methods
         array.$remove = function(index) {
            if (_.isObject(index)) {
               index = this.indexOf(index);
            }
            return this.splice(index, 1);
         };
         return array;
      };
   });
})();

(function(){
   domain.service("$resource", ['$restEndPoint', '$http'], function($restEndPoint, $http){
      return function(a, b){
         var opts = {};
         var obj;
         var endpoint;

         if ( _.isObject(a) ){
            obj = a || {};
            opts = b || {};
            endpoint = opts.endpoint;
         }
         if (_.isString(a)){
            endpoint = a;
            obj = {};
         }

         var array = opts.array;

         obj.$reset = function(){
            _.each(this, function(v, k){
               if ( !k.match(/^(\$|_)/)){
                 this[k] = undefined;
               }
            }, this);
         }


         obj.$fetch = function(o){

            return new Promise(function(resolve, reject){
               if (endpoint){
                  var pm = o || {};
                  var url = $restEndPoint(endpoint, pm);
                  $http.get(url, pm).then(function(data){
                     _.each(data, function(v, k){
                        obj[k] = v;
                     })
                     return resolve(obj)
                  }).catch(function(e){
                     return reject(e)
                  })

               }
            })
         }

         obj.$remove = function(){
            return new Promise(function(resolve, reject){
               // Removing from the parent array
               if (endpoint){
                  var url = $restEndPoint(endpoint, obj);
                  $http.delete(url).then(function(){
                     if ( array ){
                        array.$remove(obj);
                     }
                     obj.$reset();
                     return resolve()
                  }).catch(function(){
                     return reject(e)
                  })
               } else {
                  if ( array ){
                     array.$remove(obj);
                     return resolve();
                  }
               }
            })
         }

         return obj
      }
   })

})();

(function(){
   domain.service("attrs.ws-animation", ['TagAttribute', '$evaluate', '$projectAnimations'], function(TagAttribute, $evaluate, $projectAnimations){

      var WsAnimate = TagAttribute.extend({
         create : function(){

            var self = this;
            var data = $evaluate(self.attr, {
               scope: self.scope,
               element: self.element,
               target: this.scope,
               watchVariables: false
            });

            if ( data.str ){
               this.animationType = data.str;
               var animation;
               var el = $(this.element);
               if ( ( animation = $projectAnimations[this.animationType] )){
                  if ( _.isPlainObject(animation)){
                     if ( animation.onCreate){
                        animation.onCreate.bind(self.element)();
                     }
                     if (animation.onDestroy){
                        // Set destroy animation for element
                        self.element.$destroy = animation.onDestroy;
                     }
                     if (animation.animate){
                        self.element.$animate = animation.animate;
                     }
                  }
               }
            }
         }
      });
      return WsAnimate;
   });
})();

(function() {
   domain.service("attrs.ws-checked", ['TagAttribute', '$array'],
      function(TagAttribute, $array) {
         var WsOption = TagAttribute.extend({
            create: function() {

               var currentVar = this.element.$variable;
               if (currentVar) {
                  this.currentValue = currentVar.value.value;
               }
               this.watcher = [];
               this.watcher.push(this.startWatching());

               this.arrayWatcher = false;
            },
            onValue: function(v) {

               var self = this;
               if (this.selfUpdate === true) {
                  this.selfUpdate = false;
                  return;
               }
               var targetObject = v.locals[0].value;
               var targetValue = v.locals[0].value.value;
               this.element.$checked = targetObject;

               if (_.isArray(targetValue)) {
                  // Convert to $array object just in case
                  targetValue = $array(targetValue);

                  // Check if this array is watched
                  if (!this.arrayWatcher) {
                     this.watcherCreated = true;
                     var validateValues = function() {
                        var shouldBeChecked = false;
                        _.each(targetValue, function(item) {
                           if (_.isEqual(item, self.currentValue)) {
                              shouldBeChecked = true;
                           }
                        });

                        self.element.checked = shouldBeChecked;

                     };
                     this.arrayWatcher = targetValue.$watch(function(event, start, end) {
                        $defered(function() {
                           validateValues();
                        });
                     });
                     self.watcher.push(self.arrayWatcher);
                  }
                  if (this.currentValue) {
                     var isChecked = targetValue.indexOf(this.currentValue) > -1;
                     if (isChecked) {
                        this.element.checked = true;
                     } else {
                        this.element.checked = false;
                     }
                  }
               } else {
                  this.selfUpdate = true;
                  this.element.checked = targetValue ? true : false;
                  //targetObject.update(targetValue ? true : false);
               }
            }
         });
         return WsOption;
      });
})();

(function() {
   domain.service("attrs.ws-class", ['TagAttribute'], function(TagAttribute) {
      var WsVisible = TagAttribute.extend({
         // Overriding default method
         // (we don't need to create an attribute for this case)
         create: function() {
            this.watcher = this.startWatching();
         },
         onExpression: function(expression) {
            var el = $(this.element);
            if (expression) {
               if (_.isPlainObject(expression.value)) {
                  _.each(expression.value, function(v, cls) {
                     if (v) {
                        if (!el.hasClass(cls)) {
                           el.addClass(cls)
                        }
                     } else {
                        el.removeClass(cls)
                     }
                  });
               }
            }
         }
      });
      return WsVisible;
   })
})();

(function(){
   domain.service("attrs.ws-click", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate){
      var WsClick = TagAttribute.extend({
         // Overriding default method
         // (we don't need to create an attribute for this case)
         detach : function(){
            if ( this.element ){
               this.element.removeEventListener(this.eventName, this.elementClicked);
            }
         },
         create : function(){
            var self = this;
            this.elementClicked = function(e){
               var target = e.target;
               var data = $evaluate(self.attr, {
                  scope: self.scope,
                  element : target,
                  target : { scope: target.$scope, element : self.element },
                  watchVariables : false
               });
               e.preventDefault();
            };
            this.eventName = window.isMobile ? "touchend" : "click";
            this.clickListener = this.element.addEventListener(this.eventName, this.elementClicked);
         }
      });
      return WsClick;
   });
})();

(function() {
   var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
   var getClientCoords = function(e){
      var coords = {
         x : e.clientX,
         y : e.clientY
      };
      if ( e.originalEvent.touches  ){
         var c;
         if ( ( c = e.originalEvent.touches[0]) ){
            coords.x = c.clientX;
            coords.y = c.clientY;
         }
      }
      return coords;
   };

   domain.service("attrs.ws-drag", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate) {
      var WsClick = TagAttribute.extend({
         // Overriding default method
         // (we don't need to create an attribute for this case)
         create: function() {
            var self = this;


            var fireEvent = function(ev) {
                  var original = ev.e.originalEvent ? ev.e.originalEvent.target : ev.e.target;
                  ev.target = original.$scope;
                  ev.element = original;
                  var data = $evaluate(self.attr, {
                     scope: self.scope,
                     target: ev,
                     watchVariables: false
                  });
            };
            // Binding events

            var m = window.isMobile;
            $(this.element).bind(m ? "touchstart" : "mousedown", function(e) {
               if ( is_firefox ){
                  e.preventDefault();
               }
               var startCoords = getClientCoords(e);
               fireEvent({
                  e: e,
                  coords: startCoords,
                  type: "start"
               });
               $(this).bind(m ? "touchmove" : "mousemove", function(e) {
                  var x = startCoords.x - getClientCoords(e).x;
                  var y = startCoords.y - getClientCoords(e).y;
                  var coords = {
                     x: x,
                     y: y,
                     dy: y < 0 ? "down" : "up",
                     dx: x < 0 ? "right" : "left"
                  };
                  fireEvent({
                     e: e,
                     coords: coords,
                     type: "move"
                  });
               });
               $(this).bind(m ? "touchend touchleave touchcancel" : "mouseup", function(e) {
                  if ( is_firefox ){
                     e.preventDefault();
                  }
                  fireEvent({
                     e: e,
                     type: "stop"
                  });
                  $(this).unbind("mouseup mousemove")
               })
            });
         }

      });
      return WsClick;
   });
})();

(function() {


   domain.service("attrs.ws-href", ['TagAttribute', '$history'],
      function(TagAttribute, $history) {
         var WsVisible = TagAttribute.extend({
            // Overriding default method
            // (we don't need to create an attribute for this case)
            create: function() {
               this.watcher = this.startWatching();
            },
            detach : function(){
               if ( this.element ){
                  this.element.removeEventListener("click", this.clickListener);
               }
            },
            onValue: function(v) {
               if (v && v.str) {
                  var link = v.str;

                  if (this.element.nodeName === "A") {
                     this.element.setAttribute("href", link);
                  }
                  this.clickListener = this.element.addEventListener("click", function(event){
                     event.preventDefault();
                     $history.go(link);
                  })
               }
            }
         });
         return WsVisible;
      })
})();

(function() {
   domain.service("attrs.ws-submit", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate) {
      var WsClick = TagAttribute.extend({
         detach: function() {
            if (this.submitListener) {
               this.element.removeEventListener("submit", this.submitListener);
            }
         },
         create: function() {
            var self = this;
            this.submitListener = function(event) {
               try {
                  $evaluate(self.attr, {
                     scope: self.scope,
                     element: event.target,
                     target: {
                        scope: event.target.$scope,
                        element: event.target
                     },
                     watchVariables: false
                  });
               } catch (e) {
                  console.error(e.stack || e);
               }
               event.preventDefault();
            };
            this.element.addEventListener("submit", this.submitListener);
         }
      });
      return WsClick;
   });

})();

(function() {
   domain.service("attrs.ws-value", ['TagAttribute', '$evaluate', '$projectValidators'],
      function(TagAttribute, $evaluate, $projectValidators) {
         var WsVisible = TagAttribute.extend({
            // Overriding default method
            // (we don't need to create an attribute for this case)
            create: function() {
               this.watcher = this.startWatching();
               var validation = this.item.validate;
               if (validation) {
                  this.validators = [];
                  _.each(validation, function(item) {
                     // if validator is registered
                     if ($projectValidators[item.n]) {
                        this.validators.push({
                           validator: $projectValidators[item.n],
                           item: item
                        });
                     }
                  }, this);
               }
            },
            // Unbind listeners!!!
            detach: function() {
               if (this.keyDownListener) {
                  this.element.removeEventListener("keydown", this.keyDownListener);
               }
               if (this.clickListener) {
                  this.element.removeEventListener("click", this.clickListener);
               }
               delete this.validatonDelay;
            },
            // Happpens on new value
            checkValidations: function(data) {
               var self = this;
               if (!self.validators) {
                  return;
               }
               // We don't want to apply a check right away
               // Give a user a bit time to type his bloody email!
               clearInterval(this.validatonDelay);
               this.validatonDelay = setTimeout(function() {
                  _.each(self.validators, function(conf) {
                     var args = conf.item.a ? conf.item.a : [];
                     var clsName = conf.validator.cls;
                     var errorMessage = conf.validator.validate.apply(data, args);
                     if (errorMessage !== undefined) {
                        if (!$(self.element).hasClass(clsName)) {
                           $(self.element).addClass(clsName);
                        }
                     } else {
                        if ($(self.element).hasClass(clsName)) {
                           $(self.element).removeClass(clsName);
                        }
                     }
                  });
               }, 500);

            },
            startWatching: function() {
               var self = this;
               this.selfUpdate = false;

               // Binding variable
               var watcher = $evaluate(this.attr, {
                  scope: this.scope,
                  changed: function(data) {
                     self.checkValidations(data);
                     if (self.selfUpdate === false) {
                        self.setValue(data.str);
                     }
                     self.selfUpdate = false;
                  }
               });

               // Extracting the first variable defined
               if (watcher.locals && watcher.locals.length === 1) {
                  this.variable = watcher.locals[0];
               }
               // store variable to the element
               this.element.$variable = this.variable;

               this.bindActions(function(newValue) {
                  if (self.variable) {
                     self.selfUpdate = true;
                     self.variable.value.update(newValue);
                  }
               });
               return watcher;
            },

            setValue: function(v) {
               $(this.element).val(v);
            },
            bindActions: function(cb) {
               var self = this;
               var nodeName = this.element.nodeName.toLowerCase();
               var elType = $(this.element).attr('type');
               if (nodeName === 'textarea') {
                  elType = nodeName;
               }
               if (nodeName === 'select') {
                  elType = nodeName;
               }
               if (nodeName === 'option') {
                  elType = nodeName;
               }
               if (nodeName === 'input' && !elType) {
                  elType = 'text';
               }

               switch (elType) {
                  case 'text':
                  case 'email':
                  case 'date':
                  case 'datetime':
                  case 'month':
                  case 'search':
                  case 'url':
                  case 'tel':
                  case 'password':
                  case 'textarea':
                     this.keyDownListener = function(evt) {
                        var _that = this;
                        clearInterval(self.interval);
                        self.interval = setTimeout(function() {
                           cb($(_that).val());
                        }, 200);
                     };
                     this.element.addEventListener("keydown", this.keyDownListener, false);
                     break;
                  case 'checkbox':

                     this.clickListener = function(evt) {
                        var target = this.$checked;
                        if (_.isArray(target.value)) {
                           var currValue = self.variable.value.value;
                           var index = target.value.indexOf(currValue);
                           if (this.checked) {
                              if (index === -1) {
                                 target.value.push(currValue);
                              }
                           } else {
                              // Removing value from an array
                              if (index > -1) {
                                 target.value.splice(index, 1);
                              }
                           }
                        } else {
                           self.selfUpdate = true;
                           self.variable.value.update(this.checked);
                        }
                     };
                     this.element.addEventListener("click", this.clickListener);
                     break;
                  case 'option':

                     break;
                  case 'select':

                     $(this.element).change(function() {
                        var value = self.detectSelectValue();
                        cb(value);
                     });
                     $defered(function() {
                        // If we have set the variable beforehand
                        if (self.variable.value.value !== undefined) {
                           $(self.element).find("option").each(function(index, i) {
                              if (i.$variable) {
                                 if (_.isEqual(i.$variable.value.value, self.variable.value.value)) {
                                    i.selected = true;
                                 }
                              }
                           });
                        } else {
                           // In Any other case
                           // we should update variable with first option
                           var firstValue = self.detectSelectValue(true);
                           self.selfUpdate = true;
                           self.variable.value.update(firstValue);
                        }
                     });
                     break;
               }
            },
            detectSelectValue: function(first) {
               var value;
               $(this.element).find(first ? "option:first" : "option:selected").each(function() {

                  var el = this;
                  var tag = this.$tag;
                  // in case of option
                  var storedVariable = this.$variable;
                  if (storedVariable) {
                     value = storedVariable.value.value;
                  } else {
                     // Checking the value from simple attribute "value"
                     _.each(tag.attributes, function(attr) {
                        if (attr.name === "value") {
                           value = $(el).val();
                        }
                     });
                     // if value is stil undefined
                     // try to get it from html
                     if (value === undefined) {
                        value = $(el).html();
                     }
                  }

               });
               return value;
            },
         });
         return WsVisible;
      });

})();

(function(){
   domain.service("attrs.ws-visible", ['TagAttribute'], function(TagAttribute){
      var WsVisible = TagAttribute.extend({
         // Overriding default method
         // (we don't need to create an attribute for this case)
         create : function(){
            this.watcher = this.startWatching();
         },
         onExpression : function(expression){
            if ( expression ){
            //   console.log("Bllody visible",expression.value)
               if ( expression.value ){
                  $(this.element).show(0);
               } else {
                  $(this.element).hide(0);
               }
            }
         }
      });
      return WsVisible;
   })
})();

domain.service("animations.ws-fade", function(){
   return {
      animate : function(){
         $(this).velocity({ rotateX: 90}).velocity({ rotateX: 1});
      },
      onCreate : function(){
         var el = $(this);
         el
            .css("opacity", 0)
            .show()
            .velocity({ opacity: 1},{  duration: 400 });
      },
      onDestroy : function(){

         var el = $(this);
         return new Promise(function(resolve, reject){
            el.velocity({ opacity: 0},{  duration: 400, complete : resolve});
         });
      }
   };
});

domain.service("animations.ws-spring", function() {
   return {
      onCreate: function() {
         var el = $(this);
         el.show()
            .velocity({
               scale: 0,
               opacity : 0
            }, {
               duration: 1
            }).velocity({scale : 1, opacity: 1},  { easing :[ 250, 15 ] });
      },
      onDestroy: function() {
         var el = $(this);
         return new Promise(function(resolve, reject) {
            el.velocity({scale : 0, opacity : 0},  { duration : 200,complete: resolve});
         });
      }
   };
});

domain.service("controllers.Kukka", function($array, $form, $resource, $restEndPoint) {
   return ['kukka.html', function() {
      this.users = [{name : "ivan"}, {name : "bang"}];
      this.someScope = {
         name : "Name from another scope"
      };
   }];
});
