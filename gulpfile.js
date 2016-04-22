var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var concatUtil = require('gulp-concat-util');
var stream = require('stream');
var es = require('event-stream');
var _ = require('lodash')
var wiresDomain = require('wires-domain');

gulp.task('watch', function() {
   gulp.watch(['src/**/*.js'], ['build']);
});

gulp.task("build", function() {
   return gulp.src("src/**/*.js")
      //.pipe(sourcemaps.init())

   .pipe(wiresDomain.transpile.importify())
      .pipe(concat("build.js"))
      .pipe(babel())
      .on('error', function(e) {
         console.log('>>> ERROR', e.stack);
         // emit here
         this.emit('end');
      })
      .pipe(concatUtil.header(wiresDomain.transpile.header()))
      .pipe(concatUtil.footer(wiresDomain.transpile.footer()))
      .pipe(gulp.dest("dist/"))
});
