var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var concatUtil = require('gulp-concat-util');
var stream = require('stream');
var es = require('event-stream');
var _ = require('lodash')
var realm = require('realm-js');
require("./dist/build.js")
gulp.task('watch', function() {
   gulp.watch(['src/**/*.js'], ['build']);
   gulp.watch(['views/**/*.html'], ['build-views']);

   //gulp.watch(['views/**/*.html'], ['build-views']);
});
gulp.task("build-views", function() {
   realm.require('wires.compiler.SchemaGenerator', function(Generator) {
      return Generator.compact("views/", "wires.schema.test", "dist/views.js");
   });

});
gulp.task("build", function() {
   return gulp.src("src/**/*.js")
      //.pipe(sourcemaps.init())

   .pipe(realm.transpiler.importify())
      .pipe(concat("build.js"))
      .pipe(babel())
      .on('error', function(e) {
         console.log('>>> ERROR', e.stack);
         // emit here
         this.emit('end');
      })
      .pipe(realm.transpiler.universalWrap())
      .pipe(gulp.dest("dist/"))
});
