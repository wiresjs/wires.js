var _ = require('lodash')
var cheerio = require('cheerio')
var walk = require("walk");
var fs = require("fs");
var path = require("path")
var Promise = require("promise")
var toSource = require('tosource')

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

var preCompile = function(str, opts) {
   var _counter = 0;

   var extractVariablesAndFunction = function(input, replaceString) {
      var _out = {};
      var params = /\$(\{)?(([a-zA-Z-0-9$.]+)(\([^\)]*\))?)(\})?/g.execAll(input)

      _.each(params, function(param, index) {

         var key = "$_v" + _counter++;
         // Preparing the string with macros
         if (replaceString) {
            str = str.split(param[0]).join(key);
         }
         var path = param[2].split(".");
         var stringFunc = param[4] !== undefined ? param[2] : false;
         // String functions
         if (stringFunc) {
            if (!_out.funcs) {
               _out.funcs = {};
            }
            // f is a full string (for evaluation)
            // we are not creating custom language parser (like in angular)
            var fSource = param[0];
            if (fSource[0] === "$") {
               fSource = "$." + fSource.slice(1, fSource.length)
            }
            _out.funcs[key] = {
               p: path,
               f: fSource
            }

         } else {
            if (!_out.vars) {
               _out.vars = {};
            }
            // Just variables and it's path
            // This variable will be watched
            _out.vars[key] = {
               p: path
            }
         }
      });
      return _out;
   }

   var _out = {};

   // Extract proxies
   var proxies = /\$(\w+):([a-zA-Z-0-9._]+)/g.execAll(str)
   _.each(proxies, function(_proxy){
      var key = "$_p" + _counter++;

      str = str.split(_proxy[0]).join(key);
      var proxyName = _proxy[1];
      var proxyKey = _proxy[2];
      if (!_out.x){
          _out.x = {}
      }
      _out.x[key] = { n : proxyName, k : proxyKey}
   })

   // Expressions within {{  }}
   // ******************************************************
   var expressions = /\{\{([^\}]+)\}\}/g.execAll(str)

   _.each(expressions, function(_expr) {

      var stringExpression = _expr[1];

      var exprOut = extractVariablesAndFunction(stringExpression)
      if (!_out.vars) {
         _out.vars = {};
      }
      var key = "$_e" + _counter++;

      str = str.split(_expr[0]).join(key);

      var ignoreNext = false;
      var replacedExpression = [];
      _.each(stringExpression, function(symbol) {

         if (!ignoreNext && symbol === "$") {
            replacedExpression.push('this.')
            ignoreNext = false;
         } else {
            replacedExpression.push(symbol);
            ignoreNext = false;
         }
         if (symbol === ".") {
            ignoreNext = true;
         }
      })

      _out.vars[key] = {
         e: replacedExpression.join('').trim(),
         v: exprOut.vars || {}
      }

   });

   // Variables and functions starting with $
   // ***************************************
   var _vout = extractVariablesAndFunction(str, true);
   _out.vars = _out.vars || {};
   _out.vars = _.merge(_out.vars, _vout.vars);
   if (_vout.funcs) {
      _out.funcs = _vout.funcs;
   }
   _out.tpl = str;
   if (!_.keys(_out.vars).length) {
      delete _out.vars;
   }

   return _out;
}

var getFiles = function(folder) {
   return new Promise(function(resolve, reject) {
      var walker = walk.walk(folder, {
         followLinks: true
      });
      var files = {};
      var destPath = folder.replace("./", '');

      walker.on("file", function(root, fileStats, next) {
         var fname = fileStats.name;
         var ext = path.extname(fileStats.name);
         // Pass only html files
         if (ext === ".html") {
            var filePath = path.join(root, fname);
            var contents = fs.readFileSync(filePath).toString();
            var destFile = filePath.replace(destPath, '')
            if (destFile[0] === "/") {
               destFile = destFile.slice(1, destFile.length);
            }
            files[destFile] = "<div><div>" + contents + "</div><div>";
         }
         next();
      });

      walker.on("errors", function(root, nodeStatsArray, next) {
         next();
      });

      walker.on("end", function() {
         return resolve(files);
      });
   })

}


var getJSONStructure = function(html) {
   var preCompileAttrs = function(_attrs) {
      var attrs = {};
      _.each(_attrs, function(value, key) {
         attrs[key] = preCompile(value);
      });
      return attrs;
   }

   $ = cheerio.load(html, {
      normalizeWhitespace: true
   })

   var iterate = function(parent) {
         var children = [];
         _.each(parent, function(_item) {
            var item;

            if (_item.type === "text") {
               // Don't pass empty text nodes
               if (/^\s+$/g.test(_item.data) === false) {
                  item = {
                     t: 1, // text
                     d: preCompile(_item.data.trim()) // data
                  }
                  children.push(item)
               }
            }
            if (_item.type === "tag") {
               item = {
                  t: 2, // tag
                  n: _item.name, // name
               }
               if (_item.attribs["ws-repeat"]) {
                  item.v = preCompile(_item.attribs["ws-repeat"])
                  delete _item.attribs["ws-repeat"];
                  delete item.n;

                  item.t = 3;
                  var it = {
                     t: 2,
                     n: _item.name,
                  }

                  if (_item.attribs && _.keys(_item.attribs).length) {
                     it.a = preCompileAttrs(_item.attribs)
                  }
                  if (_item.children && _item.children.length) {
                     it.c = iterate(_item.children)
                  }
                  item.i = [it]
                  children.push(item)
               }

               // Handle if case
               else if (_item.attribs["ws-if"]){
                  item.z = preCompile(_item.attribs["ws-if"])
                  delete _item.attribs["ws-if"];
                  delete item.n;
                  item.t = 4;
                  var it = {
                     t: 2,
                     n: _item.name,
                  }

                  if (_item.attribs && _.keys(_item.attribs).length) {
                     it.a = preCompileAttrs(_item.attribs)
                  }
                  if (_item.children && _item.children.length) {
                     it.c = iterate(_item.children)
                  }
                  item.c = [it]
                  children.push(item)
               }
                else {
                  if (_item.children && _item.children.length) {
                     item.c = iterate(_item.children)
                  }
                  if (_item.attribs && _.keys(_item.attribs).length) {

                     item.a = preCompileAttrs(_item.attribs)
                  }
                  children.push(item)
               }
            }
         })

         return children;
      }
      // get initial structure
   var data = iterate($("div").first().children()[0].children)

   return data;
}
// getFiles(folder).then(function(files) {
//    var html = files['test.html'];
//    var dom = getJSONStructure(html)
//    console.log(JSON.stringify(dom, 1, 1))
// }).catch(function(e){
//    console.log(e.stack)
// });

var getJavascript = function(folder, done){

    var js = ['(function($scope){\n'];
    js.push('var v = ');
    var collection = [];
    getFiles(folder).then(function(files) {
      collection = {};
      _.each(files, function(html, name){
         collection[name] = getJSONStructure(html);
      })
      js.push(toSource(collection))
      js.push("\n $scope.__wires_views__ = v;")
      js.push("\n})(window)")

      done(js.join(''));
    });

}
var _cachedViews;
module.exports = {
   views: function(folder, opts){
      var opts = opts || {};
      var cache = opts.cache;
      return {
         express : function(){
            return function(req, res, next){
               if ( _cachedViews){
                  return res.send(_cachedViews);
               }
               getJavascript(folder, function(js){
                  if ( cache ){
                     _cachedViews = js;
                  }

                  res.setHeader('content-type', 'text/javascript');
                  res.send(js)
               })
            }
         }
      }
   }
}
