var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var concatUtil = require('gulp-concat-util');
var stream = require('stream');
var es = require('event-stream');
var _ = require('lodash')
var realm = require('realm-js');
var runSequence = require('run-sequence');
var spawn = require('child_process').spawn;
var node;
require("./build/universal.js")

gulp.task('server', function() {
   if (node) node.kill()
   node = spawn('node', ['app.js'], {
      stdio: 'inherit'
   })
   node.on('close', function(code) {
      if (code === 8) {
         gulp.log('Error detected, waiting for changes...');
      }
   });
});

gulp.task('watch', function() {
   gulp.watch(['src/**/*.js'], ['build']);
   gulp.watch(['views/**/*.html'], ['build-views']);

   //gulp.watch(['views/**/*.html'], ['build-views']);
});
gulp.task("build-views", function(done) {
   realm.require('wires.compiler.SchemaGenerator', function(Generator) {

      return Generator.compact("test-app/app/schemas/", "wires.schema.test", "build/views.js");
   }).then(function() {
      console.log("ALL GOOD")
      done()
   }).catch(function(e) {

      console.log(e)
      done();
   })

});
gulp.task("build", function(done) {
   return realm.transpiler2.universal("src/", "build/");
});;

gulp.task("build-app", function(done) {
   return realm.transpiler2.universal("test-app/", "build/app");
});;

gulp.task('start', function() {
   return runSequence('build', 'build-app', 'build-views', function() {
      runSequence('server')

      gulp.watch(['src/**/*.js'], function() {

         return realm.transpiler2.universal("src/", "build/").then(function(changes) {
            runSequence('server')
         });
      });

      gulp.watch(['test-app/**/*.js'], function() {

         runSequence('build-app')
      });

      gulp.watch(['test-app/**/*.html'], function() {

         return realm.transpiler2.universal("test-app/", "build/app").then(function(changes) {
            runSequence('server')
         });
      });
      gulp.watch(['test-app/app/schemas/**/*.html'], function() {
         runSequence('build-views');
      });
   });
});
