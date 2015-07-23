module.exports = function(grunt) {

	var targetFiles = [

	    './lib/htmlparser.js',
		 './lib/path-to-regexp.js',
	    './src/wires-config.js',
	    './src/wires-events.js',
	    './src/wires-extend.js',
	    './src/wires-form.js',
	    './src/wires-object-utils.js',
		 './src/wires-root-scope.js',

	    './src/wires-node.js',
	    './src/wires-attr.js',
	    './src/wires-text-node.js',
	    './src/wires-tag-node.js',
	    './src/wires-compiler.js',
	    './src/wires-exec.js',
	    './src/wires-variable.js',
	    './src/wires-watcher.js',
	    './src/wires-base-attr.js',
	    './src/wires-variable-tricks.js',

		 './src/services/loader.js',
		 './src/services/query_string.js',
		 './src/services/history.js',
		 './src/services/http.js',
		 './src/services/array.js',
		 './src/services/waitForSelector.js',
		 './src/attributes/ws-href.js',
		 './src/wires-route.js',


	    './src/attributes/ws-if.js',
	    './src/attributes/ws-visible.js',
	    './src/attributes/ws-repeat.js',
	    './src/attributes/ws-value.js',
	    './src/attributes/ws-click.js',
	    './src/attributes/ws-animation.js',
	    './src/attributes/ws-submit.js',
	    './src/attributes/ws-selected.js',
	    './src/attributes/ws-class.js',
	    './src/attributes/ws-sortable.js',

	    './src/wires-dom.js',

	];

	grunt.initConfig({
		uglify : {
			my_target : {
				files : {
					'../build/wires.min.js' : targetFiles
				}
			}
		},

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.task.run('uglify');

	grunt.registerTask('default', ['uglify']);


};
