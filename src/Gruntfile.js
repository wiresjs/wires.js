module.exports = function(grunt) {

	var targetFiles = [ 
	    
	    './lib/htmlparser.js',
	    './src/wires-config.js',
	    './src/wires-events.js',
	    './src/wires-extend.js',
	    './src/wires-object-utils.js',
	    
	    './src/acts/main.js',
	    './src/acts/toggle.js',
	    
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
	    
	    
	    './src/attributes/if.js',
	    './src/attributes/visible.js',
	    './src/attributes/repeat.js',
	    './src/attributes/value.js',
	    './src/attributes/click.js',
	    './src/attributes/animation.js',
	    './src/attributes/submit.js',
	    './src/attributes/selected.js',
	    './src/attributes/ws-class.js',
	    
	    './src/wires-component.js',
	    
	    './src/mvc/wires-mvc.js',
	    './src/mvc/wires-collection.js',
	    './src/mvc/wires-model.js',
	    
	    './src/mvc/wires-dom.js',
	    './src/mvc/wires-controller.js',
	    './src/mvc/wires-connect.js'
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