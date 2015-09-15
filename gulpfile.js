var gulp = require("gulp");
var concat = require('gulp-concat');
var includeAll = require("wires-include-all");
var _ = require('lodash');
var uglify = require('gulp-uglify');

var external = [
   'external/lib/path2regexp.js',
   'external/lib/wires.class.js',
   'external/bower_components/wires-domain/dist/wires-domain.js',
];

var data = {
   files: []
};

gulp.task('default', ['getFiles'], function() {
   return gulp.src(data.files)
      .pipe(concat('wires.js'))
      .pipe(gulp.dest('./dist/'))

   .pipe(uglify())
      .pipe(gulp.dest('./dist/min/'));
});

gulp.task('getFiles', function(done) {
   includeAll("./src", {
      order: ['essential/'],
      rootPath: "./src/",
   }).then(function(list) {
      var newlist = [];
      _.each(list, function(item) {

         if (item.indexOf("test") === -1) {
            newlist.push(item);
         }
      });
      data.files = _.union(external, newlist);
      console.log(data.files);
      done();
   }).catch(function(e) {
      console.log(e.stack);
   });
});
