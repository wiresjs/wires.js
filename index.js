var _ = require('lodash');
var cheerio = require('cheerio');
var walk = require("walk");
var fs = require("fs");
var path = require("path");
var Promise = require("promise");
var toSource = require('tosource');
var preCompile = require('./_compiler/precompile.js');
var validateSyntaxCompiler = require('./_compiler/validate.js');

RegExp.prototype.execAll = function(string) {
   var match = null;
   var matches = [];
   while ((match = this.exec(string))) {
      var matchArray = [];
      for (var i in match) {
         if (parseInt(i) == i) {
            matchArray.push(match[i]);
         }
      }
      matches.push(matchArray);
   }
   return matches;
};

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
            var destFile = filePath.replace(destPath, '');
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
   });

};

var getJSONStructure = function(html) {
   var preCompileAttrs = function(_attrs) {
      var attrs = {};
      _.each(_attrs, function(value, key) {
         attrs[key] = preCompile(value);
      });

      return attrs;
   };
   $ = cheerio.load(html, {
      normalizeWhitespace: true
   });

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
               };
               children.push(item);
            }
         }
         if (_item.type === "tag") {
            item = {
               t: 2, // tag
               n: _item.name, // name
            };
            // Extract validation
            if (_item.attribs["ws-validate"]) {
               item.validate = validateSyntaxCompiler(_item.attribs["ws-validate"]);
               delete _item.attribs["ws-validate"];
            }

            if (_item.attribs["ws-repeat"]) {
               item.v = preCompile(_item.attribs["ws-repeat"]);
               delete _item.attribs["ws-repeat"];
               delete item.n;

               item.t = 3;
               var it = {
                  t: 2,
                  n: _item.name,
               };
               if (item.validate) {
                  it.validate = item.validate;
               }
               if (_item.attribs && _.keys(_item.attribs).length) {
                  it.a = preCompileAttrs(_item.attribs);
               }
               if (_item.children && _item.children.length) {
                  it.c = iterate(_item.children);
               }
               item.i = [it];
               children.push(item);
            }

            // Handle if case
            else if (_item.attribs["ws-if"]) {
               item.z = preCompile(_item.attribs["ws-if"]);
               delete _item.attribs["ws-if"];
               delete item.n;
               item.t = 4;
               var it = {
                  t: 2,
                  n: _item.name,
               };
               if (item.validate) {
                  it.validate = item.validate;
               }

               if (_item.attribs && _.keys(_item.attribs).length) {
                  it.a = preCompileAttrs(_item.attribs);
               }
               if (_item.children && _item.children.length) {
                  it.c = iterate(_item.children);
               }
               item.c = [it];
               children.push(item);
            }
            // Including other template
            else if (_item.attribs["ws-include"]) {
               item.t = 5;
               item.v = _item.attribs["ws-include"];
               item.a = preCompileAttrs(_item.attribs);
               if (_item.children && _item.children.length) {
                  item.i = iterate(_item.children);
               }
               children.push(item);
            } else {
               if (_item.children && _item.children.length) {
                  item.c = iterate(_item.children);
               }
               if (_item.attribs && _.keys(_item.attribs).length) {
                  item.a = preCompileAttrs(_item.attribs);
               }
               children.push(item);
            }
         }
      });
      return children;
   };
   // get initial structure
   var data = iterate($("div").first().children()[0].children);

   return data;
};
// getFiles(folder).then(function(files) {
//    var html = files['test.html'];
//    var dom = getJSONStructure(html)
//    console.log(JSON.stringify(dom, 1, 1))
// }).catch(function(e){
//    console.log(e.stack)
// });

var getJavascript = function(folder, done) {

   var js = ['(function($scope){\n'];
   js.push('var v = ');
   var collection = [];
   getFiles(folder).then(function(files) {
      collection = {};
      _.each(files, function(html, name) {
         collection[name] = getJSONStructure(html);
      });
      js.push(toSource(collection));
      js.push("\n $scope.__wires_views__ = v;");
      js.push("\n})(window)");

      done(js.join(''));
   });

};
var _cachedViews;
module.exports = {
   views: function(folder, opts) {
      opts = opts || {};
      var cache = opts.cache;
      return {
         express: function() {
            return function(req, res, next) {
               if (_cachedViews) {
                  return res.send(_cachedViews);
               }
               getJavascript(folder, function(js) {
                  if (cache) {
                     _cachedViews = js;
                  }

                  res.setHeader('content-type', 'text/javascript');
                  res.send(js);
               });
            };
         },
         source: function(cb) {
            getJavascript(folder, function(js) {
               cb(js);
            });
         }
      };
   }
};
