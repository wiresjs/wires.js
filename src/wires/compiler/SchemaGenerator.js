"use realm";

import fs, walk, path, stream from nodejs.utils;
import JSONifier from wires.compiler;
import lodash as _, Promise from utils;
import realm;

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

export SchemaGenerator;
