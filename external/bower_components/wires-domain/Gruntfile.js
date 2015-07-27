module.exports = function(grunt) {

	var targetFiles = [
	   './bower_components/async/dist/async.min.js',
      './bower_components/lodash/lodash.min.js',
      './lib/promise.js',
      './src/wires-domain.js',
	];

	grunt.initConfig({
		uglify : {
			my_target : {
				files : {
					'./dist/wires-domain.min.js' : targetFiles
				}
			}
		},

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.task.run('uglify');

	grunt.registerTask('default', ['uglify']);


};
