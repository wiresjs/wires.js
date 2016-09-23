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
var rename = require("gulp-rename");
var node;
var uglify = require('gulp-uglify');
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
      console.log('here')
      return Generator.compact(__dirname + "/schema/", "build/schema.js");
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

gulp.task("build-es5", function(){

   return gulp.src(["build/universal.js"])

   .pipe(rename("universal.es5.js"))
   .pipe(babel({
      presets: ["es2015"]
   }))
   .pipe(uglify())
   .pipe(gulp.dest("build/"))
})


gulp.task("build-standalone", ["build-es5"], function(){
   return gulp.src([
      "node_modules/async-watch/dist/async-watch.min.js",
      "node_modules/realm-server/dist/frontend/lodash.min.js",
      "node_modules/realm-server/dist/frontend/realm.min.js",
      "build/universal.es5.js"
   ])
   .pipe(concat("wires.standalone.js"))

   .pipe(gulp.dest("dist/"))
});
gulp.task('start', function() {
   return runSequence('build', 'build-app', 'build-views', function() {
      runSequence('server')

      gulp.watch(['src/**/*.js'], function() {

         return realm.transpiler2.universal("src/", "build/").then(function(changes) {
            runSequence('build-views');
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
      gulp.watch(['schema/**/*.html'], function() {
         runSequence('build-views');
      });
   });
});
