module wires.compiler.SchemaGenerator;
import fs, walk, path from nodejs.utils;
import JSONifier from wires.compiler;
import lodash as _, Promise from utils;
import realm;

class SchemaGenerator {

   static service(dir, _package) {

      return SchemaGenerator.walkDirectory(dir).then(function(items) {
         var fn = ['realm.module("' + (_package || 'wires.sample.schema') + '", function(){'];
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

   static gulp() {

   }

   static express(dir, _package) {
      return (req, res, next) => {
         return SchemaGenerator.service(dir, _package).then(function(contents) {
            res.setHeader('content-type', 'text/javascript');
            return res.end(realm.transpiler.wrap(contents));
         });
      }
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
