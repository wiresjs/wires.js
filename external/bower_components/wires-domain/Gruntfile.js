module.exports = function(grunt) {

	var targetFiles = [
		'./lib/promise.js',
		'./src/wires-domain.js',
	];

	grunt.initConfig({
		concat: {
			options: {
				separator: ';',
			},
			dist: {
				src: targetFiles,
				dest: './dist/wires-domain.js',
			},
		},
		uglify: {
			my_target: {
				files: {
					'./dist/wires-domain.min.js': targetFiles
				}
			}
		},

	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.task.run('uglify');

	grunt.registerTask('default', ['concat','uglify']);


};
