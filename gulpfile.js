var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var concatUtil = require('gulp-concat-util');
var stream = require('stream');
var es = require('event-stream');
var _ = require('lodash')
var realm = require('realm-js');

gulp.task('watch', function() {
   gulp.watch(['src/**/*.js'], ['build']);
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
