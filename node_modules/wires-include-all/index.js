var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise')
var walk = require("walk");
var path = require("path");

domain.service("$includeAll", function() {
   return function(folder, myOptions) {

      return new Promise(function(resolve, reject) {
         walker = walk.walk(folder, {
            followLinks: true
         });
         var files = [];
         var options = myOptions || {};
         var rootPath = options.rootPath;
         var tagOutput = options.tagOutput;

         var order = options.order || [];
         walker.on("file", function(root, fileStats, next) {
            var fname = fileStats.name;
            var ext = path.extname(fileStats.name);
            // Pass only javascript files
            if (ext === ".js") {
               files.push(path.join(root, fname));
            }

            next();
         });

         walker.on("errors", function(root, nodeStatsArray, next) {
            next();
         });

         walker.on("end", function() {
            var sortedList = [];

            if (order.length === 0) {
               sortedList = files;
            } else {
               _.each(order, function(item) {
                  _.each(files, function(f) {
                     if (f.indexOf(item) > -1) {
                        if (_.indexOf(sortedList, f) < 0) {
                           sortedList.push(f)
                        }
                     }
                  })
               });
               // Add files that did not match the order
               _.each(files, function(f){
                  if ( _.indexOf(sortedList, f) < 0 ){
                     sortedList.push(f);
                  }
               })
            }
            // Adding rootPath if needed
            if ( rootPath ){
               folder = folder.replace("./",'');
               _.each(sortedList, function(item, index){

                  console.log(item)
                  sortedList[index] = path.join(rootPath, item.replace(folder, ''));
               })
            }

            if ( tagOutput){
               var tpl = _.template('<script src="<%- file %>"></script>');
               var output = [];
               _.each(sortedList, function(item){
                  output.push(tpl({file : item}))
               })
               sortedList = output.join("\n");
            }
            return resolve(sortedList)
         });
      })

   }
})
// domain.require(function($includeAll) {
//    $includeAll("./test_folder", {
//       order: ['app.js', 'first/'],
//       rootPath : "myfiles",
//       tagOutput : true
//    }).then(function(list){
//       console.log(list)
//    })
// })
